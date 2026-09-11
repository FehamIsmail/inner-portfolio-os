"use client";

import { useLayoutEffect, useState } from "react";

export const DESKTOP_TASKBAR_HEIGHT = 40;
export const MOBILE_TASKBAR_HEIGHT = 48;
/** Matches Tailwind `lg` — same breakpoint as portfolio mobile chrome. */
export const MOBILE_BREAKPOINT = 1024;

interface ViewportState {
  width: number;
  height: number;
  isMobile: boolean;
  safeAreaBottom: number;
}

const readSafeAreaBottom = () => {
  if (typeof document === "undefined" || !document.body) return 0;
  const safeAreaProbe = document.createElement("div");
  safeAreaProbe.style.cssText =
    "position:fixed;visibility:hidden;pointer-events:none;height:0;padding-bottom:env(safe-area-inset-bottom)";
  document.body.appendChild(safeAreaProbe);
  const safeAreaBottom =
    Number.parseFloat(getComputedStyle(safeAreaProbe).paddingBottom) || 0;
  safeAreaProbe.remove();
  return safeAreaBottom;
};

/**
 * Prefer the CSS layout viewport (`clientWidth`) so detection matches
 * Tailwind/`matchMedia` — `window.innerWidth` can disagree under browser
 * device emulation and some mobile browsers.
 */
const readViewportSize = () => {
  const cssWidth = document.documentElement?.clientWidth ?? 0;
  const cssHeight = document.documentElement?.clientHeight ?? 0;
  const width = cssWidth || window.innerWidth;
  const height = cssHeight || window.innerHeight;
  return { width, height };
};

const getIsMobile = (width: number, height: number) => {
  if (width < MOBILE_BREAKPOINT) return true;
  if (height <= 500 && window.matchMedia("(pointer: coarse)").matches) {
    return true;
  }
  return false;
};

const readViewport = (): ViewportState => {
  const { width, height } = readViewportSize();
  return {
    width,
    height,
    isMobile: getIsMobile(width, height),
    safeAreaBottom: readSafeAreaBottom(),
  };
};

export const useViewport = (): ViewportState => {
  const [viewport, setViewport] = useState<ViewportState>(() => {
    if (typeof window === "undefined") {
      return {
        width: 0,
        height: 0,
        isMobile: false,
        safeAreaBottom: 0,
      };
    }

    const { width, height } = readViewportSize();
    return {
      width,
      height,
      isMobile: getIsMobile(width, height),
      safeAreaBottom: 0,
    };
  });

  useLayoutEffect(() => {
    let frame = 0;

    const updateViewport = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = readViewport();
        setViewport((prev) => {
          if (
            prev.width === next.width &&
            prev.height === next.height &&
            prev.isMobile === next.isMobile &&
            prev.safeAreaBottom === next.safeAreaBottom
          ) {
            return prev;
          }
          return next;
        });
      });
    };

    updateViewport();

    const resizeObserver = new ResizeObserver(updateViewport);
    resizeObserver.observe(document.documentElement);
    if (document.body) resizeObserver.observe(document.body);

    window.addEventListener("resize", updateViewport);
    window.addEventListener("orientationchange", updateViewport);
    window.visualViewport?.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("scroll", updateViewport);

    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
    );
    const pointerQuery = window.matchMedia("(pointer: coarse)");
    // Safari < 14
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updateViewport);
      pointerQuery.addEventListener("change", updateViewport);
    } else {
      mediaQuery.addListener(updateViewport);
      pointerQuery.addListener(updateViewport);
    }

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("scroll", updateViewport);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", updateViewport);
        pointerQuery.removeEventListener("change", updateViewport);
      } else {
        mediaQuery.removeListener(updateViewport);
        pointerQuery.removeListener(updateViewport);
      }
    };
  }, []);

  return viewport;
};
