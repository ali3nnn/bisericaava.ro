"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Reveals elements marked with [data-reveal] / [data-reveal-children]
 * as they scroll into view. Re-scans on route change and shortly after
 * (to catch content rendered once data.json loads). Respects
 * prefers-reduced-motion and degrades gracefully without IO support.
 */
export const ScrollReveal = () => {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supported = "IntersectionObserver" in window;

    if (reduced || !supported) {
      document
        .querySelectorAll("[data-reveal], [data-reveal-children]")
        .forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const scan = () =>
      document
        .querySelectorAll("[data-reveal]:not(.is-visible), [data-reveal-children]:not(.is-visible)")
        .forEach((el) => io.observe(el));

    scan();
    const t = setTimeout(scan, 120); // catch async-rendered content

    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, [pathname]);

  return null;
};
