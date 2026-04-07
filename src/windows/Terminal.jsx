import { WindowControls } from "#components";
import { techStack } from "#constants";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { Check, Flag } from "lucide-react";

const Terminal = () => {
  return (
    <>
      <div id="window-header">
        <WindowControls target="terminal" />
        <h2>Tech Stack</h2>
      </div>

      <div className="techstack">
        <p>
          <span className="font-bold">@umerjamshaid %  </span>
          Show tech stack
        </p>

        <div className="lable flex">
          <p className="w-32">Category</p>
          <p>Technologies</p>
        </div>

        <ul className="content">
          {techStack.map(({ category, items }) => (
            <li key={category} className="flex items-center">
              <Check className="check" size={20}/>
              <h3>{category}</h3>
              <ul>
                {items.map((item , i ) => (
                  <li key={i}>{item} {i < item.length - 1 ? ", " : ""}</li> 
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div className="footnote">
          <p>
            <Check size={20}/> 5 of 5 stacks loaded successfully! (100%)
          </p>

          <p className="text-black">
            <Flag size={20} fill="black" /> 
            Render time: 6ms 123ms
          </p>
        </div>
      </div>
    </>
  );
};

const TerminalWindow = WindowWrapper(Terminal, "terminal");

export default TerminalWindow;
