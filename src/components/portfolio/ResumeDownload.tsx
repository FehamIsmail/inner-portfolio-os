"use client";

import React from "react";
import mailbox from "@/assets/images/mailbox.gif";
import download from "@/assets/images/down.png";
import Image from "next/image";
import { usePortfolioWindow } from "@/components/portfolio/PortfolioWindowContext";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ResumeDownloadProps {
  margin: number;
}

/** Smooth title size for desktop viewport (20px @ 600 → 34px @ 1200 content width). */
const desktopTitlePx = (contentWidth: number) => {
  if (contentWidth <= 0) return 34;
  const t = (contentWidth - 600) / 600;
  return Math.round(Math.min(34, Math.max(20, 20 + t * 14)));
};

const ResumeDownload = ({ margin }: ResumeDownloadProps) => {
  const { contentWidth, bp } = usePortfolioWindow();
  const isMobile = useIsMobile();
  // Bleed must match PortfolioContent's content-width padding, not viewport media queries.
  const bleedPx = bp.lg ? 48 : bp.sm ? 24 : 16;
  const titleStyle =
    !isMobile && contentWidth > 0
      ? { fontSize: `${desktopTitlePx(contentWidth)}px`, lineHeight: 1.1 }
      : undefined;

  return (
    <div
      className={"resume-download border-retro-dark border-y-2 mt-7"}
      style={
        {
          "--resume-margin": `${margin}px`,
          marginLeft: -bleedPx,
          marginRight: -bleedPx,
        } as React.CSSProperties
      }
    >
      <div
        className={`py-3.5 sm:py-2 flex flex-row items-center justify-center sm:justify-start ${
          bp.sm ? "px-12" : "px-3"
        }`}
      >
        <div className={"flex flex-row items-center gap-3 text-left min-w-0"}>
          <div className={"h-12 w-12 sm:h-20 sm:w-16 flex items-center justify-center shrink-0 overflow-visible"}>
            <Image
              src={mailbox.src}
              className={"mb-0 sm:mb-2 w-auto max-w-none scale-[1.75] sm:scale-100 origin-center"}
              style={{ imageRendering: "pixelated" }}
              width={100}
              height={100}
              alt={"mailbox"}
            />
          </div>
          <div className={"flex min-w-0 flex-col gap-1 items-start text-left"}>
            <h4
              className={
                "mt-0 mb-0 text-left font-bold leading-[1.1] text-[20px] sm:text-[34px] sm:leading-[1.1]"
              }
              style={titleStyle}
            >
              Searching for my resume?
            </h4>
            <a
              className={"mt-0 flex flex-row flex-wrap justify-start w-fit gap-2 items-center text-sm sm:text-inherit"}
              rel="noopener noreferrer"
              target="_blank"
              href={"/resume/ismail_feham_resume.pdf"}
            >
              Download it here!
              <Image
                className={"-mt-[2px]"}
                src={download.src}
                width={24}
                height={14}
                alt={"download"}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeDownload;
