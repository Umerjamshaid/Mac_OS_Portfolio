import { useEffect, useRef, useState } from "react";
import { WindowControls } from "#components";
import { techStack } from "#constants";
import WindowWrapper from "#hoc/WindowWrapper";
import { Terminal as TerminalIcon } from "lucide-react";

const PROMPT = "umer@portfolio ~ %";

const SKILL_LEVELS = {
  Mobile: 90,
  Backend: 75,
  Database: 70,
  Tools: 85,
  Projects: 95,
};

const BAR_COLORS = {
  Mobile: "bg-emerald-400 shadow-emerald-400/50",
  Backend: "bg-sky-400 shadow-sky-400/50",
  Database: "bg-amber-400 shadow-amber-400/50",
  Tools: "bg-violet-400 shadow-violet-400/50",
  Projects: "bg-rose-400 shadow-rose-400/50",
};

const Typewriter = ({ text, speed = 25, onDone, className = "" }) => {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const idxRef = useRef(0);

  useEffect(() => {
    idxRef.current = 0;
    setDisplayed("");
    setIsTyping(true);

    const timer = setInterval(() => {
      if (idxRef.current < text.length) {
        setDisplayed(text.slice(0, idxRef.current + 1));
        idxRef.current += 1;
      } else {
        clearInterval(timer);
        setIsTyping(false);
        onDone?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onDone]);

  return (
    <span className={className}>
      {displayed}
      {isTyping && (
        <span className="inline-block w-2 h-4 bg-emerald-400 align-middle ml-0.5 animate-blink" />
      )}
    </span>
  );
};

const SkillBar = ({ label, level, color }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(level), 200);
    return () => clearTimeout(t);
  }, [level]);

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-gray-400 font-medium tracking-wide">{label}</span>
        <span className="text-[10px] text-gray-500 font-mono">{level}%</span>
      </div>
      <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-[1200ms] ease-out shadow-[0_0_8px]`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

const Terminal = () => {
  const [phase, setPhase] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [phase]);

  return (
    <div className="flex flex-col h-full bg-[#1a1b26] text-gray-200 font-mono text-[13px] rounded-xl overflow-hidden select-none">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeInUp 0.3s ease-out forwards; }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
        .animate-blink { animation: blink 1s steps(1) infinite; }
        /* Custom scrollbar for terminal */
        .term-scroll::-webkit-scrollbar { width: 6px; }
        .term-scroll::-webkit-scrollbar-track { background: transparent; }
        .term-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div
        id="window-header"
        className="flex items-center justify-between px-4 py-2.5 bg-[#1e1e2e] border-b border-black/40"
      >
        <WindowControls target="terminal" />
        <div className="flex items-center gap-2 flex-1 justify-center">
          <TerminalIcon size={13} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-400">umer — -zsh</span>
        </div>
        <div className="w-16" />
      </div>

      {/* Terminal body */}
      <div ref={scrollRef} className="term-scroll flex-1 overflow-y-auto p-4 space-y-3">
        {/* Welcome banner */}
        <div className="text-gray-500 text-[11px] space-y-0.5">
          <p>Last login: {new Date().toLocaleString()} on ttys001</p>
          <p className="text-emerald-500/80">
            Welcome to Umer&apos;s Portfolio Shell v1.0.0
          </p>
        </div>

        {/* Command 1: neofetch-style */}
        <div className="pt-1">
          <p className="flex items-center">
            <span className="text-emerald-400 mr-2">{PROMPT}</span>
            <Typewriter
              text="neofetch"
              speed={40}
              onDone={() => setPhase((p) => Math.max(p, 1))}
              className="text-gray-200"
            />
          </p>

          {phase >= 1 && (
            <div className="mt-3 flex flex-col sm:flex-row gap-6 animate-fade-in">
              <pre className="text-[10px] leading-[1.2] text-emerald-400/80 hidden sm:block select-text">
                {`        .:'
    __ :'__ 
 .'\\\`  -'  \\\`.   
:          .-.  
:         :   : 
 :         -' 
  \\\`.__.-.__.'`}
              </pre>

              <div className="flex-1 space-y-4">
                <div className="text-[12px] space-y-1 text-gray-400">
                  <p><span className="text-sky-400">OS</span>: macOS Portfolio</p>
                  <p><span className="text-sky-400">Host</span>: MacBook Pro</p>
                  <p><span className="text-sky-400">Kernel</span>: React 18.2.0</p>
                  <p><span className="text-sky-400">Shell</span>: zsh 5.9</p>
                  <p><span className="text-sky-400">Resolution</span>: 1440x900</p>
                  <p><span className="text-sky-400">WM</span>: Tailwind CSS</p>
                </div>
                <div className="space-y-2 pt-1">
                  {Object.entries(SKILL_LEVELS).map(([k, v]) => (
                    <SkillBar key={k} label={k} level={v} color={BAR_COLORS[k]} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Command 2: show tech stack as JSON */}
        {phase >= 1 && (
          <div className="pt-3">
            <p className="flex items-center">
              <span className="text-emerald-400 mr-2">{PROMPT}</span>
              <Typewriter
                text="cat skills.json"
                speed={40}
                onDone={() => setPhase((p) => Math.max(p, 2))}
                className="text-gray-200"
              />
            </p>

            {phase >= 2 && (
              <div className="mt-2 font-mono text-[12px] animate-fade-in">
                <div className="text-gray-500">{"{"}</div>
                {techStack.map((tech, i) => (
                  <div key={tech.category} className="pl-4 flex flex-wrap items-center">
                    <span className="text-sky-400">"{tech.category.toLowerCase()}"</span>
                    <span className="text-gray-500">: </span>
                    <span className="text-amber-400">[</span>
                    {tech.items.map((item, idx) => (
                      <span key={idx} className="flex items-center">
                        <span className="text-emerald-300">"{item}"</span>
                        {idx < tech.items.length - 1 && <span className="text-gray-500">, </span>}
                      </span>
                    ))}
                    <span className="text-amber-400">]</span>
                    {i < techStack.length - 1 && <span className="text-gray-500">,</span>}
                  </div>
                ))}
                <div className="text-gray-500">{"}"}</div>
              </div>
            )}
          </div>
        )}

        {/* Command 3: uptime / summary */}
        {phase >= 2 && (
          <div className="pt-3">
            <p className="flex items-center">
              <span className="text-emerald-400 mr-2">{PROMPT}</span>
              <Typewriter
                text="uptime"
                speed={40}
                onDone={() => setPhase((p) => Math.max(p, 3))}
                className="text-gray-200"
              />
            </p>

            {phase >= 3 && (
              <div className="mt-2 text-[12px] text-gray-400 space-y-1 animate-fade-in">
                <p>
                  {new Date().toLocaleTimeString()} up 999 days, 42 mins, 1 user, load averages: 0.12 0.08 0.05
                </p>
                <p className="text-emerald-500/70">
                  ✓ All systems operational. {techStack.length} skill categories loaded successfully.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Final blinking cursor */}
        {phase >= 3 && (
          <p className="flex items-center pt-1 text-emerald-400">
            <span className="mr-2">{PROMPT}</span>
            <span className="inline-block w-2 h-4 bg-emerald-400 align-middle animate-blink" />
          </p>
        )}
      </div>
    </div>
  );
};

const TerminalWindow = WindowWrapper(Terminal, "terminal");
export default TerminalWindow;