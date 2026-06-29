"use client";

import { useEffect } from "react";

// Smooth-scrolls in-page anchor links (a[href*="#"]). Replaces the
// module-scope `new SmoothScroll(...)` that used to live in App.jsx — that ran
// at import time and touches the DOM, so it can't run during SSR.
export const SmoothScroll = () => {
  useEffect(() => {
    let instance;
    let cancelled = false;
    import("smooth-scroll").then((mod) => {
      if (cancelled) return;
      const SmoothScrollLib = mod.default || mod;
      instance = new SmoothScrollLib('a[href*="#"]', {
        speed: 1000,
        speedAsDuration: true,
      });
    });
    return () => {
      cancelled = true;
      if (instance && instance.destroy) instance.destroy();
    };
  }, []);

  return null;
};
