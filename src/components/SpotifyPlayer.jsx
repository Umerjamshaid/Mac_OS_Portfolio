import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Music2, X, ChevronDown } from "lucide-react";

// 🎵 Replace this with your own Spotify playlist/album/track ID
// Format: https://open.spotify.com/playlist/{ID}
// Current: "Peaceful Piano" — calm instrumental, great for portfolio browsing
const SPOTIFY_EMBED =
  "https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator&theme=0";

const BAR_COUNT = 28;

const SpotifyPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const barsRef = useRef([]);
  const tweensRef = useRef([]);

  useGSAP(() => {
    // Kill old tweens
    tweensRef.current.forEach((t) => t?.kill());
    tweensRef.current = [];

    if (!isOpen) return;

    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      const tween = gsap.to(bar, {
        scaleY: () => 0.15 + Math.random() * 0.85,
        duration: 0.18 + Math.random() * 0.28,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.032,
      });
      tweensRef.current.push(tween);
    });
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
              <span className="text-sm font-semibold text-white">Now Playing</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            >
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Visualizer */}
          <div className="spotify-viz">
            {Array.from({ length: BAR_COUNT }).map((_, i) => (
              <div
                key={i}
                ref={(el) => (barsRef.current[i] = el)}
                className="spotify-viz-bar"
              />
            ))}
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

      {/* Toggle Button */}
      <button
        className="spotify-toggle"
        onClick={() => setIsOpen((v) => !v)}
        title={isOpen ? "Hide Player" : "Open Music Player"}
      >
        {isOpen ? <X size={18} color="white" /> : <Music2 size={18} color="white" />}
      </button>
    </div>
  );
};

export default SpotifyPlayer;
