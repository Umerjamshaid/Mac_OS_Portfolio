import { useEffect, useRef, useState, useCallback } from "react";
import { Trophy } from "lucide-react";

// ─── Global canvas confetti (full-screen) ────────────────────────
const COLORS = ["#FF6B6B","#FFE66D","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7","#DDA0DD","#1DB954","#FF9F43","#A29BFE"];

const fireFullConfetti = (canvas) => {
  if (!canvas) return;
  const ctx  = canvas.getContext("2d");
  const W    = window.innerWidth;
  const H    = window.innerHeight;
  canvas.width  = W;
  canvas.height = H;

  const pts = Array.from({ length: 180 }, () => ({
    x:    Math.random() * W,
    y:    -16,
    vx:   (Math.random() - 0.5) * 7,
    vy:   Math.random() * 6 + 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size:  Math.random() * 11 + 4,
    rot:   Math.random() * Math.PI * 2,
    rotV:  (Math.random() - 0.5) * 0.16,
    alpha: 1,
    rect:  Math.random() > 0.4,
  }));

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    let alive = false;
    pts.forEach((p) => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.11;
      p.rot += p.rotV;
      p.alpha -= 0.006;
      if (p.alpha <= 0 || p.y > H + 24) return;
      alive = true;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle   = p.color;
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

// ─── Desktop click ripple ────────────────────────────────────────
const Ripple = ({ x, y, id, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 700);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="desktop-ripple"
      style={{ left: x, top: y }}
    />
  );
};

// ─── Konami achievement toast ────────────────────────────────────
const AchievementToast = ({ onDone }) => {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setVis(true), 30);
    const t2 = setTimeout(() => { setVis(false); setTimeout(onDone, 400); }, 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className="achievement-toast"
      style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)" }}
    >
      <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center flex-shrink-0">
        <Trophy size={20} className="text-white" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest">Achievement Unlocked</p>
        <p className="text-sm font-bold text-gray-800">Konami Master</p>
        <p className="text-[11px] text-gray-500">You know the code. Legendary.</p>
      </div>
    </div>
  );
};

// ─── Konami sequence ─────────────────────────────────────────────
const KONAMI = [
  "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
  "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
  "b","a",
];

// ─── Main export ─────────────────────────────────────────────────
const DesktopEffects = ({ onDesktopClick }) => {
  const [ripples,       setRipples]       = useState([]);
  const [showAchieve,   setShowAchieve]   = useState(false);
  const confettiCanvas                    = useRef(null);
  const konamiProgress                    = useRef(0);
  const nextId                            = useRef(0);

  // Konami code listener
  useEffect(() => {
    const onKey = (e) => {
      const expected = KONAMI[konamiProgress.current];
      if (e.key === expected) {
        konamiProgress.current += 1;
        if (konamiProgress.current === KONAMI.length) {
          konamiProgress.current = 0;
          setShowAchieve(true);
          fireFullConfetti(confettiCanvas.current);
        }
      } else {
        konamiProgress.current = e.key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Desktop click ripple — called from App via onDesktopClick prop
  const addRipple = useCallback((x, y) => {
    const id = nextId.current++;
    setRipples((prev) => [...prev, { id, x, y }]);
  }, []);

  // Expose addRipple upward so App.jsx can wire it to desktop clicks
  useEffect(() => {
    if (onDesktopClick) onDesktopClick(addRipple);
  }, [onDesktopClick, addRipple]);

  return (
    <>
      {/* Full-screen confetti canvas (Konami) */}
      <canvas
        ref={confettiCanvas}
        className="fixed inset-0 w-full h-full pointer-events-none z-[9970]"
        style={{ width: "100vw", height: "100vh" }}
      />

      {/* Ripples */}
      {ripples.map(({ id, x, y }) => (
        <Ripple
          key={id}
          x={x}
          y={y}
          id={id}
          onDone={() => setRipples((prev) => prev.filter((r) => r.id !== id))}
        />
      ))}

      {/* Achievement toast */}
      {showAchieve && (
        <AchievementToast onDone={() => setShowAchieve(false)} />
      )}
    </>
  );
};

export default DesktopEffects;
