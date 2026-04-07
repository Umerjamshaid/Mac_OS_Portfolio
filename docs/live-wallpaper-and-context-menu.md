# Live Wallpaper and Desktop Right-Click Guide

This guide explains, in simple words, how to add:

1. image, GIF, and MP4 wallpapers
2. a desktop right-click menu like macOS or Windows

It is written for this repo specifically.

---

## 1. What you have right now

Right now the wallpaper is set in `src/index.css` on `html, body`:

```css
html,
body {
  background-image: url("/images/wallpaper.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
```

This works fine for a normal static wallpaper.

But there is a limitation:

- image wallpaper: yes
- GIF wallpaper: yes, but not ideal for performance
- MP4 wallpaper: no, not with `background-image`

So if you want real live wallpapers, the clean solution is to stop using CSS `background-image` for the wallpaper itself and instead render a wallpaper layer in React.

---

## 2. Best simple idea

Think of the wallpaper as a full-screen layer that sits behind everything.

Your app order becomes:

1. wallpaper layer
2. navbar, dock, windows
3. context menu when user right-clicks

In simple words:

- static wallpaper uses an `img`
- animated wallpaper can use a `gif`
- best live wallpaper uses a muted looping `video`

---

## 3. Recommended structure

If you build this feature, a clean structure would be:

```text
src/
  components/
    Wallpaper.jsx
    DesktopContextMenu.jsx
  store/
    desktop.js
```

You do not have to use these exact filenames, but this split keeps the logic clean.

---

## 4. Wallpaper state you need

You need one small state object that says what wallpaper is active.

Example shape:

```js
{
  type: "image", // "image" | "gif" | "video"
  src: "/images/wallpaper.png",
  poster: "/images/wallpaper.png",
  muted: true,
  loop: true
}
```

Meaning:

- `type` tells the UI what to render
- `src` is the file path
- `poster` is a fallback image for video
- `muted` is needed because browsers only autoplay muted video reliably
- `loop` makes the live wallpaper keep playing

---

## 5. Wallpaper component idea

This is the main idea.

```jsx
const Wallpaper = ({ wallpaper }) => {
  if (wallpaper.type === "video") {
    return (
      <video
        className="fixed inset-0 h-full w-full object-cover -z-10"
        src={wallpaper.src}
        poster={wallpaper.poster}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  return (
    <img
      className="fixed inset-0 h-full w-full object-cover -z-10"
      src={wallpaper.src}
      alt="Desktop wallpaper"
    />
  );
};
```

Why this is better than CSS background:

- supports MP4 and WebM
- easier to switch wallpaper dynamically
- easier to add transitions
- easier to preload and optimize

---

## 6. Where to place it in this repo

In your current `src/App.jsx`, put the wallpaper component inside `main` before everything else.

Simple idea:

```jsx
<main>
  <Wallpaper wallpaper={activeWallpaper} />
  <Navbar />
  <Welcome />
  <Dock />
  ...windows
</main>
```

That makes the wallpaper stay behind the UI.

---

## 7. GIF or MP4: which one should you use?

Short answer:

- use GIF only for very small animations
- use MP4 or WebM for real live wallpapers

Why:

- GIF files are usually much heavier than video
- GIF decoding is expensive
- MP4/WebM gives smoother playback with better size
- browsers are better at video than giant GIF wallpapers

Best practical choice:

- use `.mp4` or `.webm` for live wallpaper
- keep a poster image as fallback

---

## 8. Performance tips for live wallpaper

If you want this to feel smooth, follow these rules:

1. Keep the video short and loopable.
2. Compress it hard.
3. Use `muted`, `loop`, `autoPlay`, and `playsInline`.
4. Prefer 720p or 1080p depending on file size.
5. Do not use a very long 4K file as wallpaper.
6. Pause or reduce effects on low-end devices if needed.

Good video tag setup:

```jsx
<video
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  className="fixed inset-0 h-full w-full object-cover -z-10"
>
  <source src="/videos/wallpaper.mp4" type="video/mp4" />
</video>
```

`preload="metadata"` is a good default if you do not want the browser to aggressively preload huge files.

---

## 9. Let user change wallpaper

There are 2 common ways.

### Option A: predefined wallpapers

This is easiest.

Create an array:

```js
const wallpapers = [
  { id: 1, type: "image", src: "/images/wallpaper.png" },
  { id: 2, type: "gif", src: "/images/live.gif" },
  { id: 3, type: "video", src: "/videos/live-wallpaper.mp4", poster: "/images/wallpaper.png" },
];
```

Then switch the active wallpaper by ID.

### Option B: user uploads their own wallpaper

Use a hidden file input and generate a temporary object URL.

Example idea:

```js
const handleWallpaperUpload = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const fileUrl = URL.createObjectURL(file);

  const type = file.type.startsWith("video/")
    ? "video"
    : file.type === "image/gif"
      ? "gif"
      : "image";

  setWallpaper({ type, src: fileUrl, poster: fileUrl });
};
```

Important:

- `URL.createObjectURL()` is good for previewing local files
- if you replace files often, revoke old URLs with `URL.revokeObjectURL()`

---

## 10. Desktop right-click menu idea

You want this behavior:

- user right-clicks empty desktop space
- custom menu opens near mouse
- menu shows actions like:
  - Change Wallpaper
  - Next Wallpaper
  - Use GIF
  - Use Video
  - Refresh
  - Close Menu

This is done by preventing the browser's default context menu and showing your own menu.

---

## 11. Basic context menu state

You need state like this:

```js
const [menu, setMenu] = useState({
  visible: false,
  x: 0,
  y: 0,
});
```

Then on right click:

```js
const handleContextMenu = (event) => {
  event.preventDefault();

  setMenu({
    visible: true,
    x: event.clientX,
    y: event.clientY,
  });
};
```

And to close it:

```js
const closeMenu = () => {
  setMenu((prev) => ({ ...prev, visible: false }));
};
```

---

## 12. Important detail: only open it on empty desktop space

You do not want the menu to appear when right-clicking:

- a window
- the dock
- navbar
- buttons or links

So add a check.

Example idea:

```js
const handleDesktopContextMenu = (event) => {
  const blocked = event.target.closest("section, nav, #dock, a, button, input");

  if (blocked) return;

  event.preventDefault();
  setMenu({ visible: true, x: event.clientX, y: event.clientY });
};
```

That means your custom menu only appears on empty wallpaper area.

---

## 13. Context menu component idea

```jsx
const DesktopContextMenu = ({ x, y, visible, onClose, onSelectWallpaper, onRefresh }) => {
  if (!visible) return null;

  return (
    <div
      className="fixed z-[999] min-w-56 rounded-xl border border-white/40 bg-white/80 p-2 shadow-2xl backdrop-blur-xl"
      style={{ left: x, top: y }}
    >
      <button onClick={() => onSelectWallpaper("image")}>Use Image Wallpaper</button>
      <button onClick={() => onSelectWallpaper("gif")}>Use GIF Wallpaper</button>
      <button onClick={() => onSelectWallpaper("video")}>Use Video Wallpaper</button>
      <button onClick={onRefresh}>Refresh</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};
```

To feel more like macOS, style each item as a full-width row with hover background and soft blur.

---

## 14. Keep the menu inside the screen

If you open the menu near the bottom-right corner, part of it can go off-screen.

So clamp the position.

Example logic:

```js
const clampMenuPosition = (x, y, menuWidth = 220, menuHeight = 240) => {
  const maxX = window.innerWidth - menuWidth - 8;
  const maxY = window.innerHeight - menuHeight - 8;

  return {
    x: Math.max(8, Math.min(x, maxX)),
    y: Math.max(8, Math.min(y, maxY)),
  };
};
```

Then use the clamped values before showing the menu.

---

## 15. Close menu when user clicks elsewhere

You also want this behavior:

- open on right click
- close on left click anywhere else
- close on Escape key

That usually means:

```js
useEffect(() => {
  const handleClick = () => closeMenu();
  const handleKey = (event) => {
    if (event.key === "Escape") closeMenu();
  };

  window.addEventListener("click", handleClick);
  window.addEventListener("keydown", handleKey);

  return () => {
    window.removeEventListener("click", handleClick);
    window.removeEventListener("keydown", handleKey);
  };
}, []);
```

---

## 16. Best simple menu options

If you want it to feel like desktop OS behavior, keep the first version simple.

Good options:

1. Change Wallpaper
2. Next Wallpaper
3. Previous Wallpaper
4. Use Static Wallpaper
5. Use Live Wallpaper
6. Refresh Desktop

Optional advanced options:

1. Pause Live Wallpaper
2. Resume Live Wallpaper
3. Upload Wallpaper
4. Reset to Default

---

## 17. Simple implementation order

If you build this feature, do it in this order:

### Step 1

Move wallpaper out of `src/index.css` and into a React wallpaper component.

### Step 2

Support image wallpaper first.

### Step 3

Add video wallpaper support.

### Step 4

Add GIF support only if you still want it.

### Step 5

Add the desktop right-click context menu.

### Step 6

Add upload or wallpaper presets.

This order keeps the feature stable and easy to debug.

---

## 18. Practical recommendation for your project

For this portfolio, the best setup is:

- static image wallpapers for default theme
- one or two MP4 live wallpapers as optional choices
- custom right-click desktop menu on empty space only
- do not use huge GIF files as the main wallpaper

That gives you the effect you want without making the portfolio feel heavy.

---

## 19. Common mistakes to avoid

### Mistake 1

Trying to use MP4 as CSS `background-image`.

That does not work.

### Mistake 2

Opening the context menu everywhere, including windows and buttons.

That feels broken.

### Mistake 3

Using giant GIF wallpapers.

That can hurt performance badly.

### Mistake 4

Not muting video wallpaper.

Browsers often block autoplay if audio is enabled.

### Mistake 5

Not closing the custom menu on click outside or Escape.

That makes the UI feel stuck.

---

## 20. If you want the cleanest architecture

Use 3 separate pieces:

1. wallpaper component for rendering image or video
2. desktop store for wallpaper and context menu state
3. context menu component for desktop actions

That keeps the feature modular.

---

## 21. Very short summary

In simple words:

- your current wallpaper system is fine for static images
- GIF can work, but is usually heavy
- MP4 live wallpaper needs a real React component, not CSS background-image
- a macOS or Windows style right-click menu is just a custom menu shown on `contextmenu`
- only show that menu on empty desktop space

---

## 22. Suggested next implementation

If you want to build this cleanly in this repo, the next coding steps should be:

1. create a wallpaper component
2. move wallpaper state into React or Zustand
3. render image or video based on wallpaper type
4. add a desktop context menu component
5. connect menu actions to wallpaper switching

---

If you want, this guide can be turned directly into code next.