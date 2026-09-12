"use client";

import React, { createContext, useContext } from "react";

/** Same thresholds as Tailwind, but measured against portfolio content width. */
export const PORTFOLIO_BPS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export type PortfolioBreakpoints = {
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
};

export const PORTFOLIO_WIDE_BREAKPOINT = 768;
/** Min OS-window width to keep the full docked left sidebar on desktop. */
export const SIDEBAR_DOCK_MIN_WIDTH = 920;

export const getPortfolioBreakpoints = (
  contentWidth: number,
): PortfolioBreakpoints => ({
  sm: contentWidth >= PORTFOLIO_BPS.sm,
  md: contentWidth >= PORTFOLIO_BPS.md,
  lg: contentWidth >= PORTFOLIO_BPS.lg,
  xl: contentWidth >= PORTFOLIO_BPS.xl,
});

interface PortfolioWindowContextValue {
  /** Full portfolio OS window width (includes side nav when visible). */
  width: number;
  /** Scrollable content pane width — use this for in-page layout. */
  contentWidth: number;
  /** True when the portfolio OS window is at least 768px wide. */
  isWide: boolean;
  /**
   * Desktop framed layout (right gutter + side borders).
   * Requires a wide window AND a desktop viewport — mobile/tablet
   * viewports stay edge-to-edge even when the fullscreen window is ≥768px.
   */
  showDesktopFrame: boolean;
  /** Mobile/tablet viewport — top floater hamburger chrome. */
  useMobileNav: boolean;
  /** Desktop viewport with enough window width for the full docked sidebar. */
  dockSidebar: boolean;
  /**
   * Breakpoints from content pane width (not browser viewport).
   * Prefer these over Tailwind `sm`/`md`/`lg` for portfolio page layout.
   */
  bp: PortfolioBreakpoints;
}

const defaultBp = getPortfolioBreakpoints(0);

const PortfolioWindowContext = createContext<PortfolioWindowContextValue>({
  width: 0,
  contentWidth: 0,
  isWide: false,
  showDesktopFrame: false,
  useMobileNav: false,
  dockSidebar: true,
  bp: defaultBp,
});

export const PortfolioWindowProvider = PortfolioWindowContext.Provider;

export const usePortfolioWindow = () => useContext(PortfolioWindowContext);
