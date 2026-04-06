# 🚀 MacOS-Portfolio - Amazing Features to Add

> A comprehensive guide to elevate your macOS-inspired portfolio with interactive, immersive features.

---

## Table of Contents
1. [Audio Effects](#1-audio-effects)
2. [Dark Mode & Themes](#2-dark-mode--themes)
3. [Animated Wallpapers](#3-animated-wallpapers)
4. [Advanced Window Features](#4-advanced-window-features)
5. [Interactive Elements](#5-interactive-elements)
6. [Performance & Analytics](#6-performance--analytics)
7. [Accessibility](#7-accessibility)
8. [Mobile Experience](#8-mobile-experience)
9. [Social & Sharing](#9-social--sharing)
10. [Easter Eggs & Fun](#10-easter-eggs--fun)

---

## 1. Audio Effects 🔊

### 1.1 Click & UI Sounds

**Why:** Add tactile feedback mimicking real macOS, creating an immersive experience.

**Implementation:**
```javascript
// Create a reusable audio hook
// src/hooks/useAudio.js
import { useRef } from 'react';

export const useAudio = () => {
  const audioRef = useRef(new Audio());

  const playSound = (soundName, volume = 0.3) => {
    const sounds = {
      click: '/audio/click.mp3',           // 50-100ms subtle click
      open: '/audio/window-open.mp3',      // 200-300ms window appear sound
      close: '/audio/window-close.mp3',    // 150ms window close sound
      focus: '/audio/focus.mp3',           // Subtle window focus sound
      dock: '/audio/dock-bloop.mp3',       // Fun dock hover sound
      error: '/audio/error.mp3',           // Error notification
      success: '/audio/success.mp3',       // Success notification
    };

    audioRef.current.src = sounds[soundName];
    audioRef.current.volume = volume;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      // Gracefully handle audio play failures (browser restrictions)
    });
  };

  return { playSound };
};
```

**Audio Sources (Free & Royalty-Free):**
- **Freesound.org** - Large collection of UI sounds
- **Zapsplat.com** - Free sound effects library
- **OpenGameArt.org** - Game audio suitable for UI
- **Pixabay.com** - Free music & sound effects

**Recommended Sounds:**
| Sound | Duration | Type | Emotion |
|-------|----------|------|---------|
| Click | 50-80ms | Short, crisp | Neutral/Professional |
| Window Open | 200-300ms | Gentle transition | Playful |
| Window Close | 150ms | Reverse of open | Smooth |
| Dock Hover | 100ms | Fun bloop | Delightful |
| Focus/Alert | 80ms | Sharp beep | Urgent |

**Implementation in Components:**
```jsx
// In Dock.jsx
const toggleApp = (app) => {
  if(!app.canOpen) return;
  playSound('dock', 0.2);
  
  const window = windows[app.id];
  if (window.isOpen) {
    closeWindow(app.id);
    playSound('close', 0.25);
  } else {
    openWindow(app.id);
    playSound('open', 0.3);
  }
};
```

**Settings for Users:**
```jsx
// src/components/AudioSettings.jsx
const [audioEnabled, setAudioEnabled] = useState(
  localStorage.getItem('audioEnabled') !== 'false'
);
const [audioVolume, setAudioVolume] = useState(
  parseFloat(localStorage.getItem('audioVolume')) || 0.3
);

// Save to localStorage and update context
```

---

### 1.2 Background Music / Ambient Sounds

**Why:** Create an immersive, professional atmosphere that enhances focus.

**Options:**
```javascript
const ambientTracks = {
  calm: '/audio/ambient/cafe-ambience.mp3',      // Coffee shop vibes
  focus: '/audio/ambient/lofi-beats.mp3',        // Lo-fi hip-hop
  nature: '/audio/ambient/forest-sounds.mp3',    // Nature/forest
  tech: '/audio/ambient/synth-ambience.mp3',     // Tech vibes
  silence: null,                                  // No audio
};
```

**Implementation:**
```jsx
// Create a context for background music
export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [ambientTrack, setAmbientTrack] = useState('calm');
  const [ambientVolume, setAmbientVolume] = useState(0.1);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    if (ambientTracks[ambientTrack]) {
      audioRef.current.src = ambientTracks[ambientTrack];
      audioRef.current.loop = true;
      audioRef.current.volume = ambientVolume;
      audioRef.current.play();
    }
  }, [ambientTrack, ambientVolume]);

  return (
    <AudioContext.Provider value={{ ambientTrack, setAmbientTrack }}>
      {children}
    </AudioContext.Provider>
  );
};
```

**Resources:**
- **Epidemic Sound** - Premium royalty-free music
- **Artlist.io** - Curated music library
- **Lofi Girl / lo-fi hip hop community** - Iconic background music
- **Skyrim/Minecraft soundtracks** - Ambient gaming music

---

## 2. Dark Mode & Themes 🌙

### 2.1 Complete Dark Mode Implementation

**Why:** Reduce eye strain, cater to user preferences, modern design standard.

**Approach: Use Tailwind CSS's built-in dark mode**

```jsx
// src/store/theme.js - Zustand store for theme
import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  isDark: localStorage.getItem('theme') === 'dark',
  theme: localStorage.getItem('theme') || 'auto',
  
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    set({ theme, isDark: theme === 'dark' });
  },
}));
```

**Update tailwind.config.js:**
```javascript
export default {
  darkMode: 'class', // Use class-based dark mode
  theme: {
    extend: {
      colors: {
        // Dark mode specific colors
        'macOS-dark-bg': '#1d1d1f',
        'macOS-dark-surface': '#2a2a2d',
        'macOS-dark-text': '#f5f5f7',
      },
    },
  },
};
```

**Implement in CSS:**
```css
/* index.css */
@layer base {
  :root {
    color-scheme: light dark;
  }

  body {
    @apply bg-white text-black transition-colors duration-300;
  }

  body.dark {
    @apply bg-macOS-dark-bg text-macOS-dark-text;
  }
}

/* Component examples */
.navbar {
  @apply bg-white/80 dark:bg-macOS-dark-surface/80 transition-colors;
}

.window {
  @apply bg-gray-50 dark:bg-macOS-dark-surface shadow-lg dark:shadow-2xl;
}
```

**Add Theme Selector to Navbar:**
```jsx
// In navbar.jsx
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '#store/theme';

export const ThemeToggle = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded ${theme === 'light' ? 'bg-gray-200' : ''}`}
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}
      >
        <Moon size={16} />
      </button>
      <button
        onClick={() => setTheme('auto')}
        className={`p-2 rounded text-sm ${theme === 'auto' ? 'bg-gray-300' : ''}`}
      >
        Auto
      </button>
    </div>
  );
};
```

**Dark Mode Color Palette (macOS-Inspired):**
| Element | Light | Dark | Purpose |
|---------|-------|------|---------|
| Background | `#FFFFFF` | `#1d1d1f` | Main canvas |
| Secondary Bg | `#f5f5f7` | `#2a2a2d` | Cards, panels |
| Text | `#000000` | `#f5f5f7` | Primary text |
| Muted Text | `#6e6e73` | `#86868b` | Secondary text |
| Border | `#e5e5ea` | `#424245` | Dividers |
| Accent | `#0071e3` | `#0a84ff` | Links, buttons |

---

### 2.2 Additional Theme Variants

**High Contrast Theme (Accessibility):**
```javascript
const themes = {
  light: { /* standard */ },
  dark: { /* standard dark */ },
  highContrast: {
    bg: '#000000',
    text: '#FFFFFF',
    accent: '#FFFF00',
  },
  sepia: {
    bg: '#f4ecd8',
    text: '#5c4033',
    accent: '#8b6f47',
  },
  terminal: {
    bg: '#0d0221',
    text: '#00ff41',
    accent: '#00ff00',
  },
};
```

---

## 3. Animated Wallpapers 🎨

### 3.1 Dynamic Canvas Wallpaper

**Why:** Create a stunning, responsive background that reacts to interaction.

**Option A: Particle System (Recommended)**

```jsx
// src/components/Wallpaper.jsx
import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleWallpaper = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }

    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    });

    // Animation loop
    const animate = () => {
      // Clear with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Move particles
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Repel from mouse
        const dx = particle.x - mouseRef.current.x;
        const dy = particle.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 150) {
          const angle = Math.atan2(dy, dx);
          const force = (150 - distance) / 150;
          particle.vx += Math.cos(angle) * force * 0.5;
          particle.vy += Math.sin(angle) * force * 0.5;
        }

        // Draw particle
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        particlesRef.current.forEach((otherParticle) => {
          const ddx = particle.x - otherParticle.x;
          const ddy = particle.y - otherParticle.y;
          const ddistance = Math.sqrt(ddx * ddx + ddy * ddy);
          if (ddistance < 100) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - ddistance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', () => {});
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen -z-10"
      style={{ backgroundColor: '#667eea' }}
    />
  );
};

export default ParticleWallpaper;
```

**Installation:**
```bash
npm install three @react-three/fiber @react-three/drei
```

---

**Option B: Gradient Waves (Simpler)**

```jsx
// src/components/WallpaperWaves.jsx
import { useEffect, useRef } from 'react';

export const WaveWallpaper = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;
    const animate = () => {
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#1f1c2c');
      gradient.addColorStop(0.5, '#928dab');
      gradient.addColorStop(1, '#c471ed');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw waves
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;

      for (let waveIndex = 0; waveIndex < 5; waveIndex++) {
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 10) {
          const y =
            canvas.height * 0.5 +
            Math.sin((x + time + waveIndex * 50) * 0.01) * 50 +
            Math.cos((x + time * 0.5) * 0.005) * 30;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      time += 2;
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
};

export default WaveWallpaper;
```

---

**Option C: Pre-made Animated Wallpapers (No Code)**
- **Animated Fluids:** Use libraries like `three-fluid-simulator`
- **Perlin Noise:** Generate organic, cloud-like patterns
- **Shader-based:** GLSL shaders for GPU-accelerated effects
- **Stock Resources:**
  - Unsplash Dynamic
  - Pexels Videos (convert to canvas)
  - Giphy Collections

---

### 3.2 User Wallpaper Preferences

```jsx
// Store wallpaper choice
export const useWallpaperStore = create((set) => ({
  wallpaper: localStorage.getItem('wallpaper') || 'particles',
  setWallpaper: (wp) => {
    localStorage.setItem('wallpaper', wp);
    set({ wallpaper: wp });
  },
}));

// Render based on preference
const wallpapers = {
  particles: <ParticleWallpaper />,
  waves: <WaveWallpaper />,
  static: <StaticWallpaper />,
  none: <div className="bg-gray-900" />,
};

export const Wallpaper = () => {
  const { wallpaper } = useWallpaperStore();
  return wallpapers[wallpaper] || wallpapers.particles;
};
```

---

## 4. Advanced Window Features 🪟

### 4.1 Window Resizing & Maximizing

**Add to WindowWrapper.jsx:**

```jsx
const [windowSize, setWindowSize] = useState({ width: 600, height: 400 });
const [isMaximized, setIsMaximized] = useState(false);

const handleResize = (e) => {
  const newWidth = e.clientX - windowPos.x;
  const newHeight = e.clientY - windowPos.y;
  setWindowSize({ width: newWidth, height: newHeight });
};

const toggleMaximize = () => {
  if (isMaximized) {
    setIsMaximized(false);
    setWindowSize({ width: 600, height: 400 });
  } else {
    setIsMaximized(true);
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }
};

return (
  <section
    style={{
      width: windowSize.width,
      height: windowSize.height,
      zIndex,
      ...(!isMaximized && {
        cursor: 'grab',
        resize: 'both',
      }),
    }}
  >
    {/* Window controls */}
    <div className="flex gap-2">
      <button onClick={() => closeWindow(windowKey)} className="red-btn" />
      <button onClick={toggleMaximize} className="yellow-btn" />
      <button className="green-btn" /> {/* Fullscreen */}
    </div>
  </section>
);
```

---

### 4.2 Window Snap to Edges

```javascript
const snapToEdge = (x, y, width, height) => {
  const snapDistance = 20;
  const snappedX = Math.abs(x) < snapDistance ? 0 : x;
  const snappedY = Math.abs(y) < snapDistance ? 0 : y;
  
  // Snap to right edge
  if (Math.abs(window.innerWidth - (x + width)) < snapDistance) {
    return { x: window.innerWidth - width, y: snappedY };
  }
  
  return { x: snappedX, y: snappedY };
};
```

---

### 4.3 Multi-Window Layouts

```javascript
// Predefined window arrangement presets
const layouts = {
  grid: {
    // 2x2 grid arrangement
  },
  cascade: {
    // Staggered cascade
  },
  workspace1: {
    // Custom user-saved layout
  },
};
```

---

## 5. Interactive Elements ✨

### 5.1 Spotlight Search (Cmd+K or Ctrl+K)

```jsx
// src/components/Spotlight.jsx
import { useEffect, useState } from 'react';

export const Spotlight = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const searchResults = [
    { title: 'Open Terminal', description: 'Terminal Window' },
    { title: 'Open Finder', description: 'Portfolio' },
    { title: 'Settings', description: 'Preferences' },
    // Filter based on searchQuery
  ].filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return isOpen ? (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-2xl w-96">
        <input
          autoFocus
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border-b"
        />
        <div className="max-h-64 overflow-y-auto">
          {searchResults.map((result) => (
            <div
              key={result.title}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <p className="font-medium">{result.title}</p>
              <p className="text-sm text-gray-500">{result.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : null;
};
```

---

### 5.2 Keyboard Shortcuts Display

```jsx
// Cmd+/ shows shortcuts
export const ShortcutsModal = () => {
  const shortcuts = [
    { key: 'Cmd+K', action: 'Spotlight Search' },
    { key: 'Cmd+Q', action: 'Quit App' },
    { key: 'Cmd+H', action: 'Hide Window' },
    { key: 'Arrow Keys', action: 'Navigate' },
    { key: 'Enter', action: 'Select' },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-bold mb-4">Keyboard Shortcuts</h2>
      <div className="grid gap-2">
        {shortcuts.map(({ key, action }) => (
          <div key={key} className="flex justify-between">
            <span className="text-gray-600">{action}</span>
            <kbd className="bg-gray-200 px-2 py-1 rounded text-sm">{key}</kbd>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

### 5.3 Notification Center

```jsx
// src/components/NotificationCenter.jsx
import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = Date.now();
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }));
    setTimeout(() => {
      useNotificationStore.setState((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, notification.duration || 5000);
  },
}));

export const NotificationCenter = () => {
  const { notifications } = useNotificationStore();

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {notifications.map(({ id, title, message, type }) => (
        <div
          key={id}
          className={`p-4 rounded-lg shadow-lg backdrop-blur-md ${
            type === 'success'
              ? 'bg-green-500/80'
              : type === 'error'
              ? 'bg-red-500/80'
              : 'bg-blue-500/80'
          } text-white`}
        >
          <p className="font-bold">{title}</p>
          <p className="text-sm">{message}</p>
        </div>
      ))}
    </div>
  );
};
```

---

## 6. Performance & Analytics 📊

### 6.1 Page Performance Monitoring

```javascript
// src/utils/performance.js
export const trackPerformance = () => {
  const timing = performance.getEntriesByType('navigation')[0];
  const metrics = {
    FCP: performance.getEntriesByName('first-contentful-paint')[0],
    LCP: new PerformanceObserver((list) => {
      console.log('LCP:', list.getEntries().pop());
    }),
  };

  console.log('Performance Metrics:', {
    'DOM Interactive': timing.domInteractive,
    'DOM Complete': timing.domComplete,
    'Total Load': timing.loadEventEnd - timing.fetchStart,
  });
};
```

### 6.2 User Interaction Analytics

```javascript
// Track which windows users open most, average session time, etc.
const useAnalytics = create((set) => ({
  sessionStart: Date.now(),
  windowsOpened: {},
  recordWindowOpen: (windowKey) => {
    set((state) => ({
      windowsOpened: {
        ...state.windowsOpened,
        [windowKey]: (state.windowsOpened[windowKey] || 0) + 1,
      },
    }));
  },
  getSessionData: () => {
    // Return data for analytics
  },
}));
```

---

## 7. Accessibility ♿

### 7.1 Screen Reader Support

```jsx
// Add ARIA labels to all interactive elements
<button
  aria-label="Open Terminal Application"
  aria-pressed={isOpen}
  role="button"
>
  Terminal
</button>
```

### 7.2 High Contrast Theme

Already mentioned in Dark Mode section.

### 7.3 Keyboard Navigation

```javascript
// Full keyboard navigation
const handleKeyDown = (e) => {
  if (e.key === 'Tab') {
    // Cycle through focusable elements
  }
  if (e.key === 'Enter') {
    // Activate focused element
  }
};
```

---

## 8. Mobile Experience 📱

### 8.1 Progressive Web App (PWA)

```json
// public/manifest.json
{
  "name": "macOS Portfolio",
  "short_name": "Portfolio",
  "description": "Interactive macOS-inspired portfolio",
  "start_url": "/",
  "display": "fullscreen",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 8.2 Mobile Window Manager

```jsx
// Touch-friendly window controls
const TouchWindowManager = () => {
  return (
    <div className="touch:px-4 touch:py-2">
      {/* Larger tap targets for touch */}
      <button className="touch:min-h-10 touch:min-w-10">Touch Button</button>
    </div>
  );
};
```

---

## 9. Social & Sharing 🤝

### 9.1 Social Media Integration

```jsx
// src/components/ShareButton.jsx
export const ShareButton = ({ windowKey, content }) => {
  const shareEndpoint = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`,
    linkedin: `https://linkedin.com/sharing/share-offsite/?url=...`,
    github: `https://github.com/share?...`,
  };

  return (
    <div className="flex gap-2">
      {Object.entries(shareEndpoint).map(([platform, url]) => (
        <a
          key={platform}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:opacity-75"
        >
          {platform.toUpperCase()}
        </a>
      ))}
    </div>
  );
};
```

### 9.2 Portfolio Embed

```javascript
// Generate embeddable code for users to share
const getEmbedCode = () => `
<iframe
  src="https://yourportfolio.com/embed"
  width="600"
  height="400"
  frameborder="0"
></iframe>
`;
```

---

## 10. Easter Eggs & Fun 🎉

### 10.1 Hidden Shortcuts

```javascript
// Konami code easter egg
class KonamiCode {
  constructor(callback) {
    this.keys = [];
    this.pattern = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ];
  }

  init(callback) {
    document.addEventListener('keydown', (e) => {
      this.keys.push(e.key);
      this.keys = this.keys.slice(-this.pattern.length);

      if (this.keys.join(',') === this.pattern.join(',')) {
        callback();
      }
    });
  }
}

// Use it
new KonamiCode().init(() => {
  console.log('🎮 Konami Code Activated!');
  // Trigger something fun
});
```

### 10.2 Matrix Rain Effect

```javascript
const activateMatrixMode = () => {
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

  let drops = [];
  for (let i = 0; i < canvas.width / 20; i++) {
    drops[i] = 0;
  }

  setInterval(() => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f0';
    ctx.font = '20px monospace';

    drops.forEach((drop, i) => {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * 20, drop * 20);
      drops[i]++;
      if (drop * 20 > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
    });
  }, 33);
};
```

### 10.3 Zen Mode

```jsx
// Remove all UI elements for distraction-free coding experience
const useZenMode = create((set) => ({
  isZen: false,
  toggleZen: () => set((state) => ({ isZen: !state.isZen })),
}));

export const ZenModeButton = () => {
  const { isZen, toggleZen } = useZenMode();

  return (
    <button
      onClick={toggleZen}
      className="fixed bottom-4 right-4 p-2 bg-purple-500 text-white rounded"
    >
      {isZen ? '✨ Zen Mode ON' : '🧘 Enter Zen Mode'}
    </button>
  );
};
```

### 10.4 Generate Resume as QR Code

```javascript
import QRCode from 'qrcode.react';

export const ResumeQR = ({ resumeLink }) => (
  <QRCode value={resumeLink} size={256} level="H" />
);
```

---

## Implementation Roadmap 🗺️

### Phase 1 (Week 1-2): Essential
- [ ] Dark Mode Toggle
- [ ] Audio Effects (Click, Open/Close)
- [ ] Particle Wallpaper

### Phase 2 (Week 3-4): Enhanced UX
- [ ] Spotlight Search (Cmd+K)
- [ ] Window Resizing
- [ ] Notification Center

### Phase 3 (Week 5-6): Polish
- [ ] Keyboard Shortcuts
- [ ] PWA Support
- [ ] Easter Eggs

### Phase 4 (Week 7+): Advanced
- [ ] Analytics Dashboard
- [ ] Performance Optimization
- [ ] Social Sharing
- [ ] Custom Themes

---

## Performance Considerations ⚡

| Feature | Impact | Mitigation |
|---------|--------|-----------|
| Particle Wallpaper | High CPU usage | Use `requestAnimationFrame`, reduce particle count, pause when inactive |
| Audio Files | Network + Memory | Use compressed formats (MP3/OGG), lazy load, cache |
| Animations | GPU usage | Use `will-change`, `transform` over `position`, requestAnimationFrame |
| Dark Mode | No impact | CSS class toggle, minimal overhead |

---

## Resources & Tools

### Audio
- [Freesound.org](https://freesound.org)
- [Zapsplat](https://www.zapsplat.com)
- [FFmpeg](https://ffmpeg.org) - Audio compression

### Animation
- [GSAP Docs](https://gsap.com)
- [Three.js](https://threejs.org)
- [Framer Motion](https://www.framer.com/motion/)

### Design
- [Figma](https://figma.com)
- [macOS Design Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

### Testing
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance
- [Axe DevTools](https://www.deque.com/axe/devtools/) - Accessibility
- [UserTesting.com](https://www.usertesting.com) - User research

---

## Conclusion

Your macOS-inspired portfolio has tremendous potential! Start with features that excite **you** most, as genuine passion translates through the code and creates better experiences. Focus on **Phase 1** to establish core features, then progressively enhance based on user feedback.

**Remember:** Quality > Quantity. A few polished features beat many half-baked ones.

---

**Last Updated:** April 5, 2026
**Maintained By:** Development Team
**Status:** Active & Growing 🚀
