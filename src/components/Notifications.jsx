import { useState, useEffect, useRef, useCallback } from "react";
import { Briefcase, Eye, Bell, Cpu, X } from "lucide-react";

const base = import.meta.env.BASE_URL;

const QUEUE = [
  { id: 1,  delay: 5000,  Icon: Briefcase, app: "Availability", title: "Open to Work",         body: "Umer Jamshaid is actively looking for new opportunities."     },
  { id: 2,  delay: 22000, Icon: Eye,       app: "Portfolio",    title: "New visitor detected",  body: "Someone is exploring your projects right now."               },
  { id: 3,  delay: 45000, Icon: Cpu,       app: "System",       title: "Memory pressure",       body: "Ideas storage at 97% capacity. Consider hiring a developer." },
  { id: 4,  delay: 70000, Icon: Bell,      app: "Reminder",     title: "Follow-up reminder",    body: "Don't forget to reach out. The Contact window is right there."  },
];

const Notification = ({ Icon, app, title, body, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // mount → slide in
    const t1 = setTimeout(() => setVisible(true), 30);
    // auto-dismiss after 5.5 s
    const t2 = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 400); }, 5500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDismiss]);

  const dismiss = () => { setVisible(false); setTimeout(onDismiss, 400); };

  return (
    <div
      className="notification-toast"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(calc(100% + 20px))" }}
    >
      <div className="flex items-start gap-3">
        <div className="notification-icon-wrap">
          <Icon size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{app}</p>
          <p className="text-xs font-semibold text-gray-800 mt-0.5 leading-snug">{title}</p>
          <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{body}</p>
        </div>
        <button onClick={dismiss} className="text-gray-300 hover:text-gray-500 transition-colors mt-0.5 flex-shrink-0">
          <X size={12} />
        </button>
      </div>
    </div>
  );
};

const Notifications = () => {
  const [active, setActive] = useState([]);
  const timers = useRef([]);

  useEffect(() => {
    QUEUE.forEach(({ id, delay, ...rest }) => {
      const t = setTimeout(() => {
        setActive((prev) => [...prev, { id, ...rest }]);
      }, delay);
      timers.current.push(t);
    });
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const dismiss = useCallback((id) => {
    setActive((prev) => prev.filter((n) => n.id !== id));
  }, []);

  if (active.length === 0) return null;

  return (
    <div className="notification-stack">
      {active.map((n) => (
        <Notification key={n.id} {...n} onDismiss={() => dismiss(n.id)} />
      ))}
    </div>
  );
};

export default Notifications;
