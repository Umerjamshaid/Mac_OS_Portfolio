import { useState, useRef, useEffect, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import dayjs from "dayjs";
import useWindowStore from "#store/window";
import useDesktopStore from "#store/desktop";
import { WALLPAPERS } from "#constants";

const base = import.meta.env.BASE_URL;
const PASSCODES = ["123", "hire", "hello", "open"];

const LockScreen = () => {
  const { isLocked, unlock } = useWindowStore();
  const { activeWallpaperId } = useDesktopStore();

  const [input,  setInput]  = useState("");
  const [error,  setError]  = useState(false);
  const [time,   setTime]   = useState(dayjs());

  const containerRef = useRef(null);
  const inputRef     = useRef(null);
  const dotsRef      = useRef(null);

  const wallpaper = WALLPAPERS.find((w) => w.id === activeWallpaperId) ?? WALLPAPERS[0];

  useEffect(() => {
    const id = setInterval(() => setTime(dayjs()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (isLocked) setTimeout(() => inputRef.current?.focus(), 600);
  }, [isLocked]);

  // Wake-up fade-in on mount
  useGSAP(() => {
    if (!isLocked) return;
    gsap.from(containerRef.current, { opacity: 0, duration: 1.2, ease: "power2.out" });
  }, []);

  // Pop-in for each new dot
  useGSAP(() => {
    if (input.length > 0) {
      gsap.from(".lock-dot:last-child", { scale: 0, duration: 0.18, ease: "back.out(3)" });
    }
  }, [input.length]);

  const handleChange = useCallback((e) => {
    setInput(e.target.value);
    setError(false);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        if (PASSCODES.includes(input.toLowerCase().trim()) || input === "") {
          gsap.to(containerRef.current, {
            y: "-100%",
            opacity: 0,
            duration: 0.75,
            ease: "power3.inOut",
            onComplete: unlock,
          });
        } else {
          setError(true);
          gsap.to(dotsRef.current, {
            keyframes: { x: [-14, 14, -9, 9, -5, 5, 0] },
            duration: 0.5,
            ease: "power2.out",
          });
          setTimeout(() => { setInput(""); setError(false); }, 850);
        }
      }
    },
    [input, unlock],
  );

  if (!isLocked) return null;

  return (
    <div
      ref={containerRef}
      className="lock-screen"
      style={{ backgroundImage: `url("${wallpaper.src}")` }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* ── Clock ── */}
      <div className="lock-clock">
        <p className="lock-time">{time.format("h:mm")}</p>
        <p className="lock-date">{time.format("dddd, MMMM D")}</p>
      </div>

      {/* ── Avatar + Name ── */}
      <div className="lock-profile">
        <img src={`${base}images/umer.jpg`} alt="Umer Jamshaid" />
        <p className="lock-name">Umer Jamshaid</p>
      </div>

      {/* ── Password Field ── */}
      <div className="lock-input-area">
        <form onSubmit={(e) => { e.preventDefault(); handleKeyDown({ key: "Enter" }); }}>
        <input
          ref={inputRef}
          type="password"
          inputMode="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="sr-only"
          aria-label="Enter passcode"
          autoComplete="current-password"
        />
        </form>

        <div
          ref={dotsRef}
          className={`lock-dots${error ? " lock-dots-error" : ""}`}
          onClick={() => inputRef.current?.focus()}
        >
          {input.length === 0 ? (
            <span className="lock-placeholder">Enter Password</span>
          ) : (
            Array.from({ length: input.length }).map((_, i) => (
              <span key={i} className="lock-dot" />
            ))
          )}
        </div>

        <button
          className="lock-enter-btn"
          onClick={() =>
            handleKeyDown({ key: "Enter" })
          }
        >
          Unlock →
        </button>

        <p className="lock-hint">
          Hint: try &ldquo;hire&rdquo;, &ldquo;hello&rdquo;, &ldquo;123&rdquo;, or just press Enter
        </p>
      </div>
    </div>
  );
};

export default LockScreen;
