import { useState, useRef, useEffect } from "react";
import { WindowControls } from "#components";
import { socials } from "#constants";
import WindowWrapper from "#hoc/WindowWrapper";
import {
  Mail, PenLine, Link2, Send, Check,
  Inbox, Star, Archive, Trash2,
  User, AtSign, MessageSquare, Sparkles,
} from "lucide-react";

const base = import.meta.env.BASE_URL;

// ─── Canvas confetti ─────────────────────────────────────────────
const CONFETTI_COLORS = ["#FF6B6B","#FFE66D","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7","#DDA0DD","#98D8C8","#1DB954","#FF9F43"];

const fireConfetti = (canvas) => {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  const pts = Array.from({ length: 110 }, () => ({
    x: Math.random() * W,
    y: -12,
    vx: (Math.random() - 0.5) * 5,
    vy: Math.random() * 4 + 2,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: Math.random() * 9 + 4,
    rot: Math.random() * Math.PI * 2,
    rotV: (Math.random() - 0.5) * 0.14,
    alpha: 1,
    rect: Math.random() > 0.38,
  }));

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    let alive = false;
    pts.forEach((p) => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.10;
      p.rot += p.rotV;
      p.alpha -= 0.007;
      if (p.alpha <= 0 || p.y > H + 20) return;
      alive = true;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      if (p.rect) ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      else { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    });
    if (alive) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, W, H);
  };
  requestAnimationFrame(draw);
};

// ─── Mock inbox email ─────────────────────────────────────────────
const InboxView = () => (
  <div className="flex flex-col h-full">
    <div className="mail-email-row mail-email-row--selected">
      <div className="flex items-center justify-between mb-0.5">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
          <span className="text-xs font-bold text-gray-800">Umer Jamshaid</span>
        </span>
        <span className="text-[10px] text-gray-400">Just now</span>
      </div>
      <p className="text-xs font-semibold text-gray-600 ml-3.5">Welcome to my portfolio!</p>
      <p className="text-[10px] text-gray-400 ml-3.5 truncate">Thanks for stopping by. Have a look around...</p>
    </div>

    <div className="flex-1 overflow-y-auto p-6">
      <h3 className="text-base font-bold text-gray-800 mb-1">Welcome to my portfolio!</h3>
      <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-5 pb-4 border-b border-gray-100">
        <span>From: <span className="text-gray-600 font-medium">umer@portfolio.dev</span></span>
        <span>·</span>
        <span>To: <span className="text-gray-600 font-medium">you</span></span>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <img src={`${base}images/umer.jpg`} alt="Umer" className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 flex-shrink-0" />
        <div>
          <p className="text-xs font-bold text-gray-700">Umer Jamshaid</p>
          <p className="text-[10px] text-gray-400">Full Stack Developer · Pakistan</p>
        </div>
      </div>

      <div className="text-sm text-gray-600 leading-relaxed space-y-3">
        <p>Hey, thanks for visiting! I'm a full stack developer who loves building beautiful, interactive web experiences.</p>
        <p>Feel free to explore — check out my <strong>projects</strong> in the Portfolio window, browse my <strong>skills</strong> in the Terminal, or switch wallpapers via the mode icon in the menu bar.</p>
        <p>If you have an opportunity or just want to say hi, head to <strong>New Message</strong> and drop me a line.</p>
        <p className="text-gray-400 text-xs italic border-l-2 border-blue-200 pl-3 mt-4">
          P.S. — There's an easter egg hiding in the compose form. Try typing "hire me" in the message body.
        </p>
      </div>
    </div>
  </div>
);

// ─── Compose view ─────────────────────────────────────────────────
const FIELDS = [
  { key: "name",    label: "From",     Icon: User,          type: "text",  ph: "Your name" },
  { key: "email",   label: "Reply-To", Icon: AtSign,        type: "email", ph: "your@email.com" },
  { key: "subject", label: "Subject",  Icon: MessageSquare, type: "text",  ph: "What's on your mind?" },
];

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

const ComposeView = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [phase, setPhase] = useState("idle"); // idle | sending | sent
  const [eggFired, setEggFired] = useState(false);
  const canvasRef = useRef(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  useEffect(() => {
    if (!eggFired && form.message.toLowerCase().includes("hire me")) {
      setEggFired(true);
      fireConfetti(canvasRef.current);
    }
  }, [form.message, eggFired]);

  const clearAll = () => {
    setForm({ ...EMPTY_FORM });
    setPhase("idle");
    setEggFired(false);
  };

  const handleSend = () => {
    if (!form.name || !form.email || !form.message) return;
    setPhase("sending");
    setTimeout(() => {
      setPhase("sent");
      setTimeout(() => { clearAll(); }, 2500);
    }, 1300);
  };

  if (phase === "sent") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center ring-4 ring-green-100">
          <Check size={30} className="text-green-500" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-base font-bold text-gray-800">Message sent!</p>
          <p className="text-sm text-gray-400 mt-1">I'll get back to you as soon as possible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full">
      <canvas ref={canvasRef} width={480} height={420} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
        <PenLine size={13} className="text-blue-400" />
        <span className="text-xs font-semibold text-gray-500">New Message</span>
        {eggFired && (
          <span className="ml-auto flex items-center gap-1 text-[10px] font-medium text-purple-500 animate-pulse">
            <Sparkles size={11} />
            Easter egg unlocked!
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {FIELDS.map(({ key, label, Icon, type, ph }) => (
          <div key={key} className="flex items-center gap-3 px-5 py-2.5">
            <div className="flex items-center gap-1.5 w-[72px] flex-shrink-0">
              <Icon size={12} className="text-gray-300" />
              <span className="text-xs text-gray-400">{label}</span>
            </div>
            <input
              type={type}
              value={form[key]}
              onChange={set(key)}
              placeholder={ph}
              className="flex-1 text-sm text-gray-700 placeholder:text-gray-300 outline-none bg-transparent py-0.5"
            />
          </div>
        ))}
        <div className="px-5 pt-3 pb-2">
          <textarea
            value={form.message}
            onChange={set("message")}
            placeholder={`Write your message...\n\n(Hint: type "hire me" somewhere in here)`}
            rows={7}
            className="w-full text-sm text-gray-700 placeholder:text-gray-300 outline-none resize-none bg-transparent leading-relaxed"
          />
        </div>
      </div>

      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <p className="text-[10px] text-gray-400">
          {!form.name || !form.email || !form.message ? "Fill in all required fields to send" : "Ready to send"}
        </p>
        <button
          onClick={handleSend}
          disabled={phase === "sending" || !form.name || !form.email || !form.message}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {phase === "sending" ? (
            <><span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending</>
          ) : (
            <><Send size={12} /> Send</>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── Socials view ─────────────────────────────────────────────────
const SocialsView = () => (
  <div className="flex flex-col h-full">
    <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
      <Link2 size={13} className="text-blue-400" />
      <span className="text-xs font-semibold text-gray-500">Social Links</span>
    </div>
    <div className="flex-1 overflow-y-auto p-5">
      <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-gray-50">
        <img src={`${base}images/umer.jpg`} alt="Umer" className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow" />
        <div>
          <p className="text-sm font-bold text-gray-800">Umer Jamshaid</p>
          <p className="text-xs text-gray-400">Full Stack Developer</p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-500 font-medium">Available for work</span>
          </div>
        </div>
      </div>

      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Links</p>
      <div className="space-y-2">
        {socials.map(({ id, text, icon, link, bg }) => (
          <a
            key={id}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: bg + "22" }}>
              <img src={icon} alt={text} className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-700">{text}</p>
              <p className="text-[10px] text-gray-400 truncate">{link.replace("https://", "")}</p>
            </div>
            <Link2 size={13} className="text-gray-300 group-hover:text-gray-400 transition-colors flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  </div>
);

// ─── Sidebar ──────────────────────────────────────────────────────
const SIDEBAR_NAV = [
  { id: "inbox",   label: "Inbox",       Icon: Inbox,   count: 1 },
  { id: "compose", label: "New Message", Icon: PenLine, count: null },
  { id: "socials", label: "Links",       Icon: Link2,   count: 4 },
];
const SIDEBAR_FOLDERS = [
  { label: "Favourites", Icon: Star },
  { label: "Archive",    Icon: Archive },
  { label: "Trash",      Icon: Trash2 },
];

// ─── Root component ───────────────────────────────────────────────
const Contact = () => {
  const [view, setView] = useState("inbox");

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white rounded-xl">
      <div id="window-header" className="border-b border-gray-200 bg-gray-50/80">
        <WindowControls target="contact" />
        <div className="flex items-center gap-1.5 flex-1 justify-center">
          <Mail size={13} className="text-gray-500" />
          <span className="text-xs font-semibold text-gray-600">Mail</span>
        </div>
        <div className="w-16" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="mail-sidebar">
          <div className="px-2 py-3">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1.5">Portfolio</p>
            {SIDEBAR_NAV.map(({ id, label, Icon, count }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`mail-sidebar-btn ${view === id ? "mail-sidebar-btn--active" : ""}`}
              >
                <Icon size={14} className={view === id ? "text-blue-500" : "text-gray-400"} />
                <span className="flex-1 text-left text-xs">{label}</span>
                {count !== null && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                    view === id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="px-2 py-2 border-t border-gray-100/80">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1.5">Folders</p>
            {SIDEBAR_FOLDERS.map(({ label, Icon }) => (
              <button key={label} disabled className="mail-sidebar-btn opacity-40 cursor-default">
                <Icon size={14} className="text-gray-400" />
                <span className="flex-1 text-left text-xs text-gray-500">{label}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 overflow-hidden flex flex-col">
          {view === "inbox"   && <InboxView />}
          {view === "compose" && <ComposeView />}
          {view === "socials" && <SocialsView />}
        </div>
      </div>
    </div>
  );
};

const ContactWindow = WindowWrapper(Contact, "contact");
export default ContactWindow;
