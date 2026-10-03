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
// SF Mono first — Mac users get the native mono font
const FONT_STACK =
  "'SF Mono','JetBrains Mono',ui-monospace,Menlo,Consolas,monospace";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const Prompt = () => (
  <span className="mr-2 whitespace-nowrap">
    <span className="text-emerald-400">umer@portfolio</span>{" "}
    <span className="text-sky-300">~</span>{" "}
    <span className="text-gray-400">%</span>
  </span>
);

const Typewriter = ({ text, speed = 25, onDone, className = "", instant = false }) => {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const idxRef = useRef(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (prefersReducedMotion() || instant) {
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
  }, [text, speed, instant]);

  return (
    <span className={className}>
      {displayed}
      {isTyping && (
        <span className="inline-block w-2 h-4 bg-sky-300 align-middle ml-0.5 animate-blink" />
      )}
    </span>
  );
};

/* Block meter — characters, single hue. role="img" + aria-label carries the info */
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
        <span className="text-emerald-400">{"█".repeat(filled)}</span>
        <span className="text-[#2f334d]">{"░".repeat(CELLS - filled)}</span>
      </span>
      <span className="text-right text-gray-300 tabular-nums">{level}%</span>
    </div>
  );
};

/* ---------- Reusable output blocks (intro + re-runnable commands) ---------- */

const NeofetchBlock = ({ barDelay = 300 }) => (
  <div className="mt-4 flex flex-col sm:flex-row gap-8 animate-fade-in">
    <pre
      aria-hidden="true"
      className="hidden sm:block text-[14px] leading-[1.15] text-sky-300 select-none"
    >
{`██     ██
██     ██
██     ██
██     ██
██     ██
 ███████`}
    </pre>
    <div className="flex-1 min-w-0 space-y-4">
      <div>
        <p className="text-white font-semibold">
          <span className="text-emerald-400">umer</span>
          <span className="text-gray-400">@</span>
          <span className="text-emerald-400">portfolio</span>
        </p>
        <p className="text-[#2f334d]">{"─".repeat(14)}</p>
        <dl className="mt-1 grid grid-cols-[6.5rem_1fr] gap-y-0.5 text-[12px]">
          {[
            ["OS", "macOS Portfolio"],
            ["Host", "MacBook Pro"],
            ["Kernel", "React 18.2.0"],
            ["Shell", "zsh 5.9"],
            ["Resolution", "1440×900"],
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
          <SkillBar key={k} label={k} level={v} delay={barDelay + i * 120} />
        ))}
      </div>
    </div>
  </div>
);

const SkillsJson = () => (
  <div className="mt-2 text-[12px] animate-fade-in select-text">
    <div className="text-gray-400">{"{"}</div>
    {techStack.map((tech, i) => (
      <div key={tech.category} className="pl-8 [text-indent:-1rem] break-words">
        <span className="text-sky-300">"{tech.category.toLowerCase()}"</span>
        <span className="text-gray-400">: </span>
        <span className="text-amber-300">[</span>
        {tech.items.map((item, idx) => (
          <span key={idx}>
            <span className="text-emerald-300">"{item}"</span>
            {idx < tech.items.length - 1 && <span className="text-gray-400">, </span>}
          </span>
        ))}
        <span className="text-amber-300">]</span>
        {i < techStack.length - 1 && <span className="text-gray-400">,</span>}
      </div>
    ))}
    <div className="text-gray-400">{"}"}</div>
  </div>
);

const UptimeBlock = ({ now }) => (
  <div className="mt-2 text-[12px] text-gray-400 space-y-1 animate-fade-in select-text">
    <p>
      {now.toLocaleTimeString()} up 999 days, 42 mins, 1 user, load averages: 0.12 0.08 0.05
    </p>
    <p className="text-emerald-400">
      ✓ All systems operational. {techStack.length} skill categories loaded.
    </p>
  </div>
);

/* ---------- Command interpreter ---------- */

const buildOutput = (raw, now) => {
  const line = raw.trim();
  const cmd = line.toLowerCase();

  switch (cmd) {
    case "":
      return null;

    case "help":
      return (
        <div className="text-[12px] space-y-1">
          <p className="text-gray-400">Available commands:</p>
          {[
            ["neofetch", "system info + skill meters"],
            ["cat skills.json", "full tech stack"],
            ["uptime", "session summary"],
            ["whoami", "who is behind this"],
            ["contact", "how to reach me"],
            ["clear", "clear the screen"],
          ].map(([c, d]) => (
            <p key={c}>
              <span className="text-sky-300">{c}</span>
              <span className="text-gray-400"> — </span>
              <span className="text-gray-300">{d}</span>
            </p>
          ))}
        </div>
      );

    case "neofetch":
      return <NeofetchBlock barDelay={100} />;

    case "cat skills.json":
      return <SkillsJson />;

    case "cat":
      return (
        <p className="text-[12px] text-gray-400">usage: cat [file]</p>
      );

    case "ls":
      return (
        <p className="text-[12px] leading-loose select-text">
          {techStack.map((t) => (
            <span key={t.category} className="text-sky-300 mr-4">
              {t.category.toLowerCase()}/
            </span>
          ))}
          <span className="text-amber-300">skills.json</span>
        </p>
      );

    case "uptime":
      return <UptimeBlock now={now} />;

    case "whoami":
      return (
        <p className="text-[12px] text-gray-300 max-w-md select-text">
          Umer — mobile &amp; backend developer. Flutter by day, Python by night.
          Currently shipping <span className="text-sky-300">portfolio v1.0</span>.
        </p>
      );

    case "contact":
      return (
        <div className="text-[12px] space-y-1 select-text">
          {/* TODO: replace with real links */}
          <p>
            <span className="text-sky-300">email</span>
            <span className="text-gray-400"> — </span>
            <span className="text-gray-300">hello@umer.dev</span>
          </p>
          <p>
            <span className="text-sky-300">github</span>
            <span className="text-gray-400"> — </span>
            <span className="text-gray-300">github.com/umer</span>
          </p>
          <p>
            <span className="text-sky-300">linkedin</span>
            <span className="text-gray-400"> — </span>
            <span className="text-gray-300">linkedin.com/in/umer</span>
          </p>
        </div>
      );

    case "date":
      return <p className="text-[12px] text-gray-300">{now.toString()}</p>;

    case "exit":
      return (
        <p className="text-[12px] text-gray-400">
          There is no exit from this shell. Try <span className="text-sky-300">help</span>.
        </p>
      );

    case "sudo hire":
      return (
        <p className="text-[12px]">
          <span className="text-emerald-400">Permission granted.</span>{" "}
          <span className="text-gray-300">Head to the contact section below.</span>
        </p>
      );

    default:
      if (cmd.startsWith("cat ")) {
        return (
          <p className="text-[12px]">
            <span className="text-red-400">cat:</span>{" "}
            <span className="text-gray-300">{line.slice(4)}: No such file or directory</span>
          </p>
        );
      }
      if (cmd.startsWith("sudo")) {
        return (
          <p className="text-[12px]">
            <span className="text-red-400">umer</span>
            <span className="text-gray-400"> is not in the sudoers file. This incident will be reported.</span>
          </p>
        );
      }
      return (
        <p className="text-[12px]">
          <span className="text-red-400">zsh: command not found:</span>{" "}
          <span className="text-gray-300">{line}</span>
        </p>
      );
  }
};

/* ---------- Main component ---------- */

const Terminal = () => {
  const [phase, setPhase] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [history, setHistory] = useState([]); // {kind:'cmd'|'out'|'sys', text?, node?}
  const [value, setValue] = useState("");
  const [now] = useState(() => new Date());
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const wantFocus = useRef(false);
  const hinted = useRef(false);
  const cmdHistoryRef = useRef([]);
  const histIdx = useRef(-1);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [phase, history]);

  // One-time hint when the interactive prompt goes live
  useEffect(() => {
    if (phase >= 4 && !hinted.current) {
      hinted.current = true;
      setHistory((h) => [
        ...h,
        {
          kind: "sys",
          node: (
            <p>
              Type <span className="text-sky-300">help</span> to list available commands.
            </p>
          ),
        },
      ]);
    }
  }, [phase]);

  // Focus the input only after an explicit user gesture (never autofocus on mount)
  useEffect(() => {
    if (phase >= 4 && wantFocus.current) {
      inputRef.current?.focus();
      wantFocus.current = false;
    }
  }, [phase]);

  const advance = (n) => () => setPhase((p) => Math.max(p, n));

  const onBodyClick = () => {
    // Don't hijack clicks when the user is selecting text
    if (window.getSelection?.()?.toString()) return;
    if (phase < 4) {
      wantFocus.current = true;
      setSkipped(true);
      setPhase(4);
    } else {
      inputRef.current?.focus();
    }
  };

  const handleCommand = (raw) => {
    if (raw.trim().toLowerCase() === "clear") {
      setCleared(true);
      setHistory([]);
      return;
    }
    cmdHistoryRef.current.push(raw);
    histIdx.current = -1;
    const out = buildOutput(raw, now);
    setHistory((h) =>
      out
        ? [...h, { kind: "cmd", text: raw }, { kind: "out", node: out }]
        : [...h, { kind: "cmd", text: raw }]
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleCommand(value);
    setValue("");
  };

  const navigateHistory = (dir) => {
    const arr = cmdHistoryRef.current;
    if (!arr.length) return;
    if (dir === "up") {
      histIdx.current = histIdx.current < 0 ? arr.length - 1 : Math.max(0, histIdx.current - 1);
      setValue(arr[histIdx.current]);
    } else {
      histIdx.current += 1;
      if (histIdx.current >= arr.length) {
        histIdx.current = -1;
        setValue("");
      } else {
        setValue(arr[histIdx.current]);
      }
    }
  };

  return (
    <div
      className="relative flex flex-col h-full bg-[#16161e] text-[#c0caf5] text-[13px] leading-relaxed rounded-[10px] overflow-hidden"
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

      {/* macOS vibrancy toolbar — content scrolls under the glass.
          Glass lives ONLY on this functional layer, never on content. */}
      <header
        id="window-header"
        className="absolute inset-x-0 top-0 z-10 grid h-11 grid-cols-[1fr_auto_1fr] items-center border-b border-white/[0.06] bg-[#1a1b26]/60 backdrop-blur-xl select-none"
      >
        <div className="justify-self-start">
          <WindowControls target="terminal" />
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <TerminalIcon size={13} className="text-gray-400 shrink-0" />
          <span className="text-xs font-medium text-gray-400 truncate">
            umer — -zsh — 80×24
          </span>
        </div>
        <div />
      </header>

      {/* Terminal output — keyboard-scrollable, announced to screen readers */}
      <div
        ref={scrollRef}
        onClick={onBodyClick}
        role="log"
        aria-live="polite"
        aria-label="Terminal session"
        tabIndex={0}
        className="term-scroll flex-1 overflow-y-auto px-5 pt-14 pb-4 space-y-5 focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-sky-300/30"
      >
        {/* Welcome banner */}
        {!cleared && (
          <div className="text-[12px] text-gray-400">
            <p>Last login: {now.toLocaleString()} on ttys001</p>
            <p className="text-emerald-400">Welcome to Umer&apos;s Portfolio Shell v1.0.0</p>
          </div>
        )}

        {/* Intro sequence */}
        {!cleared && (
          <>
            <div>
              <p className="flex items-center">
                <Prompt />
                <Typewriter
                  text="neofetch"
                  speed={40}
                  instant={skipped}
                  onDone={advance(1)}
                  className="text-white font-semibold"
                />
              </p>
              {phase >= 1 && <NeofetchBlock />}
            </div>

            {phase >= 1 && (
              <div>
                <p className="flex items-center">
                  <Prompt />
                  <Typewriter
                    text="cat skills.json"
                    speed={40}
                    instant={skipped}
                    onDone={advance(2)}
                    className="text-white font-semibold"
                  />
                </p>
                {phase >= 2 && <SkillsJson />}
              </div>
            )}

            {phase >= 2 && (
              <div>
                <p className="flex items-center">
                  <Prompt />
                  <Typewriter
                    text="uptime"
                    speed={40}
                    instant={skipped}
                    onDone={advance(4)}
                    className="text-white font-semibold"
                  />
                </p>
                {phase >= 4 && <UptimeBlock now={now} />}
              </div>
            )}
          </>
        )}

        {/* Command history */}
        {history.map((h, i) =>
          h.kind === "cmd" ? (
            <p key={i} className="flex items-start">
              <Prompt />
              <span className="text-white font-semibold break-all">{h.text}</span>
            </p>
          ) : h.kind === "sys" ? (
            <div key={i} className="text-[12px] text-gray-400 animate-fade-in">
              {h.node}
            </div>
          ) : (
            <div key={i} className="animate-fade-in select-text">
              {h.node}
            </div>
          )
        )}

        {/* The live prompt — the fake cursor is gone, this one is real */}
        {phase >= 4 && (
          <form className="flex items-start" onSubmit={onSubmit}>
            <label htmlFor="term-input" className="sr-only">
              Terminal command
            </label>
            <Prompt />
            <input
              id="term-input"
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  navigateHistory("up");
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  navigateHistory("down");
                }
              }}
              aria-label="Type a command"
              className="flex-1 min-w-0 bg-transparent text-white font-semibold caret-sky-300 focus:outline-none"
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
            />
          </form>
        )}
      </div>
    </div>
  );
};

const TerminalWindow = WindowWrapper(Terminal, "terminal");
export default TerminalWindow;
