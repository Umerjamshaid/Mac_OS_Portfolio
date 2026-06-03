import { useEffect, useRef } from "react";
import { Wifi, WifiOff, Check, Lock } from "lucide-react";

const NETWORKS = [
  { ssid: "Umer's MacBook Pro",  bars: 4, secured: false, connected: true  },
  { ssid: "Home_Network_5G",     bars: 4, secured: true,  connected: false },
  { ssid: "iPhone de Ahmad",     bars: 3, secured: true,  connected: false },
  { ssid: "TP-Link_2E4A",        bars: 3, secured: true,  connected: false },
  { ssid: "Pixel_Hotspot",       bars: 2, secured: true,  connected: false },
  { ssid: "PTCL-BB-B73F",        bars: 2, secured: true,  connected: false },
  { ssid: "AndroidAP_7E3D",      bars: 1, secured: false, connected: false },
];

const SignalBars = ({ bars, active }) => {
  const color = active ? "#3b82f6" : "#6b7280";
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={i * 4 + 0.5}
          y={12 - (i + 1) * 2.5 - 0.5}
          width="3"
          height={(i + 1) * 2.5}
          rx="0.5"
          fill={bars > i ? color : "#d1d5db"}
        />
      ))}
    </svg>
  );
};

const WifiPopup = ({ onClose }) => {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const timeoutId = setTimeout(() => document.addEventListener("mousedown", handler), 50);
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handler);
    };
  }, [onClose]);

  return (
    <div ref={ref} className="wifi-popup">
      {/* Header */}
      <div className="wifi-popup-header">
        <div className="flex items-center gap-2">
          <Wifi size={14} className="text-blue-500" />
          <span className="text-sm font-semibold text-gray-800">Wi-Fi</span>
        </div>
        <button className="text-blue-500 text-xs font-medium hover:text-blue-600 transition-colors">
          Preferences…
        </button>
      </div>

      {/* Connected network */}
      <div className="px-3 pt-2 pb-1">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-1 mb-1">
          Connected
        </p>
        {NETWORKS.filter((n) => n.connected).map((n) => (
          <div key={n.ssid} className="wifi-popup-network rounded-lg bg-blue-50">
            <Check size={13} className="text-blue-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{n.ssid}</p>
              <p className="text-[10px] text-gray-400">Connected</p>
            </div>
            <SignalBars bars={n.bars} active />
          </div>
        ))}
      </div>

      {/* Nearby networks */}
      <div className="px-3 pb-2">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-1 mb-1">
          Nearby Networks
        </p>
        {NETWORKS.filter((n) => !n.connected).map((n) => (
          <div key={n.ssid} className="wifi-popup-network rounded-lg">
            <div className="w-3.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 truncate">{n.ssid}</p>
            </div>
            {n.secured && <Lock size={10} className="text-gray-400 flex-shrink-0" />}
            <SignalBars bars={n.bars} active={false} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="wifi-popup-footer">
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors">
          <WifiOff size={11} />
          Turn Wi-Fi Off
        </button>
        <button className="text-blue-500 hover:text-blue-600 transition-colors">
          Other…
        </button>
      </div>
    </div>
  );
};

export default WifiPopup;
