import { Container, Weight } from "lucide-react";
import React, { use, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const renderText = (text, className, baseWeight = 400) => {
    return [...text].map((char, i) => (
        <span
            key={i}
            className={className}
            style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
        >
            {char === " " ? "\u00A0" : char}
        </span>
    ));
};

const FONT_WEIGHTS = {
    subtitle: { min: 100, max: 300, default: 100 },
    title: { min: 400, max: 900, default: 400 },
};

const setupTextHover = (Container, type) => {
    if (!Container) return () => {};

    const letters = Container.querySelectorAll("span");
    const { min, max, default: base } = FONT_WEIGHTS[type];

    const animateLetter = (letter, weight, duration = 0.25) => {
        return gsap.to(letter, {
            duration,
            ease: "power2.out",
            fontVariationSettings: `'wght' ${weight}`,
        });
    };

    // Cache letter centers once instead of re-measuring layout on every mousemove
    let letterCenters = [];
    const measure = () => {
        const { left } = Container.getBoundingClientRect();
        letterCenters = Array.from(letters).map((letter) => {
            const { left: l, width: w } = letter.getBoundingClientRect();
            return l - left + w / 2;
        });
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });

    // Throttle to one update per animation frame to avoid animation floods
    let rafId = null;
    let pendingX = null;

    const apply = () => {
        rafId = null;
        if (pendingX == null) return;
        const mouseX = pendingX;
        letters.forEach((letter, i) => {
            const distance = Math.abs(mouseX - letterCenters[i]);
            const intensity = Math.exp(-(distance ** 2) / 20000);
            animateLetter(letter, min + (max - min) * intensity);
        });
    };

    const handleMouseMove = (e) => {
        const { left } = Container.getBoundingClientRect();
        pendingX = e.clientX - left;
        if (rafId == null) rafId = requestAnimationFrame(apply);
    };
    const handleMouseLeave = () => {
        if (rafId != null) { cancelAnimationFrame(rafId); rafId = null; }
        pendingX = null;
        letters.forEach((letter) => animateLetter(letter, base, 0.3));
    };

    Container.addEventListener("mousemove", handleMouseMove, { passive: true });
    Container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
        window.removeEventListener("resize", measure);
        if (rafId != null) cancelAnimationFrame(rafId);
        Container.removeEventListener("mousemove", handleMouseMove);
        Container.removeEventListener("mouseleave", handleMouseLeave);
    };
};

export const Welcome = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useGSAP(() => {
        const cleanupTitle = setupTextHover(titleRef.current, "title");
        const cleanupSubtitle = setupTextHover(subtitleRef.current, "subtitle");

        return () => {
            cleanupTitle?.();
            cleanupSubtitle?.();
        };
    }, []);

    return (
        <section id="welcome">
            <p ref={subtitleRef}>
                {renderText(
                    "Hey, I'm Umer-Jamshiad! Welcome to My",
                    "text-3xl font-georama",
                    100,
                )}
            </p>
            <h1 ref={titleRef} className="mt-7">
                {renderText("Portfolio", "text-9xl italic font-georama")}
            </h1>

            <div className="small-screen">
                <p>This Portfolio is designed for desktop/tablet screens only.</p>
            </div>
        </section>
    );
};
