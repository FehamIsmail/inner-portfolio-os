"use client";

import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import useResizeObserver from "@react-hook/resize-observer";
import SideNav from "@/components/portfolio/SideNav";
import {
  getPortfolioBreakpoints,
  PORTFOLIO_WIDE_BREAKPOINT,
  PortfolioWindowProvider,
  SIDEBAR_DOCK_MIN_WIDTH,
} from "@/components/portfolio/PortfolioWindowContext";
import { useIsMobile } from "@/hooks/useIsMobile";

interface MyPortfolioProps {
  children: React.ReactNode;
}

const MyPortfolio = forwardRef<HTMLDivElement, MyPortfolioProps>(
  (props, ref) => {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const isMobile = useIsMobile();
    const [windowWidth, setWindowWidth] = useState(0);
    const [contentWidth, setContentWidth] = useState(0);

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const contentRef = React.useRef<HTMLDivElement | null>(null);

    const attachRef = useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        setRefs(node);
        if (node) setWindowWidth(node.getBoundingClientRect().width);
      },
      [setRefs],
    );

    const attachContentRef = useCallback((node: HTMLDivElement | null) => {
      contentRef.current = node;
      if (node) setContentWidth(node.getBoundingClientRect().width);
    }, []);

    useResizeObserver(rootRef, (entry) => {
      const next = Math.round(entry.contentRect.width);
      setWindowWidth((prev) => (Math.abs(prev - next) < 8 ? prev : next));
    });

    useResizeObserver(contentRef, (entry) => {
      const next = Math.round(entry.contentRect.width);
      setContentWidth((prev) => (Math.abs(prev - next) < 8 ? prev : next));
    });

    const isWide = windowWidth >= PORTFOLIO_WIDE_BREAKPOINT;
    const showDesktopFrame = isWide && !isMobile;
    const useMobileNav = isMobile;
    // Unmeasured (0) defaults to docked to avoid a rail flash on open.
    const dockSidebar =
      !isMobile && (windowWidth === 0 || windowWidth >= SIDEBAR_DOCK_MIN_WIDTH);
    const bp = useMemo(
      () => getPortfolioBreakpoints(contentWidth),
      [contentWidth],
    );

    const portfolioValue = useMemo(
      () => ({
        width: windowWidth,
        contentWidth,
        isWide,
        showDesktopFrame,
        useMobileNav,
        dockSidebar,
        bp,
      }),
      [
        windowWidth,
        contentWidth,
        isWide,
        showDesktopFrame,
        useMobileNav,
        dockSidebar,
        bp,
      ],
    );

    return (
      <PortfolioWindowProvider value={portfolioValue}>
        <div
          className={`flex flex-1 min-w-0 min-h-0 relative text-retro-dark h-full font-bold ${
            isMobile ? "bg-retro-white" : "bg-retro-white bg-opacity-30"
          }`}
          ref={attachRef}
        >
          <div
            className={
              "flex flex-row portfolio-content-wrapper w-full h-full min-w-0 min-h-0 overflow-hidden"
            }
          >
            <SideNav />
            <div
              id={"portfolio-content"}
              ref={attachContentRef}
              className={`flex-1 min-w-0 min-h-0 h-full overflow-y-auto overflow-x-hidden [&>*]:min-h-full ${
                isHome
                  ? "pt-0"
                  : useMobileNav
                    ? "pt-[4.25rem] md:pt-24"
                    : "pt-0"
              }`}
            >
              {props.children}
            </div>
          </div>
        </div>
      </PortfolioWindowProvider>
    );
  },
);

MyPortfolio.displayName = "MyPortfolio";

export default MyPortfolio;
