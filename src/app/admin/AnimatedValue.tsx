"use client";

import { useEffect, useState, useRef } from "react";

export default function AnimatedValue({
  value,
  formatted,
}: {
  value: number;
  formatted: string;
}) {
  const [display, setDisplay] = useState("0");
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    const duration = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(eased * value);

      if (formatted.startsWith("₹")) {
        setDisplay(`₹${current.toLocaleString("en-IN")}`);
      } else {
        setDisplay(current.toLocaleString("en-IN"));
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setDisplay(formatted);
      }
    };

    requestAnimationFrame(tick);
  }, [visible, value, formatted]);

  return (
    <span ref={ref} className="tabular-nums inherit">
      {display}
    </span>
  );
}