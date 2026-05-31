import { useState, useEffect, useRef } from "react"
import dayjs from "dayjs"
import { navIcons, navLinks, WALLPAPERS } from "#constants"
import useWindowStore from "#store/window"
import useDesktopStore from "#store/desktop"
import WifiPopup from "./WifiPopup"

const ICON_LABELS = {
  1: "Wi-Fi",
  2: "Spotlight",
  3: "Profile",
  4: "Appearance",
};

const navbar = () => {
  const { openWindow } = useWindowStore();
  const { toggleSpotlight, activeWallpaperId, setWallpaper } = useDesktopStore();
  const [time, setTime]       = useState(dayjs());
  const [wifiOpen, setWifiOpen] = useState(false);
  const [tooltip, setTooltip]  = useState(null); // { id, label }
  const tooltipTimer = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setTime(dayjs()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleIconClick = (id) => {
    if (id === 1) { setWifiOpen((v) => !v); return; }
    if (id === 2) { toggleSpotlight(); return; }
    if (id === 3) { openWindow("settings"); return; }
    if (id === 4) {
      // Toggle dark / light appearance — switch between light (id 1) and dark (id 2)
      const lightIds = [1, 5];
      const isDark = !lightIds.includes(activeWallpaperId);
      setWallpaper(isDark ? 1 : 2);
    }
  };

  const showTooltip = (id) => {
    clearTimeout(tooltipTimer.current);
    tooltipTimer.current = setTimeout(() => setTooltip(id), 500);
  };

  const hideTooltip = () => {
    clearTimeout(tooltipTimer.current);
    setTooltip(null);
  };

  return (
    <>
      <nav>
        <div>
          <img src={`${import.meta.env.BASE_URL}images/logo.svg`} alt="logo" />
          <p className="font-bold">Umer's Portfolio</p>

          <ul>
            {navLinks.map(({ id, name, type }) => (
              <li key={id} onClick={() => openWindow(type)}>
                <p>{name}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ul>
            {navIcons.map(({ id, img }) => (
              <li
                key={id}
                className="relative cursor-pointer"
                onClick={() => handleIconClick(id)}
                onMouseEnter={() => showTooltip(id)}
                onMouseLeave={hideTooltip}
              >
                <img
                  src={img}
                  className={`icon transition-opacity${id === 1 && wifiOpen ? " opacity-50" : ""}`}
                  alt={ICON_LABELS[id] || `icon-${id}`}
                />
                {/* macOS-style tooltip */}
                {tooltip === id && (
                  <span className="navbar-tooltip">{ICON_LABELS[id]}</span>
                )}
              </li>
            ))}
          </ul>

          <time>{time.format("ddd MMM D h:mm:ss A")}</time>
        </div>
      </nav>

      {wifiOpen && <WifiPopup onClose={() => setWifiOpen(false)} />}
    </>
  )
}

export default navbar
