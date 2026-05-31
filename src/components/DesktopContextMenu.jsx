import { useEffect, useRef, useState, useCallback } from "react";
import { WALLPAPERS } from "#constants";
import useDesktopStore from "#store/desktop";

const BLOCKED_SELECTORS = "section, nav, #dock, a, button, input, textarea, select";

const clampPosition = (x, y, menuWidth = 232, menuHeight = 300) => {
  const maxX = window.innerWidth - menuWidth - 8;
  const maxY = window.innerHeight - menuHeight - 8;
  return {
    x: Math.max(8, Math.min(x, maxX)),
    y: Math.max(8, Math.min(y, maxY)),
  };
};

const DesktopContextMenu = () => {
  const { activeWallpaperId, setWallpaper, nextWallpaper, prevWallpaper } = useDesktopStore();
  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0 });
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const menuRef = useRef(null);

  const closeMenu = useCallback(() => {
    setMenu((prev) => ({ ...prev, visible: false }));
    setSubmenuOpen(false);
  }, []);

  useEffect(() => {
    const handleContextMenu = (e) => {
      const blocked = e.target.closest(BLOCKED_SELECTORS);
      if (blocked) return;

      e.preventDefault();
      const { x, y } = clampPosition(e.clientX, e.clientY);
      setMenu({ visible: true, x, y });
      setSubmenuOpen(false);
    };

    window.addEventListener("contextmenu", handleContextMenu);
    return () => window.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  useEffect(() => {
    if (!menu.visible) return;

    const handleClick = (e) => {
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      closeMenu();
    };

    const handleKey = (e) => {
      if (e.key === "Escape") closeMenu();
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [menu.visible, closeMenu]);

  if (!menu.visible) return null;

  const activeWallpaper = WALLPAPERS.find((w) => w.id === activeWallpaperId);

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ left: menu.x, top: menu.y }}
    >
      <div className="context-menu-label">Desktop</div>
      <div className="context-menu-separator" />

      <button
        className="context-menu-item"
        onClick={() => { nextWallpaper(); closeMenu(); }}
      >
        <span className="context-menu-icon">→</span>
        Next Wallpaper
      </button>

      <button
        className="context-menu-item"
        onClick={() => { prevWallpaper(); closeMenu(); }}
      >
        <span className="context-menu-icon">←</span>
        Previous Wallpaper
      </button>

      <div className="context-menu-separator" />

      <div
        className="context-menu-item context-menu-submenu-trigger"
        onMouseEnter={() => setSubmenuOpen(true)}
        onMouseLeave={() => setSubmenuOpen(false)}
      >
        <span className="context-menu-icon">🖼</span>
        Choose Wallpaper
        <span className="context-menu-arrow">›</span>

        {submenuOpen && (
          <div className="context-submenu">
            {WALLPAPERS.map((wp) => (
              <button
                key={wp.id}
                className={`context-menu-item context-submenu-item ${wp.id === activeWallpaperId ? "context-menu-item-active" : ""}`}
                onClick={() => { setWallpaper(wp.id); closeMenu(); }}
              >
                <span className="context-menu-icon">
                  {wp.type === "video" ? "🎬" : wp.type === "gif" ? "✨" : "🏔"}
                </span>
                {wp.label}
                {wp.id === activeWallpaperId && (
                  <span className="context-menu-checkmark">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="context-menu-separator" />

      <div className="context-menu-label context-menu-wallpaper-info">
        {activeWallpaper?.label}
      </div>

      <div className="context-menu-separator" />

      <button
        className="context-menu-item"
        onClick={() => { window.location.reload(); }}
      >
        <span className="context-menu-icon">↺</span>
        Refresh Desktop
      </button>

      <button
        className="context-menu-item"
        onClick={closeMenu}
      >
        <span className="context-menu-icon">✕</span>
        Close Menu
      </button>
    </div>
  );
};

export default DesktopContextMenu;
