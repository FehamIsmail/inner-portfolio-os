"use client";

import React from "react";
import { usePortfolioWindow } from "@/components/portfolio/PortfolioWindowContext";

interface PortfolioContentProps {
  title: string;
  children: React.ReactNode;
}

const PortfolioContent = (props: PortfolioContentProps) => {
  const { children, title } = props;
  const { showDesktopFrame, bp } = usePortfolioWindow();

  const padClass = bp.lg ? "p-[48px]" : bp.sm ? "p-6" : "p-4";
  const bodyTextClass = bp.lg
    ? "text-2xl"
    : bp.sm
      ? "text-[20px]"
      : "text-[1.125rem]";

  // Desktop nav (docked or rail) already draws the left seam — don't add a
  // second border-l on the content card.
  const borderClass = showDesktopFrame
    ? "mr-[100px] border-l-0 border-r-3 border-retro-dark"
    : "mr-0 border-x-0";

  return (
    <div
      className={`flex flex-col min-h-full min-w-0 ${
        showDesktopFrame ? "bg-retro-medium" : "bg-retro-white"
      }`}
    >
      <div
        className={`flex-grow min-w-0 ${padClass} h-full bg-retro-white select-text ${borderClass}`}
      >
        <h1
          className={`${bp.lg ? "-ml-[3px] -mb-12" : "mb-2"} break-words`}
        >
          {title}
        </h1>
        <div
          className={`font-pixolde font-extrabold ${bodyTextClass} min-w-0 [&_p]:text-[length:inherit] [&_li]:text-[length:inherit] [&_a]:text-[length:inherit]`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default PortfolioContent;
