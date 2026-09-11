import React, { useEffect, useRef } from "react";
import { DesktopWindows } from "@/constants/types";
import Icon from "@/components/common/Icon";
import { IconName } from "@/assets/icons";
import StartMenu from "@/components/os/StartMenu";
import { motion } from "framer-motion";

interface TaskbarProps {
  windows: DesktopWindows;
  toggleMinimize: (key: string) => void;
  minimizeAll: () => void;
  updateTaskbarAppPosX: (key: string, posX: number) => void;
  isMobile: boolean;
  taskbarHeight: number;
}

function Taskbar(props: TaskbarProps) {
  const [showStartMenu, setShowStartMenu] = React.useState(false);
  const [time, setTime] = React.useState(
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  );
  const [windowOnFocus, setWindowOnFocus] = React.useState<string | undefined>(
    undefined,
  );

  const taskbarButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>(
    {},
  );
  const startMenuRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);

  const [wifiBars, setWifiBars] = React.useState<1 | 2 | 3>(3);
  const wifiBarsStyles = {
    1: { width: 5, paddingTop: "pt-[18px]" },
    2: { width: 12, paddingTop: "pt-[13px]" },
    3: { width: 18, paddingTop: "pt-[9px]" },
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const random = Math.random();
      if (random < 0.08) setWifiBars(1);
      else if (random < 0.3) setWifiBars(2);
      else setWifiBars(3);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (props.windows && Object.values(props.windows).length > 0) {
      // Instead, get the window with the highest z-index that its animation state is not 'MINIMIZED'
      const windowOnFocus = Object.values(props.windows)
        .filter((window) => window.animationState !== "MINIMIZED")
        .sort((a, b) => b.zIndex - a.zIndex)[0];
      setWindowOnFocus(windowOnFocus?.application.key);
    }
  }, [props.windows]);

  useEffect(() => {
    if (!taskbarButtonRefs.current) return;
    Object.keys(taskbarButtonRefs.current).forEach((key) => {
      const buttonRect =
        taskbarButtonRefs.current[key]?.getBoundingClientRect();
      if (!buttonRect) return;
      const taskbarX = buttonRect.x + buttonRect.width / 2;
      props.updateTaskbarAppPosX(key, taskbarX);
    });
  }, [props.windows, taskbarButtonRefs]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      // Don't close if clicking on the start button
      if (startButtonRef.current && startButtonRef.current.contains(event.target as Node)) {
        return;
      }
      
      // Don't close if clicking inside the start menu
      if (startMenuRef.current && startMenuRef.current.contains(event.target as Node)) {
        return;
      }
      
      // Only handle document clicks, not clicks on specific elements
      if ((event.target as HTMLElement).tagName === 'BUTTON' ||
          (event.target as HTMLElement).tagName === 'SPAN' ||
          (event.target as HTMLElement).tagName === 'IMG' ||
          (event.target as HTMLElement).tagName === 'DIV' &&
          ((event.target as HTMLElement).className || '').includes('menu')) {
        return;
      }
      
      // Close if click is outside
      if (showStartMenu) {
        setShowStartMenu(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [showStartMenu]);

  const toggleStartMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowStartMenu(prev => !prev);
  };

  return (
    <>
      <div ref={startMenuRef}>
        <StartMenu
          isOpen={showStartMenu}
          isMobile={props.isMobile}
          taskbarHeight={props.taskbarHeight}
          onClose={() => setShowStartMenu(false)}
        />
      </div>
      
      <div
        style={{ height: props.taskbarHeight }}
        className="z-[1000] text-retro-dark text-md select-none shadow-taskbar absolute flex bottom-0 w-full border-retro-dark border-t-3 border-x-3 font-extrabold justify-between items-center bg-retro-white pl-0 pr-1.5 rounded-none pb-[env(safe-area-inset-bottom)] lg:px-2 lg:rounded-t-lg lg:rounded-b-lg lg:pb-0 max-lg:min-h-12 lg:min-h-10"
      >
        <div className="flex flex-row w-full h-full gap-1 pl-0 lg:pl-3">
          <div className="flex items-center flex-row gap-1">
            <button
              ref={startButtonRef}
              className={`h-full min-w-11 hover:cursor-pointer hover:bg-retro-medium border-x-3 border-retro-dark border-l-0 px-3 text-sm lg:border-l-3 lg:px-6 lg:text-md ${
                showStartMenu ? "bg-retro-medium" : ""
              }`}
              onClick={toggleStartMenu}
            >
              Start
            </button>
          </div>
          <div className="flex flex-row min-w-0 flex-grow gap-1 h-full overflow-x-auto overflow-y-hidden">
            {Object.keys(props.windows).map((key) => {
              return (
                <button
                  key={key}
                  ref={(el) => {
                    taskbarButtonRefs.current[key] = el;
                  }}
                  aria-label={props.windows[key].application.name}
                  className={`min-w-0 flex flex-row cursor-default items-center h-full border-x-3 border-retro-dark bg-retro-white w-14 flex-none justify-center px-3 lg:w-full lg:max-w-[220px] lg:gap-2 lg:flex-row ${
                    key == windowOnFocus ? "dotted" : ""
                  }`}
                  onClick={() => props.toggleMinimize(key)}
                >
                  <Icon icon={props.windows[key].application.icon} size={24} />
                  <span className="h-fit overflow-hidden whitespace-nowrap text-ellipsis hidden lg:inline">
                    {props.windows[key].application.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1 pr-1 lg:gap-3">
            <div className="h-full hover:cursor-pointer hover:bg-retro-medium items-center bg-retro-white border-x-3 border-retro-dark py-1 hidden lg:flex gap-3 px-4">
              <div
                className={`min-w-[18px] h-full + ${wifiBarsStyles[wifiBars].paddingTop}`}
              >
                <Icon
                  icon={`wifi${wifiBars}` as IconName}
                  size={wifiBarsStyles[wifiBars].width}
                  colorize={true}
                />
              </div>
              <Icon icon={"speaker"} size={16} colorize={true} />
              <span className={"whitespace-nowrap"}>{time}</span>
              <Icon icon={"battery"} className={"pb-1"} size={13} />
            </div>
            <motion.button
              aria-label="Minimize all windows"
              className="hover:bg-retro-medium border-3 border-retro-dark rounded-full w-8 h-8 p-0 lg:w-4 lg:h-4"
              onClick={props.minimizeAll}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Taskbar;
