import { useCallback, useRef } from "react";
import { Dock, Home, Navbar, Welcome, Wallpaper, DesktopContextMenu, Spotlight, LockScreen, SpotifyPlayer, Notifications, DesktopEffects, ControlCenter } from "#components"
import { Draggable } from "gsap/all"
import { Finder, Resume, Safari, Terminal, TextFile, ImageFile, Contact, Photos, Settings } from "#windows";
import { gsap } from "gsap";

gsap.registerPlugin(Draggable);

export const App = () => {
  const addRippleRef = useRef(null);

  // Wire desktop clicks → ripple effect via DesktopEffects
  const registerRipple = useCallback((fn) => { addRippleRef.current = fn; }, []);

  const handleDesktopClick = useCallback((e) => {
    // Only ripple on the raw desktop background (not windows / dock / navbar)
    const tag = e.target.tagName;
    const isBackground =
      e.target === e.currentTarget ||
      e.target.id === "wallpaper" ||
      e.target.closest("#home") !== null && e.target.tagName !== "LI" && e.target.tagName !== "IMG" && e.target.tagName !== "P";

    if (isBackground && addRippleRef.current) {
      addRippleRef.current(e.clientX, e.clientY);
    }
  }, []);

  return (
    <main onClick={handleDesktopClick}>
      <Wallpaper />
      <DesktopContextMenu />
      <Spotlight />
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
      <Photos />
      <Settings />

      <Home />

      <SpotifyPlayer />
      <Notifications />
      <ControlCenter />
      <DesktopEffects onDesktopClick={registerRipple} />
      <LockScreen />
    </main>
  );
};
