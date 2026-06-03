import { useState, useEffect, useRef } from "react";
import { Moon, Sun, Wifi, Bluetooth, AirplayIcon, Volume2, VolumeX, Monitor, Music, ChevronRight } from "lucide-react";
import useDesktopStore from "#store/desktop";

const ControlCenter = () => {
  const { 
    isControlCenterOpen, 
    closeControlCenter, 
    isFocusModeEnabled, 
    toggleFocusMode,
    activeWallpaperId,
    setWallpaper
  } = useDesktopStore();
  
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(75);
  const [isWifiOn, setIsWifiOn] = useState(true);
  const [isBluetoothOn, setIsBluetoothOn] = useState(true);
  const [isAirDropOn, setIsAirDropOn] = useState(false);
  const panelRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        closeControlCenter();
      }
    };
    
    if (isControlCenterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isControlCenterOpen, closeControlCenter]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closeControlCenter();
    };
    if (isControlCenterOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isControlCenterOpen, closeControlCenter]);

  if (!isControlCenterOpen) return null;

  const lightIds = [1, 5];
  const isDarkMode = !lightIds.includes(activeWallpaperId);

  const toggleDarkMode = () => {
    setWallpaper(isDarkMode ? 1 : 2);
  };

  return (
    <div 
      ref={panelRef}
      className="control-center-panel"
    >
      {/* Top Row - Connectivity */}
      <div className="cc-row">
        {/* Left: Connectivity Group */}
        <div className="cc-module cc-connectivity">
          <button 
            className={`cc-toggle-btn ${isWifiOn ? 'active' : ''}`}
            onClick={() => setIsWifiOn(!isWifiOn)}
          >
            <div className="cc-toggle-icon">
              <Wifi size={18} />
            </div>
            <div className="cc-toggle-text">
              <span className="cc-toggle-label">Wi-Fi</span>
              <span className="cc-toggle-status">{isWifiOn ? 'Home' : 'Off'}</span>
            </div>
          </button>
          
          <button 
            className={`cc-toggle-btn ${isBluetoothOn ? 'active' : ''}`}
            onClick={() => setIsBluetoothOn(!isBluetoothOn)}
          >
            <div className="cc-toggle-icon">
              <Bluetooth size={18} />
            </div>
            <div className="cc-toggle-text">
              <span className="cc-toggle-label">Bluetooth</span>
              <span className="cc-toggle-status">{isBluetoothOn ? 'On' : 'Off'}</span>
            </div>
          </button>
          
          <button 
            className={`cc-toggle-btn ${isAirDropOn ? 'active' : ''}`}
            onClick={() => setIsAirDropOn(!isAirDropOn)}
          >
            <div className="cc-toggle-icon">
              <AirplayIcon size={18} />
            </div>
            <div className="cc-toggle-text">
              <span className="cc-toggle-label">AirDrop</span>
              <span className="cc-toggle-status">{isAirDropOn ? 'Everyone' : 'Off'}</span>
            </div>
          </button>
        </div>

        {/* Right: Focus Mode */}
        <div className="cc-module cc-focus">
          <button 
            className={`cc-focus-btn ${isFocusModeEnabled ? 'active' : ''}`}
            onClick={toggleFocusMode}
          >
            <div className="cc-focus-icon">
              <Moon size={22} />
            </div>
            <span className="cc-focus-label">Focus</span>
            <span className="cc-focus-status">
              {isFocusModeEnabled ? 'On' : 'Off'}
            </span>
            {isFocusModeEnabled && (
              <div className="cc-focus-active-indicator" />
            )}
          </button>
        </div>
      </div>

      {/* Second Row - Display & Sound */}
      <div className="cc-row">
        {/* Display */}
        <div className="cc-module cc-display">
          <div className="cc-module-header">
            <Monitor size={14} />
            <span>Display</span>
          </div>
          <div className="cc-slider-container">
            <Sun size={14} className="cc-slider-icon" />
            <input
              type="range"
              min="20"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="cc-slider"
            />
          </div>
          <button 
            className={`cc-dark-mode-btn ${isDarkMode ? 'active' : ''}`}
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
            <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>

        {/* Sound */}
        <div className="cc-module cc-sound">
          <div className="cc-module-header">
            <Volume2 size={14} />
            <span>Sound</span>
          </div>
          <div className="cc-slider-container">
            {volume === 0 ? (
              <VolumeX size={14} className="cc-slider-icon" />
            ) : (
              <Volume2 size={14} className="cc-slider-icon" />
            )}
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="cc-slider"
            />
          </div>
        </div>
      </div>

      {/* Third Row - Now Playing */}
      <div className="cc-module cc-now-playing">
        <div className="cc-now-playing-content">
          <div className="cc-now-playing-art">
            <Music size={20} />
          </div>
          <div className="cc-now-playing-info">
            <span className="cc-now-playing-title">Not Playing</span>
            <span className="cc-now-playing-artist">Music</span>
          </div>
          <ChevronRight size={16} className="cc-now-playing-chevron" />
        </div>
      </div>
    </div>
  );
};

export default ControlCenter;
