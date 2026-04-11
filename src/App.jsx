import { Dock, Home, Navbar , Welcome } from "#components"
import { Draggable } from "gsap/all"
import { Finder, Resume, Safari, Terminal, TextFile, ImageFile, Contact } from "#windows";
import { useEffect } from "react";


// import { gsap } from "gsap/gsap-core";
import { gsap } from "gsap";

gsap.registerPlugin(Draggable);

export const App = () => {
  useEffect(() => {
    document.body.style.backgroundImage = `url(${import.meta.env.BASE_URL}images/low-res-tahoe-light.gif)`;
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

  return (
    <main>
      <Navbar/>
    <Welcome/>
    <Dock/>


    <Terminal/>
    <Safari/>
    <Resume/>
    <Finder/>
    <TextFile/>
    <ImageFile/>
    <Contact/>

   <Home/>
    </main>
    
  )
}
