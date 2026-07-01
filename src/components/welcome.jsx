import React, { useRef } from "react";
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
    let containerLeft = 0;
    let pendingX = 0;
    let rafId = null;

    const animateLetter = (letter, weight, duration = 0.25) => {
        return gsap.to(letter, {
            duration,
            ease: "power2.out",
            fontVariationSettings: `'wght' ${weight}`,
        });
    };

    const measure = () => {
        containerLeft = Container.getBoundingClientRect().left;
    };

    const applyHover = () => {
        rafId = null;

        letters.forEach((letter) => {
            const { left: l, width: w } = letter.getBoundingClientRect();
            const distance = Math.abs(pendingX - (l - containerLeft + w / 2));
            const intensity = Math.exp(-(distance ** 2) / 20000);
            animateLetter(letter, min + (max - min) * intensity);
        });
    };

    const handleMouseMove = (e) => {
        pendingX = e.clientX - containerLeft;
        if (rafId === null) {
            rafId = requestAnimationFrame(applyHover);
        }
    };

    const handleMouseLeave = () => {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        letters.forEach((letter) => animateLetter(letter, base, 0.3));
    };

    const handleResize = () => {
        measure();
    };

    measure();
    Container.addEventListener("mousemove", handleMouseMove, { passive: true });
    Container.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
        }
        Container.removeEventListener("mousemove", handleMouseMove);
        Container.removeEventListener("mouseleave", handleMouseLeave);
        window.removeEventListener("resize", handleResize);
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
