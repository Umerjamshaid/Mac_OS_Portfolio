import useWindowStore from "#store/window";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/all";
import { useLayoutEffect, useRef } from "react";

const WindowWrapper = (Component, windowKey) => {
  const Wrapped = (props) => {
    const { focusWindow, windows } = useWindowStore();
    const { isOpen, zIndex, isMinimized, isFullscreen } = windows[windowKey];

    const ref           = useRef(null);
    const isFirstRender = useRef(true);
    const closingTween  = useRef(null);
    const draggableRef  = useRef(null);
    const prevIsOpen    = useRef(false);
    const prevIsMin     = useRef(false);

    useGSAP(() => {
      const el = ref.current;
      if (!el) return;
      const [instance] = Draggable.create(el, {
        onPress: () => focusWindow(windowKey),
      });
      draggableRef.current = instance;
      return () => instance.kill();
    }, []);

    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;

      if (isFirstRender.current) {
        isFirstRender.current = false;
        el.style.display = "none";
        prevIsOpen.current = false;
        prevIsMin.current  = false;
        return;
      }

      const wasOpen = prevIsOpen.current;
      const wasMin  = prevIsMin.current;
      prevIsOpen.current = isOpen;
      prevIsMin.current  = isMinimized;

      if (closingTween.current) {
        closingTween.current.kill();
        closingTween.current = null;
      }

      // ── Opening: closed → open ──
      if (!wasOpen && isOpen && !isMinimized) {
        el.style.display = "block";
        gsap.fromTo(
          el,
          { scale: 0.55, opacity: 0, y: 48, filter: "blur(4px)" },
          {
            scale: 1, opacity: 1, y: 0, filter: "blur(0px)",
            duration: 0.48, ease: "back.out(1.6)",
            clearProps: "filter",
          },
        );
        return;
      }

      // ── Closing: open → closed ──
      if (wasOpen && !wasMin && !isOpen) {
        closingTween.current = gsap.to(el, {
          scale: 0.72, opacity: 0, y: 14, filter: "blur(3px)",
          duration: 0.22, ease: "power3.in",
          onComplete: () => {
            el.style.display = "none";
            // Clear only what we animated — never clearProps:"all" here
            gsap.set(el, { clearProps: "scale,opacity,y,filter" });
            closingTween.current = null;
          },
        });
        return;
      }

      // ── Minimise: open → minimised ──
      // Fix: do NOT call clearProps:"all" in onComplete — it wipes display:none
      // Fix: do NOT animate x (would override Draggable's drag position)
      if (wasOpen && !wasMin && isOpen && isMinimized) {
        gsap.to(el, {
          scale: 0.08,
          opacity: 0,
          duration: 0.3,
          ease: "power3.in",
          onComplete: () => {
            el.style.display = "none";
            // Leave scale/opacity in place — fromTo on restore will override them
          },
        });
        return;
      }

      // ── Restore from minimise ──
      // fromTo explicitly sets start state, so stale scale/opacity from minimize don't matter
      // We do NOT animate y — window stays at its dragged position
      if (wasMin && isOpen && !isMinimized) {
        el.style.display = "block";
        gsap.fromTo(
          el,
          { scale: 0.08, opacity: 0 },
          { scale: 1,    opacity: 1, duration: 0.42, ease: "back.out(1.6)" },
        );
      }
    }, [isOpen, isMinimized]);

    // Fullscreen: enable/disable dragging
    useLayoutEffect(() => {
      if (!draggableRef.current) return;
      if (isFullscreen) draggableRef.current.disable();
      else              draggableRef.current.enable();
    }, [isFullscreen]);

    return (
      <section
        id={windowKey}
        ref={ref}
        style={{ zIndex }}
        className={`absolute${isFullscreen ? " window-fullscreen" : ""}`}
        onMouseDown={() => focusWindow(windowKey)}
      >
        <Component {...props} />
      </section>
    );
  };

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
};

export default WindowWrapper;
