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
            gsap.set(el, { clearProps: "all" });
            closingTween.current = null;
          },
        });
        return;
      }

      // ── Minimise: open → minimised ──
      if (wasOpen && !wasMin && isOpen && isMinimized) {
        const rect = el.getBoundingClientRect();
        const dockY = window.innerHeight - rect.top - rect.height * 0.5;
        gsap.to(el, {
          scale: 0.1, opacity: 0, y: dockY, x: 0,
          duration: 0.38, ease: "power3.in",
          onComplete: () => {
            el.style.display = "none";
            gsap.set(el, { clearProps: "all" });
          },
        });
        return;
      }

      // ── Restore from minimise ──
      if (wasMin && isOpen && !isMinimized) {
        el.style.display = "block";
        gsap.fromTo(
          el,
          { scale: 0.12, opacity: 0, y: 60 },
          { scale: 1, opacity: 1, y: 0, duration: 0.44, ease: "back.out(1.5)" },
        );
      }
    }, [isOpen, isMinimized]);

    // Fullscreen: toggle draggable
    useLayoutEffect(() => {
      if (!draggableRef.current) return;
      if (isFullscreen) {
        draggableRef.current.disable();
      } else {
        draggableRef.current.enable();
      }
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

  Wrapped.displayName = `WindowWrapper(${
    Component.displayName || Component.name || "Component"
  })`;
  return Wrapped;
};

export default WindowWrapper;
