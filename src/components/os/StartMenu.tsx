"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Icon from "@/components/common/Icon";
import { APPLICATIONS } from "@/constants/data";
import { useDesktop } from "@/hooks/useDesktop";
import { DEFAULT_THEME_COLOR } from "@/components/utils/ColorUtils";

interface ThemeOption {
  name: string;
  value: string;
  background: string;
}

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const THEMES: ThemeOption[] = [
  { name: "Default", value: DEFAULT_THEME_COLOR, background: "bg-[#ba8752]" },
  { name: "Sky", value: "#247b9e", background: "bg-[#6bb5d3]" },
  { name: "Night", value: "#2c3e50", background: "bg-[#2c3e50]" },
  { name: "Dracula", value: "#282a36", background: "bg-[#282a36]" },
];

const EXIT_MS = 150;

const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose, isMobile }) => {
  const { onOpen } = useDesktop();
  const [rendered, setRendered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (isOpen) {
      wasOpen.current = true;
      setRendered(true);
      setExiting(false);
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    setExiting(true);
    const timeout = window.setTimeout(() => {
      setRendered(false);
      setExiting(false);
    }, EXIT_MS);
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  const setTheme = useCallback(
    (backgroundColor: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      document.documentElement.style.setProperty(
        "--color-retro-background",
        backgroundColor,
      );
      document.dispatchEvent(
        new CustomEvent("themeChanged", {
          detail: { color: backgroundColor },
        }),
      );
      onClose();
    },
    [onClose],
  );

  const handleAppClick = useCallback(
    (appKey: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const app = APPLICATIONS.find((item) => item.key === appKey);
      if (app) {
        onOpen(app);
        onClose();
      }
    },
    [onOpen, onClose],
  );

  if (!rendered) return null;

  return (
    <div
      className={`os-start-menu absolute z-[1100] border-3 border-retro-dark bg-retro-white rounded-lg text-retro-dark origin-bottom-left ${
        isMobile
          ? "w-auto max-h-[calc(100dvh-64px)]"
          : "left-0 bottom-[44px] w-[360px]"
      } ${exiting ? "is-exiting" : ""}`}
      style={
        isMobile
          ? {
              bottom: "calc(var(--os-taskbar-total) + 8px)",
              left: 8,
              right: 8,
            }
          : undefined
      }
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="h-[72px] w-full bg-retro-blue border-b-3 border-retro-dark px-4 py-2 flex items-center rounded-t-[5px]">
        <div className="w-12 h-12 mr-3 relative">
          <Image
            src="/logo.png"
            alt="Logo"
            width={48}
            height={48}
            className="rounded"
          />
        </div>
        <h3 className="text-2xl font-bold my-auto pt-1">Ismail Feham</h3>
      </div>

      <div className={`flex ${isMobile ? "h-[min(55dvh,350px)]" : "h-[400px]"}`}>
        <div
          className="w-3/5 p-2 overflow-y-auto border-r-3 border-retro-dark scrollbar-thin scrollbar-thumb-retro-dark scrollbar-track-retro-white"
          onClick={(e) => e.stopPropagation()}
        >
          <h4 className="text-lg font-bold my-2 pl-2">Applications</h4>
          <div className="flex flex-col gap-1">
            {APPLICATIONS.filter(
              (app) => !(isMobile && app.hideOnMobile),
            ).map((app) => (
              <button
                key={app.key}
                className={`flex items-center px-2 rounded hover:bg-retro-medium text-left ${
                  isMobile ? "min-h-11 py-2" : "py-1.5"
                }`}
                onClick={(e) => handleAppClick(app.key, e)}
              >
                <Icon icon={app.icon} size={24} className="mr-3" />
                <span className="font-medium">{app.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          className="w-2/5 p-2 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h4 className="text-lg font-bold my-2 pl-2">Theme</h4>
          <div className="flex flex-col gap-1">
            {THEMES.map((theme) => (
              <button
                key={theme.name}
                className={`flex items-center px-2 rounded hover:bg-retro-medium text-left ${
                  isMobile ? "min-h-11 py-2" : "py-1.5"
                }`}
                onClick={(e) => setTheme(theme.value, e)}
              >
                <div
                  className="w-5 h-5 mr-3 border border-retro-dark rounded"
                  style={{ backgroundColor: theme.value }}
                />
                <span className="font-medium">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className="h-[54px] w-full border-t-3 border-retro-dark p-2 flex items-center justify-end gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="flex items-center gap-2 px-3 py-1.5 bg-retro-yellow border-2 border-retro-dark rounded hover:bg-opacity-80"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
        >
          <Icon icon="minimize" size={16} />
          <span className="font-bold">Sleep</span>
        </button>
        <button
          className="flex items-center gap-2 px-3 py-1.5 bg-retro-red border-2 border-retro-dark rounded hover:bg-opacity-80"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
        >
          <Icon icon="close" size={16} />
          <span className="font-bold">Turn Off</span>
        </button>
      </div>
    </div>
  );
};

export default StartMenu;
