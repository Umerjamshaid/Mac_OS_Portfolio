import { Dock, Home, Navbar, Welcome, Wallpaper, DesktopContextMenu, Spotlight } from "#components"
import { Draggable } from "gsap/all"
import { Finder, Resume, Safari, Terminal, TextFile, ImageFile, Contact, Photos } from "#windows";
import { gsap } from "gsap";

gsap.registerPlugin(Draggable);

export const App = () => {
  return (
    <main>
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

      <Home />
    </main>
  );
};
