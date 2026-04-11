# Contributing to macOS Portfolio

Thanks for your interest in contributing! Whether you're fixing a typo, squashing a bug, or building an entirely new feature — you're welcome here.

## Getting Started

1. **Fork** this repo
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/Mac_OS_Portfolio.git
   cd Mac_OS_Portfolio
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start the dev server:**
   ```bash
   npm run dev
   ```
   The app runs at `http://localhost:5173`.

5. **Create a branch** for your work:
   ```bash
   git checkout -b feat/your-feature-name
   ```

## What Can I Work On?

We have detailed implementation guides ready for contributors. Pick one and go:

| Feature | Guide | Difficulty |
|---------|-------|------------|
| Lock Screen | [`docs/lock-screen-guide.md`](docs/lock-screen-guide.md) | Intermediate |
| Live Wallpapers & Context Menu | [`docs/live-wallpaper-and-context-menu.md`](docs/live-wallpaper-and-context-menu.md) | Intermediate |
| Audio Effects | [`docs/FEATURES.md` §1](docs/FEATURES.md) | Beginner |
| Dark Mode | [`docs/FEATURES.md` §2](docs/FEATURES.md) | Intermediate |
| Animated Wallpapers | [`docs/FEATURES.md` §3](docs/FEATURES.md) | Advanced |
| Window Resizing & Snapping | [`docs/FEATURES.md` §4](docs/FEATURES.md) | Intermediate |
| Spotlight Search (Cmd+K) | [`docs/FEATURES.md` §5](docs/FEATURES.md) | Intermediate |
| Notification Center | [`docs/FEATURES.md` §5](docs/FEATURES.md) | Beginner |
| Easter Eggs | [`docs/FEATURES.md` §10](docs/FEATURES.md) | Beginner |

Or check out issues tagged [`good first issue`](https://github.com/Umerjamshaid/Mac_OS_Portfolio/labels/good%20first%20issue) for smaller tasks.

Have your own idea? Open an [issue](https://github.com/Umerjamshaid/Mac_OS_Portfolio/issues) first and let's discuss.

## Project Structure

```
src/
├── components/     # Shared UI (Dock, Navbar, Welcome, WindowControls)
├── constants/      # App data, nav links, dock apps, file system
├── hoc/            # WindowWrapper HOC (drag, focus, z-index)
├── store/          # Zustand + Immer global state
├── windows/        # Individual app windows (Finder, Terminal, Safari, etc.)
├── App.jsx         # Root component
├── main.jsx        # Entry point
└── index.css       # Global styles + Tailwind layers
```

**Key patterns:**
- Path aliases: `#components`, `#constants`, `#store`, `#hoc`, `#windows` (defined in `vite.config.js` and `jsconfig.json`)
- All windows use the `WindowWrapper` HOC from `#hoc/WindowWrapper`
- State lives in Zustand stores under `src/store/`
- No TypeScript — this is a JSX-only project
- Styling uses Tailwind CSS 4 with `@layer components` blocks in `index.css`

## Making Changes

- **Keep changes focused.** One feature or fix per PR.
- **Don't modify shared files** (`index.css`, `App.jsx`, `constants/index.js`) unless your feature requires it — and if it does, explain why in the PR description.
- **Test your changes.** Run `npm run build` before pushing to make sure nothing breaks.
- **Match existing code style.** No TypeScript, no extra abstractions, keep it simple.

## Submitting a Pull Request

1. **Commit** with a clear message:
   ```bash
   git commit -m "feat: add lock screen with password input"
   ```
   Use prefixes: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`

2. **Push** your branch:
   ```bash
   git push origin feat/your-feature-name
   ```

3. **Open a PR** against `main` on GitHub. In the description:
   - Explain what you built and why
   - Include a screenshot or GIF if it's visual
   - Link the related issue if there is one

4. I'll review it within a couple of days.

## Bug Reports

Found a bug? [Open an issue](https://github.com/Umerjamshaid/Mac_OS_Portfolio/issues) with:
- What happened vs. what you expected
- Steps to reproduce
- Browser and OS
- Screenshot if possible

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md). Be respectful, be constructive, and have fun building.

---

Thanks for helping make this project better.
