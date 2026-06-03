import { useState, useEffect, useRef, useCallback } from "react";
import { Briefcase, Eye, Bell, Cpu, X } from "lucide-react";

const QUEUE = [
  { id: 1,  delay: 5000,  Icon: Briefcase, app: "Availability", title: "Open to Work",         body: "Umer Jamshaid is actively looking for new opportunities."     },
  { id: 2,  delay: 22000, Icon: Eye,       app: "Portfolio",    title: "New visitor detected",  body: "Someone is exploring your projects right now."               },
  { id: 3,  delay: 45000, Icon: Cpu,       app: "System",       title: "Memory pressure",       body: "Ideas storage at 97% capacity. Consider hiring a developer." },
  { id: 4,  delay: 70000, Icon: Bell,      app: "Reminder",     title: "Follow-up reminder",    body: "Don't forget to reach out. The Contact window is right there."  },
];

// Format time elapsed since notification appeared (macOS style)
const formatTimeAgo = (timestamp) => {
  const now = Date.now();
  const diff = Math.floor((now - timestamp) / 1000);
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
};

const Notification = ({ Icon, app, title, body, timestamp, onDismiss, isStacked, stackIndex, totalStacked, isHovered }) => {
  const [visible, setVisible] = useState(false);
  const [timeAgo, setTimeAgo] = useState("now");

  useEffect(() => {
    // mount -> slide in
    const t1 = setTimeout(() => setVisible(true), 30);
    // auto-dismiss after 6s (macOS default)
    const t2 = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 350); }, 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDismiss]);

  // Update time ago every 30 seconds
  useEffect(() => {
    setTimeAgo(formatTimeAgo(timestamp));
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(timestamp));
    }, 30000);
    return () => clearInterval(interval);
  }, [timestamp]);

  const dismiss = (e) => {
    e.stopPropagation();
    setVisible(false);
    setTimeout(onDismiss, 350);
  };

  // Calculate stacked positioning (macOS style stacking when collapsed)
  const stackOffset = isStacked && !isHovered ? stackIndex * 6 : 0;
  const stackScale = isStacked && !isHovered ? 1 - (stackIndex * 0.03) : 1;
  const stackOpacity = isStacked && !isHovered ? 1 - (stackIndex * 0.15) : 1;

  return (
    <div
      className="macos-notification"
      style={{
        opacity: visible ? stackOpacity : 0,
        transform: visible
          ? `translateX(0) translateY(${stackOffset}px) scale(${stackScale})`
          : "translateX(calc(100% + 20px)) translateY(0) scale(1)",
        zIndex: 100 - stackIndex,
      }}
    >
      {/* Close button - appears on hover (macOS style) */}
      <button
        onClick={dismiss}
        className="macos-notification-close"
        aria-label="Dismiss notification"
      >
        <X size={10} strokeWidth={2.5} />
      </button>

      <div className="macos-notification-content">
        {/* App icon */}
        <div className="macos-notification-icon">
          <Icon size={18} strokeWidth={1.5} />
        </div>

        {/* Text content */}
        <div className="macos-notification-text">
          <div className="macos-notification-header">
            <span className="macos-notification-app">{app}</span>
            <span className="macos-notification-time">{timeAgo}</span>
          </div>
          <p className="macos-notification-title">{title}</p>
          <p className="macos-notification-body">{body}</p>
        </div>
      </div>

      {/* Stacked indicator badge (shows count when collapsed) */}
      {isStacked && stackIndex === 0 && totalStacked > 1 && !isHovered && (
        <div className="macos-notification-badge">
          {totalStacked}
        </div>
      )}
    </div>
  );
};

const Notifications = () => {
  const [active, setActive] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    QUEUE.forEach(({ id, delay, ...rest }) => {
      const t = setTimeout(() => {
        setActive((prev) => [...prev, { id, ...rest, timestamp: Date.now() }]);
      }, delay);
      timers.current.push(t);
    });
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const dismiss = useCallback((id) => {
    setActive((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setActive([]);
  }, []);

  if (active.length === 0) return null;

  const shouldStack = active.length > 1;

  return (
    <div
      className="macos-notification-stack"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Clear all button - appears on hover when multiple notifications */}
      {shouldStack && isHovered && (
        <button
          onClick={dismissAll}
          className="macos-notification-clear-all"
        >
          Clear All
        </button>
      )}

      <div className={`macos-notification-list ${isHovered ? "expanded" : "collapsed"}`}>
        {active.map((n, index) => (
          <Notification
            key={n.id}
            {...n}
            onDismiss={() => dismiss(n.id)}
            isStacked={shouldStack}
            stackIndex={index}
            totalStacked={active.length}
            isHovered={isHovered}
          />
        ))}
      </div>
    </div>
  );
};

export default Notifications;
