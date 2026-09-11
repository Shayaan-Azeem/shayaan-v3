"use client";

import { RoughNotation } from "react-rough-notation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import useReducedMotion from "./useReducedMotion";

export default function AnnotationHighlight({
  children,
  color = "#ff4d4d",
  delay = 800,
}: {
  children: ReactNode;
  color?: string;
  delay?: number;
}) {
  const [show, setShow] = useState(false);
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const element = containerRef.current;

    if (!element || typeof IntersectionObserver === "undefined") {
      timeout = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(timeout);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          timeout = setTimeout(() => setShow(true), delay);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [delay]);

  return (
    <span ref={containerRef}>
      <RoughNotation
        type="circle"
        show={show}
        color={color}
        strokeWidth={1.5}
        padding={[2, 6]}
        animationDuration={800}
        animate={!reducedMotion}
      >
        {children}
      </RoughNotation>
    </span>
  );
}
