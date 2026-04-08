import { useState, useRef, useEffect, useCallback } from "react";
import { WindowControls } from "#components";
import { socials } from "#constants";
import WindowWrapper from "#hoc/WindowWrapper";

// ─── tiny "copy link" toast ───────────────────────────────────
const CopyToast = ({ show, label }) => {
  const [visible, setVisible] = useState(false);
  const timeout = useRef();

  useEffect(() => {
    clearTimeout(timeout.current);
    if (show) {
      setVisible(true);
      timeout.current = setTimeout(() => setVisible(false), 1800);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <span className="absolute -top-7 right-0 text-[10px] font-medium
                     bg-black/80 text-white px-2 py-0.5 rounded-md
                     animate-fade-out pointer-events-none whitespace-nowrap">
      {label}
    </span>
  );
};

// ─── single social card (original colored card style) ─────────
const SocialLink = ({ id, bg, link, icon, text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigator.clipboard.writeText(link).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      });
    },
    [link]
  );

  return (
    <li className="group relative" style={{ backgroundColor: bg }}>
      <a href={link} target="_blank" rel="noopener noreferrer" title={text}>
        <img src={icon} alt={text} className="size-5" />
        <p>{text}</p>
      </a>

      {/* copy button — appears on hover */}
      <button
        onClick={handleCopy}
        className="absolute top-1.5 right-1.5
                   opacity-0 group-hover:opacity-100
                   p-1 rounded-md bg-white/20
                   hover:bg-white/30 active:scale-95
                   transition-all duration-150"
        title="Copy link"
      >
        <CopyToast show={copied} label="Copied!" />
        <svg
          className="size-3 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {copied ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          ) : (
            <>
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </>
          )}
        </svg>
      </button>
    </li>
  );
};

// ─── animated status dot ──────────────────────────────────────
const StatusDot = () => (
  <span className="relative flex h-2.5 w-2.5">
    <span className="animate-ping absolute inline-flex h-full w-full
                       rounded-full bg-emerald-400 opacity-75" />
    <span className="relative inline-flex rounded-full h-2.5 w-2.5
                       bg-emerald-500" />
  </span>
);

// ─── main contact window ──────────────────────────────────────
const Contact = () => {
  const [activeTab, setActiveTab] = useState("connect");

  return (
    <>
      <div id="window-header">
        <WindowControls target="contact" />
        <h2>Contacts</h2>
      </div>

      {/* ── tab bar ── */}
      <div className="flex border-b border-black/5 px-6 pt-1">
        {["connect", "about"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              pb-2 px-3 text-xs font-medium capitalize tracking-wide
              transition-colors relative
              ${
                activeTab === tab
                  ? "text-black/80"
                  : "text-black/35 hover:text-black/55"
              }
            `}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 inset-x-3 h-[1.5px]
                               bg-black/70 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="p-5 space-y-5">
        {/* ── profile card ── */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative group">
            <img
              src="/images/umer.jpg"
              alt="UmerJamshaid"
              className="w-20 rounded-full"
            />
            <div className="absolute -bottom-0.5 -right-0.5 ring-2 ring-white
                            rounded-full">
              <StatusDot />
            </div>
          </div>

          <div className="space-y-1">
            <h3>Umer Jamshaid</h3>
            <p className="text-[11px] text-black/40 flex items-center gap-1.5
                           justify-center">
              <StatusDot />
              Available for work
            </p>
          </div>
        </div>

        {/* ── tab content ── */}
        {activeTab === "connect" ? (
          <>
            <p className="text-sm text-center text-black/45 leading-relaxed">
              Got an idea? A bug to squash? Or just wanna talk tech? I'm in.
            </p>

            {/* ── social links (original card style) ── */}
            <ul>
              {socials.map((props) => (
                <SocialLink key={props.id} {...props} />
              ))}
            </ul>
          </>
        ) : (
          /* ── about tab ── */
          <div className="text-left space-y-3 text-[13px] text-black/55 leading-relaxed">
            <p>
              Hey 👋 I'm Umer — a developer who loves building things for the
              web. I enjoy turning ideas into clean, performant, and
              pixel-perfect interfaces.
            </p>
            <p>
              When I'm not coding, you'll find me exploring new tech,
              contributing to open source, or overthinking my wallpaper
              choices.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {["React", "Next.js", "Tailwind", "GSAP"].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium
                             bg-black/[0.04] text-black/45"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// ─── tiny inline copy helper ──────────────────────────────────
const QuickCopy = ({ label, value }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <button
      onClick={copy}
      className="flex items-center justify-between w-full group"
    >
      <div className="flex items-center gap-2">
        <svg
          className="size-3.5 text-black/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15
               a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5
               4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25
               2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36
               0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
        <span className="text-[12px] text-black/50 group-hover:text-black/70
                         transition-colors">
          {value}
        </span>
      </div>
      <span
        className="text-[10px] font-medium px-1.5 py-0.5 rounded
                   transition-all duration-200
                   text-black/35 hover:text-black/60
                   hover:bg-black/5"
      >
        {copied ? "✓ Copied" : "Copy"}
      </span>
    </button>
  );
};

const ContactWindow = WindowWrapper(Contact, "contact");

export default ContactWindow;