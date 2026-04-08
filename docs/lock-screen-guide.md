# macOS Lock Screen — Implementation Guide

A complete guide for adding a **macOS-style lock screen** that greets visitors before they enter the portfolio. The user types a password (like `123`) and the screen unlocks with a smooth transition revealing the desktop.

---

## Table of Contents

1. [Overview & UX Flow](#1-overview--ux-flow)
2. [File Structure](#2-file-structure)
3. [Zustand Store Changes](#3-zustand-store-changes)
4. [LockScreen Component](#4-lockscreen-component)
5. [Password Input with Dot Masking](#5-password-input-with-dot-masking)
6. [Clock & Date Display](#6-clock--date-display)
7. [User Avatar & Name](#7-user-avatar--name)
8. [Unlock Animation (GSAP)](#8-unlock-animation-gsap)
9. [Wrong Password Shake](#9-wrong-password-shake)
10. [Wallpaper Blur Transition](#10-wallpaper-blur-transition)
11. [Wiring into App.jsx](#11-wiring-into-appjsx)
12. [CSS Additions](#12-css-additions)
13. [Keyboard & Accessibility](#13-keyboard--accessibility)
14. [Fun Password Ideas](#14-fun-password-ideas)
15. [Mobile Adaptation](#15-mobile-adaptation)
16. [Optional Extras](#16-optional-extras)
17. [Full Component Code](#17-full-component-code)
18. [Summary Checklist](#18-summary-checklist)

---

## 1. Overview & UX Flow

```
Site loads
    │
    ▼
┌───────────────────────────────┐
│         LOCK SCREEN           │
│                               │
│   blurred wallpaper backdrop  │
│                               │
│        ┌──────────┐           │
│        │  avatar   │          │
│        └──────────┘           │
│        Umer Jamshaid          │
│                               │
│      [ • • • • • • • ]        │  ← password dots
│     "hint: it's easy 😉"     │
│                               │
│       12:45                   │
│   Tuesday, April 8            │
└───────────────────────────────┘
    │
    │  user types "123" + Enter
    ▼
┌───────────────────────────────┐
│  blur lifts, screen slides up │
│  revealing the desktop        │
│  (Welcome, Dock, Navbar, etc) │
└───────────────────────────────┘
```

**Behaviour:**
- Lock screen appears on page load, covering everything.
- Background = the same wallpaper GIF, heavily blurred.
- Clock + date are shown (macOS style, large centered time).
- User avatar + name sit above the password field.
- User types the password — each keystroke shows a dot `●`.
- Correct password → smooth GSAP unlock animation.
- Wrong password → field shakes, dots turn red briefly, then clear.

---

## 2. File Structure

```
src/
├── components/
│   └── LockScreen.jsx      ← NEW — the lock screen component
├── store/
│   └── window.js            ← ADD `isLocked` state + `unlock` action
```

Only **two files** are touched, plus one new component.

---

## 3. Zustand Store Changes

Add `isLocked` state and an `unlock` action to the existing store.

```js
// src/store/window.js — add to existing state & actions

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "#constants";

const useWindowStore = create(
  immer((set) => ({
    // ─── existing state ───
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,

    // ─── lock screen state ─── (NEW)
    isLocked: true,

    // ─── existing actions ───
    openWindow: (windowKey, data) => {
      set((state) => {
        state.windows[windowKey].isOpen = true;
        state.windows[windowKey].zIndex = state.nextZIndex++;
        if (data) state.windows[windowKey].data = data;
      });
    },
    closeWindow: (windowKey) => {
      set((state) => {
        state.windows[windowKey].isOpen = false;
        state.windows[windowKey].zIndex = INITIAL_Z_INDEX;
      });
    },
    focusWindow: (windowKey) => {
      set((state) => {
        state.windows[windowKey].zIndex = state.nextZIndex++;
      });
    },

    // ─── lock screen action ─── (NEW)
    unlock: () => {
      set((state) => {
        state.isLocked = false;
      });
    },
  }))
);

export default useWindowStore;
```

| Addition | Purpose |
|----------|---------|
| `isLocked: true` | Starts locked on every page load |
| `unlock()` | Sets `isLocked` to `false`, triggers removal/animation |

---

## 4. LockScreen Component

Create `src/components/LockScreen.jsx`:

```jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import dayjs from "dayjs";
import useWindowStore from "#store/window";

const PASSCODE = "123"; // ← change to whatever you want

const LockScreen = () => {
  const { isLocked, unlock } = useWindowStore();
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [time, setTime] = useState(dayjs());

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dotsRef = useRef(null);

  // ── keep clock ticking ──
  useEffect(() => {
    const id = setInterval(() => setTime(dayjs()), 1000);
    return () => clearInterval(id);
  }, []);

  // ── auto-focus the hidden input ──
  useEffect(() => {
    if (isLocked) inputRef.current?.focus();
  }, [isLocked]);

  // ── handle keystrokes ──
  const handleChange = useCallback(
    (e) => {
      const val = e.target.value;
      setInput(val);
      setError(false);
    },
    []
  );

  // ── submit on Enter ──
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        if (input === PASSCODE) {
          // correct → animate out then unlock
          gsap.to(containerRef.current, {
            y: "-100%",
            opacity: 0,
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: unlock,
          });
        } else {
          // wrong → shake
          setError(true);
          gsap.to(dotsRef.current, {
            x: [-12, 12, -8, 8, -4, 4, 0],
            duration: 0.5,
            ease: "power2.out",
          });
          setTimeout(() => {
            setInput("");
            setError(false);
          }, 800);
        }
      }
    },
    [input, unlock]
  );

  // ── don't render when unlocked ──
  if (!isLocked) return null;

  return (
    <div
      ref={containerRef}
      onClick={() => inputRef.current?.focus()}
      className="lock-screen"
    >
      {/* ── clock ── */}
      <div className="lock-clock">
        <p className="lock-time">{time.format("h:mm")}</p>
        <p className="lock-date">
          {time.format("dddd, MMMM D")}
        </p>
      </div>

      {/* ── avatar + name ── */}
      <div className="lock-profile">
        <img src="/images/umer.jpg" alt="Umer Jamshaid" />
        <p className="lock-name">Umer Jamshaid</p>
      </div>

      {/* ── password field ── */}
      <div className="lock-input-area">
        {/* hidden native input captures typing */}
        <input
          ref={inputRef}
          type="password"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="sr-only"
          aria-label="Enter passcode"
          autoComplete="off"
        />

        {/* visual dot display */}
        <div
          ref={dotsRef}
          className={`lock-dots ${error ? "lock-dots-error" : ""}`}
        >
          {input.length === 0 ? (
            <span className="lock-placeholder">Enter Password</span>
          ) : (
            Array.from({ length: input.length }).map((_, i) => (
              <span key={i} className="lock-dot" />
            ))
          )}
        </div>

        <p className="lock-hint">Hint: try 123 😉</p>
      </div>
    </div>
  );
};

export default LockScreen;
```

---

## 5. Password Input with Dot Masking

macOS doesn't show characters — it shows **dots** that pop in one at a time.

**How it works:**
- A **hidden** `<input type="password">` captures real keystrokes.
- A **visible** row of `<span className="lock-dot" />` renders one dot per character.
- Clicking anywhere on the lock screen refocuses the hidden input.

```
User types: 1   2   3
Display:    ●   ● ●  ● ● ●
```

**Pop-in animation** (optional GSAP enhancement):

```jsx
// inside SocialLink or wherever you render dots
useGSAP(() => {
  if (input.length > 0) {
    gsap.from(".lock-dot:last-child", {
      scale: 0,
      duration: 0.15,
      ease: "back.out(3)",
    });
  }
}, [input.length]);
```

Add that inside `LockScreen` to make each new dot pop in with a spring.

---

## 6. Clock & Date Display

macOS lock screen shows a **large clock** above the user profile.

```jsx
<div className="lock-clock">
  <p className="lock-time">{time.format("h:mm")}</p>
  <p className="lock-date">{time.format("dddd, MMMM D")}</p>
</div>
```

Uses `dayjs` which is already installed in the project. The `useEffect` interval updates every second.

**Styling** (see Section 12 for full CSS):
- Time: `font-size: 5rem`, `font-weight: 200` (thin, macOS style)
- Date: `font-size: 1.1rem`, `font-weight: 400`
- Both: white text with slight text shadow

---

## 7. User Avatar & Name

```jsx
<div className="lock-profile">
  <img src="/images/umer.jpg" alt="Umer Jamshaid" />
  <p className="lock-name">Umer Jamshaid</p>
</div>
```

- Avatar: 80×80px circle with a subtle white ring
- Name: white, medium weight, centered below avatar
- Uses the same `umer.jpg` already in `public/images/`

---

## 8. Unlock Animation (GSAP)

When the correct password is entered, the lock screen **slides up and fades out**:

```js
gsap.to(containerRef.current, {
  y: "-100%",          // slide up off screen
  opacity: 0,           // fade out
  duration: 0.8,
  ease: "power3.inOut",
  onComplete: unlock,   // only then update Zustand state
});
```

**Why `onComplete`?** The lock screen stays in the DOM during the animation. Once GSAP finishes, `unlock()` sets `isLocked = false`, and the component returns `null` — cleanly removed.

### Alternative animation styles

| Style | GSAP Properties | Feel |
|-------|----------------|------|
| **Slide up** (recommended) | `y: "-100%", opacity: 0` | Classic macOS |
| **Scale + fade** | `scale: 1.05, opacity: 0, filter: "blur(20px)"` | Modern, dreamy |
| **Split reveal** | Two halves slide left/right | Dramatic |
| **Blur dissolve** | `filter: "blur(40px)", opacity: 0` | Subtle, elegant |

---

## 9. Wrong Password Shake

macOS shakes the password field when you type the wrong password:

```js
gsap.to(dotsRef.current, {
  x: [-12, 12, -8, 8, -4, 4, 0],  // decreasing oscillation
  duration: 0.5,
  ease: "power2.out",
});
```

This creates a natural **dampening shake** that feels exactly like macOS.

**Additionally:**
- Dots turn red briefly (`lock-dots-error` class)
- After 800ms, the input clears and error state resets
- The field refocuses automatically for the next attempt

---

## 10. Wallpaper Blur Transition

The lock screen uses the **same wallpaper** as the desktop but with a heavy blur. This sells the illusion because macOS does the same thing.

**Method — CSS backdrop-filter:**

```css
.lock-screen {
  background: url("/images/low-res-tahoe-light.gif") center/cover no-repeat;
}

.lock-screen::before {
  content: "";
  position: absolute;
  inset: 0;
  backdrop-filter: blur(50px) saturate(180%);
  -webkit-backdrop-filter: blur(50px) saturate(180%);
  background: rgba(0, 0, 0, 0.3);
}
```

**During unlock animation**, you can animate the blur away:

```js
gsap.to(".lock-screen::before", {
  backdropFilter: "blur(0px)",
  duration: 0.8,
});
```

Or simpler: since the whole container slides up, the blur just goes with it.

---

## 11. Wiring into App.jsx

```jsx
// src/App.jsx
import { Dock, Navbar, Welcome } from "#components";
import LockScreen from "#components/LockScreen";
import { Draggable } from "gsap/all";
import { Finder, Resume, Safari, Terminal, TextFile, ImageFile, Contact } from "#windows";
import { gsap } from "gsap";

gsap.registerPlugin(Draggable);

export const App = () => {
  return (
    <main>
      <Navbar />
      <Welcome />
      <Dock />

      <Terminal />
      <Safari />
      <Resume />
      <Finder />
      <TextFile />
      <ImageFile />
      <Contact />

      {/* lock screen — renders on top of everything when isLocked=true */}
      <LockScreen />
    </main>
  );
};
```

**Key detail:** `LockScreen` is rendered **last** so it sits on top in the DOM. Combined with `z-index: 9999` in CSS, it covers everything.

Alternatively, export it through `#components/index.js`:

```js
// src/components/index.js — add this export
export { default as LockScreen } from "./LockScreen";
```

Then import as:
```jsx
import { Dock, Navbar, Welcome, LockScreen } from "#components";
```

---

## 12. CSS Additions

Add these styles to `src/index.css` inside the existing `@layer components` block:

```css
@layer components {
  /* ─── existing styles above ... ─── */

  /* ─── Lock Screen ─── */
  .lock-screen {
    @apply fixed inset-0 z-[9999]
           flex flex-col items-center justify-center gap-6
           select-none cursor-default;
    background: url("/images/low-res-tahoe-light.gif") center/cover no-repeat;
  }

  .lock-screen::before {
    content: "";
    @apply absolute inset-0;
    backdrop-filter: blur(50px) saturate(180%);
    -webkit-backdrop-filter: blur(50px) saturate(180%);
    background: rgba(0, 0, 0, 0.3);
  }

  /* ensure children sit above the blur overlay */
  .lock-screen > * {
    @apply relative z-10;
  }

  /* ── clock ── */
  .lock-clock {
    @apply text-center text-white mb-8;
  }

  .lock-time {
    font-size: 5rem;
    font-weight: 200;
    line-height: 1;
    letter-spacing: -0.02em;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  }

  .lock-date {
    font-size: 1.1rem;
    font-weight: 400;
    margin-top: 0.25rem;
    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
  }

  /* ── profile ── */
  .lock-profile {
    @apply flex flex-col items-center gap-2;
  }

  .lock-profile img {
    @apply w-20 h-20 rounded-full ring-2 ring-white/30 shadow-lg;
  }

  .lock-name {
    @apply text-white text-sm font-medium tracking-wide;
  }

  /* ── password input ── */
  .lock-input-area {
    @apply flex flex-col items-center gap-3;
  }

  .lock-dots {
    @apply flex items-center justify-center gap-2
           bg-white/15 backdrop-blur-sm
           rounded-full px-6 py-3 min-w-[200px] min-h-[44px]
           border border-white/20;
    transition: border-color 0.3s;
  }

  .lock-dots-error {
    @apply border-red-400/60;
  }

  .lock-dots-error .lock-dot {
    @apply bg-red-400;
  }

  .lock-dot {
    @apply w-2.5 h-2.5 rounded-full bg-white;
    animation: dotPop 0.15s ease-out;
  }

  @keyframes dotPop {
    from { transform: scale(0); }
    to   { transform: scale(1); }
  }

  .lock-placeholder {
    @apply text-white/50 text-sm;
  }

  .lock-hint {
    @apply text-white/40 text-xs;
  }
}
```

---

## 13. Keyboard & Accessibility

| Concern | Solution |
|---------|----------|
| Screen readers | Hidden `<input>` has `aria-label="Enter passcode"` |
| Focus management | Auto-focus on mount; click-anywhere refocuses input |
| Keyboard only | Enter submits; Backspace deletes; standard input behaviour |
| Reduced motion | Wrap GSAP animations in a `prefers-reduced-motion` check |
| No mouse needed | Entire flow works with keyboard alone |

**Reduced motion example:**

```jsx
const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (input === PASSCODE) {
  if (prefersReduced) {
    unlock(); // skip animation
  } else {
    gsap.to(containerRef.current, {
      y: "-100%",
      opacity: 0,
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: unlock,
    });
  }
}
```

---

## 14. Fun Password Ideas

The password doesn't have to be `123`. Here are some fun alternatives:

| Password | Hint Text | Vibe |
|----------|-----------|------|
| `123` | "Hint: as easy as 1-2-3 😉" | Simple, welcoming |
| `hire` | "Hint: what you should do 💼" | Cheeky, recruiter-friendly |
| `umer` | "Hint: who built this? 🤔" | Personal |
| `hello` | "Hint: just say hi 👋" | Friendly |
| `mac` | "Hint: what OS is this? 🍎" | On-theme |
| `open` | "Hint: say the magic word 🔓" | Straightforward |
| *(empty)* | "Just press Enter ↵" | Zero friction |

**Multi-password support** (accept any of several):

```jsx
const PASSCODES = ["123", "hire", "hello", "open"];

// in handleKeyDown:
if (PASSCODES.includes(input)) {
  // unlock
}
```

**Easter egg mode** — different passwords trigger different unlock animations:

```jsx
const animations = {
  "123": { y: "-100%" },        // slide up
  "hire": { scale: 1.1 },       // zoom out
  "matrix": { opacity: 0 },     // fade (with green tint?)
};

const anim = animations[input] || animations["123"];
gsap.to(containerRef.current, {
  ...anim,
  opacity: 0,
  duration: 0.8,
  ease: "power3.inOut",
  onComplete: unlock,
});
```

---

## 15. Mobile Adaptation

On mobile, the lock screen should adapt:

```css
@media (max-width: 640px) {
  .lock-time {
    font-size: 3.5rem;
  }

  .lock-date {
    font-size: 0.9rem;
  }

  .lock-profile img {
    @apply w-16 h-16;
  }

  .lock-dots {
    @apply min-w-[160px] px-4 py-2.5;
  }
}
```

**Touch considerations:**
- Tapping the password area should open the on-screen keyboard.
- The hidden `<input>` handles this — it's still focusable.
- Consider adding a visible "Tap to type" prompt on mobile.
- Use `inputMode="numeric"` if the password is digits-only to show the number pad.

```jsx
<input
  ref={inputRef}
  type="password"
  inputMode="numeric"   // shows number pad on mobile
  value={input}
  onChange={handleChange}
  onKeyDown={handleKeyDown}
  className="sr-only"
  aria-label="Enter passcode"
  autoComplete="off"
/>
```

---

## 16. Optional Extras

### 16a. Battery / WiFi status icons (aesthetic only)

```jsx
<div className="lock-status-bar">
  <img src="/icons/wifi.svg" className="w-4 opacity-70" />
  <span className="text-white/60 text-xs">{time.format("h:mm A")}</span>
  <img src="/icons/battery.svg" className="w-5 opacity-70" />
</div>
```

Position at top-right of lock screen to mimic the real macOS status bar.

### 16b. Sleep/wake animation on first load

Fade in from black to simulate "waking up" the Mac:

```jsx
useGSAP(() => {
  gsap.from(containerRef.current, {
    opacity: 0,
    duration: 1.5,
    ease: "power2.out",
  });
}, []);
```

### 16c. Idle timeout lock (re-lock after inactivity)

```jsx
// in App.jsx or a custom hook
useEffect(() => {
  let timer;
  const reset = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      useWindowStore.getState().lock(); // add a lock() action to store
    }, 5 * 60 * 1000); // 5 minutes
  };

  window.addEventListener("mousemove", reset);
  window.addEventListener("keydown", reset);
  reset();

  return () => {
    clearTimeout(timer);
    window.removeEventListener("mousemove", reset);
    window.removeEventListener("keydown", reset);
  };
}, []);
```

Add a `lock` action to the store:
```js
lock: () => set((state) => { state.isLocked = true; }),
```

### 16d. Login attempt counter

```jsx
const [attempts, setAttempts] = useState(0);

// in the wrong-password branch:
setAttempts((a) => a + 1);

// after 5 failed attempts, show a "try again in X seconds" message
{attempts >= 5 && (
  <p className="text-red-300/80 text-xs mt-2">
    Too many attempts. Wait a moment.
  </p>
)}
```

### 16e. Notification widgets on lock screen

Like macOS Sonoma+ lock screen widgets:

```jsx
<div className="lock-widgets">
  <div className="lock-widget">
    <p className="text-xs text-white/50">Weather</p>
    <p className="text-lg text-white">72°F ☀️</p>
  </div>
  <div className="lock-widget">
    <p className="text-xs text-white/50">Calendar</p>
    <p className="text-lg text-white">No events today</p>
  </div>
</div>
```

---

## 17. Full Component Code

Here's the **complete, copy-paste-ready** `LockScreen.jsx`:

```jsx
// src/components/LockScreen.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import dayjs from "dayjs";
import useWindowStore from "#store/window";

const PASSCODE = "123";

const LockScreen = () => {
  const { isLocked, unlock } = useWindowStore();
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [time, setTime] = useState(dayjs());

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dotsRef = useRef(null);

  // ── live clock ──
  useEffect(() => {
    const id = setInterval(() => setTime(dayjs()), 1000);
    return () => clearInterval(id);
  }, []);

  // ── auto-focus ──
  useEffect(() => {
    if (isLocked) inputRef.current?.focus();
  }, [isLocked]);

  // ── wake-up fade in ──
  useGSAP(() => {
    if (isLocked && containerRef.current) {
      gsap.from(containerRef.current, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
      });
    }
  }, [isLocked]);

  // ── dot pop-in ──
  useGSAP(() => {
    if (input.length > 0) {
      gsap.from(".lock-dot:last-child", {
        scale: 0,
        duration: 0.15,
        ease: "back.out(3)",
      });
    }
  }, [input.length]);

  const handleChange = useCallback((e) => {
    setInput(e.target.value);
    setError(false);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key !== "Enter") return;

      if (input === PASSCODE) {
        gsap.to(containerRef.current, {
          y: "-100%",
          opacity: 0,
          duration: 0.8,
          ease: "power3.inOut",
          onComplete: unlock,
        });
      } else {
        setError(true);
        gsap.to(dotsRef.current, {
          x: [-12, 12, -8, 8, -4, 4, 0],
          duration: 0.5,
          ease: "power2.out",
        });
        setTimeout(() => {
          setInput("");
          setError(false);
        }, 800);
      }
    },
    [input, unlock]
  );

  if (!isLocked) return null;

  return (
    <div
      ref={containerRef}
      onClick={() => inputRef.current?.focus()}
      className="lock-screen"
    >
      {/* ── clock ── */}
      <div className="lock-clock">
        <p className="lock-time">{time.format("h:mm")}</p>
        <p className="lock-date">{time.format("dddd, MMMM D")}</p>
      </div>

      {/* ── avatar + name ── */}
      <div className="lock-profile">
        <img src="/images/umer.jpg" alt="Umer Jamshaid" />
        <p className="lock-name">Umer Jamshaid</p>
      </div>

      {/* ── password field ── */}
      <div className="lock-input-area">
        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="sr-only"
          aria-label="Enter passcode"
          autoComplete="off"
        />

        <div
          ref={dotsRef}
          className={`lock-dots ${error ? "lock-dots-error" : ""}`}
        >
          {input.length === 0 ? (
            <span className="lock-placeholder">Enter Password</span>
          ) : (
            Array.from({ length: input.length }).map((_, i) => (
              <span key={i} className="lock-dot" />
            ))
          )}
        </div>

        <p className="lock-hint">Hint: try 123 😉</p>
      </div>
    </div>
  );
};

export default LockScreen;
```

---

## 18. Summary Checklist

| # | Task | File |
|---|------|------|
| 1 | Create `LockScreen.jsx` | `src/components/LockScreen.jsx` |
| 2 | Add `isLocked` + `unlock()` to store | `src/store/window.js` |
| 3 | Add lock screen CSS to `@layer components` | `src/index.css` |
| 4 | Render `<LockScreen />` in `App.jsx` (last child) | `src/App.jsx` |
| 5 | Export from `#components/index.js` (optional) | `src/components/index.js` |
| 6 | Test password flow: correct → slides up | Browser |
| 7 | Test wrong password: shake + red dots | Browser |
| 8 | Test mobile: keyboard opens, layout adapts | Mobile/DevTools |
| 9 | Pick your fave password & hint text | `LockScreen.jsx` |
| 10 | Optional: add wake-up fade, idle re-lock, widgets | Various |

**That's it — a fully macOS-authentic lock screen in ~120 lines of JSX + some CSS.**
