import { dockApps } from "#constants";
import { useRef, useCallback } from "react";
import { Tooltip } from "react-tooltip";
import React from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import useWindowStore from "#store/window";

export const Dock = () => {
  const { openWindow, closeWindow, windows } = useWindowStore();
  const dockRef = useRef(null);
  const iconsRef = useRef([]);

  const updateDockMagnification = useCallback((mouseX) => {
    const dock = dockRef.current;
    if (!dock) return;

    const dockRect = dock.getBoundingClientRect();
    const relativeMouseX = mouseX - dockRect.left;

    iconsRef.current.forEach((icon) => {
      if (!icon) return;
      const iconRect = icon.getBoundingClientRect();
      const iconCenter = (iconRect.left + iconRect.right) / 2 - dockRect.left;
      const distance = Math.abs(relativeMouseX - iconCenter);
      const maxDistance = 150;
      const intensity = Math.max(0, 1 - distance / maxDistance);
      const scale = 1 + 0.35 * Math.pow(intensity, 1.5);
      const yOffset = -12 * intensity;

      gsap.to(icon, {
        duration: 0.25,
        ease: "power2.out",
        scale: scale,
        y: yOffset,
        overwrite: true,
      });
    });
  }, []);

  const resetIcons = useCallback(() => {
    iconsRef.current.forEach((icon) => {
      if (icon) {
        gsap.to(icon, {
          duration: 0.25,
          scale: 1,
          y: 0,
          ease: "power2.out",
          overwrite: true,
        });
      }
    });
  }, []);

  useGSAP(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const handleMouseMove = (e) => updateDockMagnification(e.clientX);
    const handleMouseLeave = () => resetIcons();

    dock.addEventListener("mousemove", handleMouseMove);
    dock.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      dock.removeEventListener("mousemove", handleMouseMove);
      dock.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [updateDockMagnification, resetIcons]);

  const bounceDockIcon = useCallback((index) => {
    const icon = iconsRef.current[index];
    if (!icon) return;
    gsap.killTweensOf(icon);
    gsap.timeline()
      .to(icon, { y: -22, duration: 0.16, ease: "power2.out" })
      .to(icon, { y: 0,   duration: 0.14, ease: "power2.in"  })
      .to(icon, { y: -10, duration: 0.11, ease: "power2.out" })
      .to(icon, { y: 0,   duration: 0.10, ease: "power2.in"  })
      .to(icon, { y: -4,  duration: 0.08, ease: "power2.out" })
      .to(icon, { y: 0,   duration: 0.08, ease: "power2.in"  });
  }, []);

  const toggleApp = (app, index) => {
    if (!app.canOpen) return;

    const win = windows[app.id];
    if (!win) {
      console.error(`App with id ${app.id} not found in windows store.`);
      return;
    }

    if (win.isOpen) {
      closeWindow(app.id);
    } else {
      openWindow(app.id);
      bounceDockIcon(index);
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
              onClick={() => toggleApp({ id, canOpen }, index)}
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
