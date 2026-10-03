import { useEffect, useRef, useState } from "react";
import { WindowControls } from "#components";
import { techStack } from "#constants";
import WindowWrapper from "#hoc/WindowWrapper";
import { Terminal as TerminalIcon } from "lucide-react";

const SKILL_LEVELS = {
  Mobile: 90,
  Backend: 75,
  Database: 70,
  Tools: 85,
  Projects: 95,
};

const CELLS = 20;
const FONT_STACK =
  "'JetBrains Mono','SF Mono',ui-monospace,Menlo,Consolas,monospace";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const Prompt = () => (
  <span className="mr-2 whitespace-nowrap">
    <span className="text-emerald-400">umer@portfolio</span>{" "}
    <span className="text-sky-300">~</span>{" "}
    <span className="text-gray-500">%</span>
  </span>
);

const Typewriter = ({ text, speed = 25, onDone, className = "" }) => {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const idxRef = useRef(0);
  // Keep the latest callback without restarting the typing effect on every render
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplayed(text);
      setIsTyping(false);
      doneRef.current?.();
      return;
    }

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
        doneRef.current?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayed}
      {isTyping && (
        <span className="inline-block w-2 h-4 bg-sky-300 align-middle ml-0.5 animate-blink" />
      )}
    </span>
  );
};

/* Block meter, drawn with characters so it reads like real CLI output */
const SkillBar = ({ label, level, delay = 0 }) => {
  const target = Math.round((level / 100) * CELLS);
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setFilled(target);
      return;
    }
    let n = 0;
    let timer;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        n += 1;
        setFilled(n);
        if (n >= target) clearInterval(timer);
      }, 35);
    }, delay);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [target, delay]);

  return (
    <div
      role="img"
      aria-label={`${label} ${level} percent`}
      className="grid grid-cols-[5.5rem_1fr_2.75rem] items-center gap-3 text-[12px]"
    >
      <span className="text-gray-400">{label}</span>
      <span className="leading-none tracking-tighter whitespace-nowrap overflow-hidden">
        <span className="text-sky-300">{"█".repeat(filled)}</span>
        <span className="text-[#3b4261]">{"░".repeat(CELLS - filled)}</span>
      </span>
      <span className="text-right text-gray-300 tabular-nums">{level}%</span>
    </div>
  );
};

const Terminal = () => {
  const [phase, setPhase] = useState(0);
  // Fixed once per mount so the timestamps don't change on re-render
  const [now] = useState(() => new Date());
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    }
  }, [phase]);

  const advance = (n) => () => setPhase((p) => Math.max(p, n));

  return (
    <div
      className="flex flex-col h-full bg-[#16161e] text-[#c0caf5] text-[13px] leading-relaxed rounded-xl overflow-hidden"
      style={{ fontFamily: FONT_STACK }}
    >
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
        .term-scroll::-webkit-scrollbar { width: 8px; }
        .term-scroll::-webkit-scrollbar-track { background: transparent; }
        .term-scroll::-webkit-scrollbar-thumb { background: #2f334d; border-radius: 4px; }
        .term-scroll::-webkit-scrollbar-thumb:hover { background: #414868; }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in, .animate-blink { animation: none; }
        }
      `}</style>

      {/* Header */}
      <div
        id="window-header"
        className="flex items-center justify-between px-4 py-2.5 bg-[#1a1b26] border-b border-white/5 select-none"
      >
        <WindowControls target="terminal" />
        <div className="flex items-center gap-2 flex-1 justify-center">
          <TerminalIcon size={13} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-400">umer — -zsh — 80×24</span>
        </div>
        <div className="w-16" />
      </div>

      {/* Terminal body */}
      <div ref={scrollRef} className="term-scroll flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Welcome banner */}
        <div className="text-[12px] text-gray-500">
          <p>Last login: {now.toLocaleString()} on ttys001</p>
          <p className="text-emerald-400">Welcome to Umer&apos;s Portfolio Shell v1.0.0</p>
        </div>

        {/* Command 1: neofetch-style */}
        <div>
          <p className="flex items-center">
            <Prompt />
            <Typewriter
              text="neofetch"
              speed={40}
              onDone={advance(1)}
              className="text-white font-semibold"
            />
          </p>

          {phase >= 1 && (
            <div className="mt-4 flex flex-col sm:flex-row gap-8 animate-fade-in">
              <pre
                aria-hidden="true"
                className="hidden sm:block text-[14px] leading-[1.1] text-sky-300 select-none"
              >
                {`██    ██
██    ██
██    ██
██    ██
 ██████ `}
              </pre>

              <div className="flex-1 min-w-0 space-y-4">
                <div>
                  <p className="text-white font-semibold">
                    <span className="text-emerald-400">umer</span>
                    <span className="text-gray-500">@</span>
                    <span className="text-emerald-400">portfolio</span>
                  </p>
                  <p className="text-[#3b4261]">{"─".repeat(14)}</p>
                  <dl className="mt-1 grid grid-cols-[6.5rem_1fr] gap-y-0.5 text-[12px]">
                    {[
                      ["OS", "macOS Portfolio"],
                      ["Host", "MacBook Pro"],
                      ["Kernel", "React 18.2.0"],
                      ["Shell", "zsh 5.9"],
                      ["Resolution", "1440x900"],
                      ["WM", "Tailwind CSS"],
                    ].map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt className="text-sky-300">{k}</dt>
                        <dd className="text-gray-300">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="space-y-1.5 pt-1 max-w-md">
                  {Object.entries(SKILL_LEVELS).map(([k, v], i) => (
                    <SkillBar key={k} label={k} level={v} delay={300 + i * 120} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Command 2: show tech stack as JSON */}
        {phase >= 1 && (
          <div>
            <p className="flex items-center">
              <Prompt />
              <Typewriter
                text="cat skills.json"
                speed={40}
                onDone={advance(2)}
                className="text-white font-semibold"
              />
            </p>

            {phase >= 2 && (
              <div className="mt-2 text-[12px] animate-fade-in select-text">
                <div className="text-gray-500">{"{"}</div>
                {techStack.map((tech, i) => (
                  <div
                    key={tech.category}
                    className="pl-8 [text-indent:-1rem] break-words"
                  >
                    <span className="text-sky-300">"{tech.category.toLowerCase()}"</span>
                    <span className="text-gray-500">: </span>
                    <span className="text-amber-300">[</span>
                    {tech.items.map((item, idx) => (
                      <span key={idx}>
                        <span className="text-emerald-300">"{item}"</span>
                        {idx < tech.items.length - 1 && (
                          <span className="text-gray-500">, </span>
                        )}
                      </span>
                    ))}
                    <span className="text-amber-300">]</span>
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
          <div>
            <p className="flex items-center">
              <Prompt />
              <Typewriter
                text="uptime"
                speed={40}
                onDone={advance(3)}
                className="text-white font-semibold"
              />
            </p>

            {phase >= 3 && (
              <div className="mt-2 text-[12px] text-gray-400 space-y-1 animate-fade-in select-text">
                <p>
                  {now.toLocaleTimeString()} up 999 days, 42 mins, 1 user, load averages: 0.12 0.08 0.05
                </p>
                <p className="text-emerald-400">
                  ✓ All systems operational. {techStack.length} skill categories loaded.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Final blinking cursor */}
        {phase >= 3 && (
          <p className="flex items-center">
            <Prompt />
            <span className="inline-block w-2 h-4 bg-sky-300 align-middle animate-blink" />
          </p>
        )}
      </div>
    </div>
  );
};

const TerminalWindow = WindowWrapper(Terminal, "terminal");
export default TerminalWindow;
