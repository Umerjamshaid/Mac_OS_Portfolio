import { Dock, Navbar , Welcome } from "#components"
import { Draggable } from "gsap/all"
import { Terminal } from "#windows";


// import { gsap } from "gsap/gsap-core";
import { gsap } from "gsap";

gsap.registerPlugin(Draggable);

export const App = () => {
  return (
    <main>
      <Navbar/>
    <Welcome/>
    <Dock/>


    <Terminal/>
    </main>
    
  )
}
