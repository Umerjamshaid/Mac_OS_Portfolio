import { dockApps } from "#constants";
import { useRef, useCallback } from "react";
import { Tooltip } from "react-tooltip";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import useWindowStore from "#store/window";

export const Dock = () => {
  const { openWindow, restoreWindow, focusWindow, windows } = useWindowStore();
  const dockRef     = useRef(null);
  const iconsRef    = useRef([]);
  const centersRef  = useRef([]); // cached icon centers, relative to dock left
  const rafRef      = useRef(null);
  const pendingXRef = useRef(null);

  // Measure icon centers once (on mount / resize), instead of on every mousemove
  const measureCenters = useCallback(() => {
    const dock = dockRef.current;
    if (!dock) return;
    const dockRect = dock.getBoundingClientRect();
    centersRef.current = iconsRef.current.map((icon) => {
      if (!icon) return 0;
      const r = icon.getBoundingClientRect();
      return (r.left + r.right) / 2 - dockRect.left;
    });
  }, []);

  useGSAP(() => {
    measureCenters();
    window.addEventListener("resize", measureCenters, { passive: true });
    return () => window.removeEventListener("resize", measureCenters);
  }, [measureCenters]);

  const applyMagnification = useCallback((mouseX) => {
    const dock = dockRef.current;
    if (!dock) return;
    const dockRect = dock.getBoundingClientRect();
    const relX = mouseX - dockRect.left;

    iconsRef.current.forEach((icon, i) => {
      if (!icon) return;
      const iconCenter = centersRef.current[i] ?? 0;
      const distance   = Math.abs(relX - iconCenter);
      const intensity  = Math.max(0, 1 - distance / 150);
      const scale      = 1 + 0.35 * Math.pow(intensity, 1.5);
      const yOffset    = -12 * intensity;

      gsap.to(icon, { duration: 0.25, ease: "power2.out", scale, y: yOffset, overwrite: true });
    });
  }, []);

  // Throttle mousemove work to once per animation frame to avoid layout thrash
  const updateMagnification = useCallback((mouseX) => {
    pendingXRef.current = mouseX;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (pendingXRef.current != null) applyMagnification(pendingXRef.current);
    });
  }, [applyMagnification]);

  const resetIcons = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    pendingXRef.current = null;
    iconsRef.current.forEach((icon) => {
      if (icon) gsap.to(icon, { duration: 0.25, scale: 1, y: 0, ease: "power2.out", overwrite: true });
    });
  }, []);

  useGSAP(() => {
    const dock = dockRef.current;
    if (!dock) return;
    const onMove  = (e) => updateMagnification(e.clientX);
    const onLeave = () => resetIcons();
    dock.addEventListener("mousemove", onMove, { passive: true });
    dock.addEventListener("mouseleave", onLeave);
    return () => {
      dock.removeEventListener("mousemove", onMove);
      dock.removeEventListener("mouseleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateMagnification, resetIcons]);

  const bounceDockIcon = useCallback((index) => {
    const icon = iconsRef.current[index];
    if (!icon) return;
    gsap.killTweensOf(icon);
    gsap.timeline()
      .to(icon, { y: -22, duration: 0.16, ease: "power2.out" })
      .to(icon, { y:   0, duration: 0.14, ease: "power2.in"  })
      .to(icon, { y: -10, duration: 0.11, ease: "power2.out" })
      .to(icon, { y:   0, duration: 0.10, ease: "power2.in"  })
      .to(icon, { y:  -4, duration: 0.08, ease: "power2.out" })
      .to(icon, { y:   0, duration: 0.08, ease: "power2.in"  });
  }, []);

  const handleClick = (app, index) => {
    if (!app.canOpen) return;
    const win = windows[app.id];
    if (!win) return;

    if (!win.isOpen) {
      openWindow(app.id);
      bounceDockIcon(index);
    } else if (win.isMinimized) {
      restoreWindow(app.id);
      bounceDockIcon(index);
    } else {
      focusWindow(app.id);
    }
  };

  return (
    <section id="dock">
      <div ref={dockRef} className="dock-container">
        {dockApps.map(({ id, name, icon, canOpen }, index) => (
          <div key={id} className="dock-item-wrapper">
            <button
              ref={(el) => (iconsRef.current[index] = el)}
              type="button"
              className="dock-icon"
              aria-label={name}
              data-tooltip-id="dock-tooltip"
              data-tooltip-content={name}
              data-tooltip-delay-show={150}
              disabled={!canOpen}
              onClick={() => handleClick({ id, canOpen }, index)}
            >
              <img
                src={`${import.meta.env.BASE_URL}images/${icon}`}
                alt={name}
                loading="lazy"
                className={canOpen ? "" : "grayscale opacity-50"}
              />
            </button>
            {windows[id]?.isOpen && <div className="open-indicator" />}
          </div>
        ))}
        <Tooltip id="dock-tooltip" place="top" className="tooltip" />
      </div>
    </section>
  );
};

export default Dock;
