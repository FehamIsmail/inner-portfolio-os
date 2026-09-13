"use client";

import { useSyncExternalStore } from "react";

export const DESKTOP_TASKBAR_HEIGHT = 40;
export const MOBILE_TASKBAR_HEIGHT = 48;
/** Matches Tailwind `lg` — same breakpoint as portfolio mobile chrome. */
export const MOBILE_BREAKPOINT = 1024;

interface ViewportState {
  width: number;
  height: number;
  isMobile: boolean;
}

const SSR_VIEWPORT: ViewportState = {
  width: 0,
  height: 0,
  isMobile: false,
};

const listeners = new Set<() => void>();
let current: ViewportState = SSR_VIEWPORT;
let bound = false;
let frame = 0;

const readViewportSize = () => {
  const cssWidth = document.documentElement?.clientWidth ?? 0;
  const cssHeight = document.documentElement?.clientHeight ?? 0;
  const width = cssWidth || window.innerWidth;
  const height = cssHeight || window.innerHeight;
  return { width, height };
};

const getIsMobile = (width: number, height: number) => {
  if (!width) return false;
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
  };
};

/**
 * While the layout is mobile, CSS owns sizing (dvh / safe-area). Ignore
 * iOS URL-bar height jitter so React does not re-render the OS shell.
 */
const shouldPublish = (next: ViewportState) => {
  if (current.isMobile !== next.isMobile) return true;
  if (current.width !== next.width) return true;
  // Ignore iOS URL-bar height jitter while remaining mobile.
  if (current.isMobile && next.isMobile) return false;
  return current.height !== next.height;
};

const publish = () => {
  const next = readViewport();
  if (!shouldPublish(next)) return;
  current = next;
  listeners.forEach((listener) => listener());
};

const schedulePublish = () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(publish);
};

const bindListeners = () => {
  if (bound || typeof window === "undefined") return;
  bound = true;
  current = readViewport();

  window.addEventListener("resize", schedulePublish, { passive: true });
  window.addEventListener("orientationchange", schedulePublish, {
    passive: true,
  });

  const mediaQuery = window.matchMedia(
    `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
  );
  const pointerQuery = window.matchMedia("(pointer: coarse)");
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", schedulePublish);
    pointerQuery.addEventListener("change", schedulePublish);
  } else {
    mediaQuery.addListener(schedulePublish);
    pointerQuery.addListener(schedulePublish);
  }
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  const snapshot = current;
  bindListeners();
  if (snapshot !== current) listener();
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => current;
const getServerSnapshot = () => SSR_VIEWPORT;

export const useViewport = (): ViewportState =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export const useIsMobile = (): boolean =>
  useSyncExternalStore(
    subscribe,
    () => getSnapshot().isMobile,
    () => false,
  );
