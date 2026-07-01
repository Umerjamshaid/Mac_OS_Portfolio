import { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

const SpotifyLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="white">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

// Replace with your own Spotify playlist URL ID
const SPOTIFY_EMBED =
  "https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator&theme=0";

// 5 symmetric fluid wave layers — M3 Expressive "Now Playing" style
const WAVES = [
  { freq: 0.016, speed: 0.60, amp: 3,  yOff: -18, alpha: 0.25, lw: 1.5 },
  { freq: 0.022, speed: 0.90, amp: 7,  yOff:  -9, alpha: 0.50, lw: 2.0 },
  { freq: 0.030, speed: 1.30, amp: 13, yOff:   0, alpha: 0.92, lw: 2.5 },
  { freq: 0.022, speed: 0.85, amp: 7,  yOff:   9, alpha: 0.50, lw: 2.0 },
  { freq: 0.016, speed: 0.55, amp: 3,  yOff:  18, alpha: 0.25, lw: 1.5 },
];

const SpotifyPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const tRef      = useRef(0);

  useEffect(() => {
    if (!isOpen) {
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    // Device-pixel-ratio sharpness
    const dpr = window.devicePixelRatio || 1;
    if (canvas._dprSet !== dpr) {
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);
      canvas._dprSet = dpr;
    }

    const cW = W;
    const cH = H;

    const tick = () => {
      tRef.current += 0.016;
      const t = tRef.current;
      ctx.clearRect(0, 0, cW, cH);

      // Gentle breathing: amplitude pulses slowly
      const breathe = 0.60 + 0.40 * Math.sin(t * 1.05);

      WAVES.forEach(({ freq, speed, amp, yOff, alpha, lw }) => {
        // Gradient fades at both edges — signature M3 look
        const grad = ctx.createLinearGradient(0, 0, cW, 0);
        grad.addColorStop(0,    `rgba(29,185,84,0)`);
        grad.addColorStop(0.12, `rgba(29,185,84,${alpha})`);
        grad.addColorStop(0.5,  `rgba(30,215,96,${alpha})`);
        grad.addColorStop(0.88, `rgba(29,185,84,${alpha})`);
        grad.addColorStop(1,    `rgba(29,185,84,0)`);

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth   = lw;
        ctx.lineJoin    = "round";
        ctx.lineCap     = "round";

        for (let x = 0; x <= cW; x++) {
          const y =
            cH / 2 +
            yOff +
            Math.sin(x * freq + t * speed) * amp * breathe +
            // second harmonic adds complexity
            Math.sin(x * freq * 1.7 + t * speed * 0.6) * amp * 0.3 * breathe;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; } };
  }, [isOpen]);

  return (
    <div className="spotify-widget">
      {isOpen && (
        <div className="spotify-panel">
          {/* Header */}
          <div className="spotify-panel-header">
            <div className="flex items-center gap-2">
              <svg className="spotify-logo" viewBox="0 0 24 24" fill="#1db954">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <span className="text-xs font-semibold text-white tracking-wide">Now Playing</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white/40 hover:text-white"
            >
              <ChevronDown size={14} />
            </button>
          </div>

          {/* M3 Fluid Wave Visualizer */}
          <div className="spotify-canvas-wrap">
            <canvas ref={canvasRef} width={300} height={60} className="spotify-wave-canvas" />
          </div>

          {/* Spotify Embed */}
          <iframe
            src={SPOTIFY_EMBED}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Player"
          />
        </div>
      )}

      <button
        className="spotify-toggle"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Hide Spotify player" : "Open Spotify player"}
        title={isOpen ? "Hide Player" : "Open Spotify"}
      >
        {isOpen ? <X size={18} color="white" /> : <SpotifyLogo className="spotify-toggle-logo" />}
      </button>
    </div>
  );
};

export default SpotifyPlayer;
