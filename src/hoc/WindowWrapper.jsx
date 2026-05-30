import useWindowStore from "#store/window";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/all";
import { useLayoutEffect, useRef } from "react";

const WindowWrapper = (Component, windowKey) => {
  const Wrapped = (props) => {
    const { focusWindow, windows } = useWindowStore();
    const { isOpen, zIndex } = windows[windowKey];
    const ref = useRef(null);
    const isFirstRender = useRef(true);
    const closingTween = useRef(null);

    useGSAP(() => {
      const el = ref.current;
      if (!el) return;
      const [instance] = Draggable.create(el, {
        onPress: () => focusWindow(windowKey),
      });
      return () => instance.kill();
    }, []);

    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;

      if (isFirstRender.current) {
        isFirstRender.current = false;
        el.style.display = "none";
        el.style.opacity = "0";
        return;
      }

      if (closingTween.current) {
        closingTween.current.kill();
        closingTween.current = null;
      }

      if (isOpen) {
        el.style.display = "block";
        gsap.fromTo(
          el,
          { scale: 0.55, opacity: 0, y: 48, filter: "blur(4px)" },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.48,
            ease: "back.out(1.6)",
            clearProps: "filter",
          },
        );
      } else {
        closingTween.current = gsap.to(el, {
          scale: 0.72,
          opacity: 0,
          y: 14,
          filter: "blur(3px)",
          duration: 0.22,
          ease: "power3.in",
          onComplete: () => {
            el.style.display = "none";
            gsap.set(el, { clearProps: "filter,scale,opacity,y" });
            closingTween.current = null;
          },
        });
      }
    }, [isOpen]);

    return (
      <section
        id={windowKey}
        ref={ref}
        style={{ zIndex }}
        className="absolute"
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
