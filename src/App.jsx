import { Dock, Home, Navbar, Welcome, Wallpaper, DesktopContextMenu } from "#components"
import { Draggable } from "gsap/all"
import { Finder, Resume, Safari, Terminal, TextFile, ImageFile, Contact } from "#windows";
import { gsap } from "gsap";

gsap.registerPlugin(Draggable);

export const App = () => {
  return (
    <main>
      <Wallpaper />
      <DesktopContextMenu />
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

      <Home />
    </main>
  );
};
