import { dockApps } from "#constants";
import { useRef, useCallback } from "react";
import { Tooltip } from "react-tooltip";
import React from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import useWindowStore from "#store/window";

export const Dock = () => {
  const { openWindow, closeWindow, windows } = useWindowStore();
  const dockRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // macOS-like magnification: scale and translate based on distance to cursor
  const updateDockMagnification = useCallback((mouseX: number) => {
    const dock = dockRef.current;
    if (!dock) return;

    const dockRect = dock.getBoundingClientRect();
    const relativeMouseX = mouseX - dockRect.left;

    iconsRef.current.forEach((icon, index) => {
      if (!icon) return;

      const iconRect = icon.getBoundingClientRect();
      const iconCenter = (iconRect.left + iconRect.right) / 2 - dockRect.left;
      const distance = Math.abs(relativeMouseX - iconCenter);
      const maxDistance = 150; // influence radius
      const intensity = Math.max(0, 1 - distance / maxDistance);
      // macOS-like curve: ease out cubic
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

    const handleMouseMove = (e: MouseEvent) => {
      updateDockMagnification(e.clientX);
    };

    const handleMouseLeave = () => {
      resetIcons();
    };

    dock.addEventListener("mousemove", handleMouseMove);
    dock.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      dock.removeEventListener("mousemove", handleMouseMove);
      dock.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [updateDockMagnification, resetIcons]);

  const toggleApp = (app: { id: string; canOpen: boolean }) => {
    if (!app.canOpen) return;

    const window = windows[app.id];
    if (!window) {
      console.error(`App with id ${app.id} not found in windows store.`);
      return;
    }

    if (window.isOpen) {
      closeWindow(app.id);
    } else {
      openWindow(app.id);
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
              onClick={() => toggleApp({ id, canOpen })}
            >
              <img
                src={`${import.meta.env.BASE_URL}images/${icon}`}
                alt={name}
                loading="lazy"
                className={canOpen ? "" : "grayscale opacity-50"}
              />
            </button>
            {/* Optional: add a small indicator for open apps (like a dot) */}
            {windows[id]?.isOpen && <div className="open-indicator" />}
          </div>
        ))}
        <Tooltip id="dock-tooltip" place="top" className="tooltip" />
      </div>
    </section>
  );
};

export default Dock;