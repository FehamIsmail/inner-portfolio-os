"use client";
import React, { useCallback, useEffect } from "react";
import Taskbar from "@/components/os/Taskbar";
import Window from "@/components/os/Window";
import { APPLICATIONS } from "@/constants/data";
import AppShortcut, { AppShortcutProps } from "@/components/os/AppShortcut";
import { ApplicationType, DesktopWindows } from "@/constants/types";
import { WindowAnimationState } from "@/constants/enums";
import { WINDOW_ANIMATION_DURATION } from "@/components/utils/AnimationUtils";
import { setDynamicColors, initializeThemeChangeListener } from "@/components/utils/ColorUtils";
import AlertProvider, { ALERT_WIDTH } from "@/components/alerts/AlertProvider";
import Wallpaper from "@/components/os/Wallpaper";


interface DesktopProps {
  children?: React.ReactNode;
}

interface DesktopContextProps {
  onOpen: (application: ApplicationType) => void;
  addModal: (application: ApplicationType) => void;
  removeModal: () => void;
  addWindow: (application: ApplicationType) => void;
  removeWindow: (key: string) => void;
}

export const DesktopContext = React.createContext<DesktopContextProps>(
  {} as DesktopContextProps,
);

function Desktop({ children }: DesktopProps) {
  const [windows, setWindows] = React.useState<DesktopWindows>(
    {} as DesktopWindows,
  );
  const [shortcuts, setShortcuts] = React.useState<AppShortcutProps[]>([]);
  const [taskbarAppPosX, setTaskbarAppPosX] = React.useState<{
    [key: string]: number;
  }>({});
  const [firstRender, setFirstRender] = React.useState(true);
  const [defaultWindowSize, setDefaultWindowSize] = React.useState(
    {} as {
      margin: number;
      width: number;
      height: number;
    },
  );

  const updateWindowProperties = useCallback(
    (key: string, properties: Partial<DesktopWindows[string]>) => {
      setWindows((prevWindows) => ({
        ...prevWindows,
        [key]: {
          ...prevWindows[key],
          ...properties,
        },
      }));
    },
    [setWindows],
  );

  const setWindowAnimationState = useCallback(
    (key: string, state: WindowAnimationState) => {
      updateWindowProperties(key, { animationState: state });
    },
    [updateWindowProperties],
  );

  const performPostAnimationAction = useCallback((action: () => void) => {
    setTimeout(() => {
      action();
    }, WINDOW_ANIMATION_DURATION);
  }, []);

  const getHighestZIndex = useCallback(() => {
    if (Object.keys(windows).length === 0) return 199;
    return Math.max(...Object.values(windows).map((window) => window.zIndex));
  }, [windows]);

  const getLowestZIndex = useCallback(() => {
    if (Object.keys(windows).length === 0) return 0;
    return Math.min(...Object.values(windows).map((window) => window.zIndex));
  }, [windows]);

  const addWindow = useCallback(
    (application: ApplicationType) => {
      updateWindowProperties(application.key, {
        zIndex: getHighestZIndex() + 1,
        minimized: false,
        animationState: WindowAnimationState.OPENING,
        application,
      });
    },
    [getHighestZIndex, updateWindowProperties],
  );

  const removeWindow = useCallback(
    (key: string) => {
      setWindows((prevState) => {
        const newWindows = { ...prevState };
        setWindowAnimationState(key, WindowAnimationState.CLOSING);
        return newWindows;
      });
      performPostAnimationAction(() => {
        setWindows((prevState) => {
          const newWindows = { ...prevState };
          delete newWindows[key];
          return newWindows;
        });
      });
    },
    [performPostAnimationAction, setWindowAnimationState],
  );

  const minimizeWindow = useCallback(
    (key: string) => {
      setWindowAnimationState(key, WindowAnimationState.MINIMIZING);
      performPostAnimationAction(() => {
        updateWindowProperties(key, { minimized: true });
        setWindowAnimationState(key, WindowAnimationState.MINIMIZED);
      });
    },
    [
      performPostAnimationAction,
      setWindowAnimationState,
      updateWindowProperties,
    ],
  );

  const minimizeAll = useCallback(() => {
    if (checkIfModalIsOpen()) return;
    Object.keys(windows).forEach((key) => {
      minimizeWindow(key);
    });
  }, [minimizeWindow, windows]);

  const toggleMinimize = useCallback(
    (key: string) => {
      if (checkIfModalIsOpen()) return;
      const highestZIndex = getHighestZIndex();
      const isFocused = windows[key].zIndex === highestZIndex;
      const newAnimationState = windows[key].minimized
        ? WindowAnimationState.RESTORING
        : isFocused
          ? WindowAnimationState.MINIMIZING
          : WindowAnimationState.VISIBLE;

      updateWindowProperties(key, {
        animationState: newAnimationState,
        zIndex: isFocused ? getLowestZIndex() - 1 : highestZIndex + 1,
        minimized:
          newAnimationState === WindowAnimationState.RESTORING
            ? false
            : windows[key].minimized,
      });

      performPostAnimationAction(() => {
        const shouldToggle = windows[key].minimized || isFocused;
        const newMinimized = shouldToggle
          ? !windows[key].minimized
          : windows[key].minimized;
        const finalState = newMinimized
          ? WindowAnimationState.MINIMIZED
          : WindowAnimationState.VISIBLE;
        updateWindowProperties(key, { minimized: newMinimized });
        setWindowAnimationState(key, finalState);
      });
    },
    [
      getHighestZIndex,
      getLowestZIndex,
      performPostAnimationAction,
      setWindowAnimationState,
      updateWindowProperties,
      windows,
    ],
  );

  const onInteract = useCallback(
    (key: string) => {
      if (checkIfModalIsOpen()) return;
      updateWindowProperties(key, { zIndex: getHighestZIndex() + 1 });
    },
    [getHighestZIndex, updateWindowProperties, windows],
  );

  const onOpen = useCallback(
    (application: ApplicationType) => {
      addWindow(application);
      performPostAnimationAction(() => {
        setWindowAnimationState(application.key, WindowAnimationState.VISIBLE);
      });
    },
    [addWindow, performPostAnimationAction, setWindowAnimationState],
  );

  const updateTaskbarAppPosX = useCallback((key: string, posX: number) => {
    setTaskbarAppPosX((prev) => ({
      ...prev,
      [key]: posX,
    }));
  }, []);

  const getPortfolioIcon = useCallback(() => {
    if (!Object.keys(windows).includes("myPortfolio"))
      return "myPortfolioClosed";
    return windows["myPortfolio"].minimized
      ? "myPortfolioClosed"
      : "myPortfolioOpened";
  }, [windows]);

  const setShortcutOnFocus = useCallback((name: string) => {
    setShortcuts((prevShortcuts) => {
      return prevShortcuts.map((shortcut) => {
        return {
          ...shortcut,
          isFocused: shortcut.name === name,
        };
      });
    });
  }, []);

  const checkIfModalIsOpen = useCallback(() => {
    return Object.keys(windows).includes("modal");
  }, [windows]);

  const addModal = useCallback(
    (application: ApplicationType) => {
      onOpen(application);
    },
    [onOpen],
  );

  const removeModal = useCallback(() => {
    removeWindow("modal");
  }, [removeWindow]);

  useEffect(() => {
    APPLICATIONS.find(
      (application) => application.key === "myPortfolio",
    )!.icon = getPortfolioIcon();
    const newShortcuts = APPLICATIONS.map((application) => {
      return {
        icon: application.icon,
        name: application.name,
        isFocused: false,
        setFocused: () => setShortcutOnFocus(application.name),
        onOpen: () => onOpen(application),
      };
    });
    setShortcuts(newShortcuts);
  }, [getPortfolioIcon, onOpen]);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      const myPortfolio = APPLICATIONS.find(
        (application) => application.key === "myPortfolio",
      );
      if (myPortfolio) {
        onOpen(myPortfolio);
      }
    }
  }, [firstRender, onOpen]);

  useEffect(() => {
    setDefaultWindowSize({
      margin: 0.05,
      width: window.innerWidth - window.innerWidth * 0.05 * 2,
      height: window.innerHeight - window.innerHeight * 0.05 * 2 - 40,
    });
  }, []);

  return (
    <DesktopContext.Provider
      value={{ addModal, addWindow, removeWindow, removeModal, onOpen }}
    >
      <AlertProvider>
        <main className="font-nunito z-[-200] background-retro-gradient min-h-full flex flex-col select-none">
          <Wallpaper />
          {Object.keys(windows).map((key) => {
            const desktopWindow = windows[key];
            const isModal = key === "modal";
            if (key === "myPortfolio") {
              desktopWindow.application.children = children;
              desktopWindow.application.width = defaultWindowSize.width;
              desktopWindow.application.height = defaultWindowSize.height;
            }
            return (
              <div
                className={`relative ${desktopWindow.minimized ? "hidden" : ""}`}
                key={key}
                style={{ zIndex: desktopWindow.zIndex }}
              >
                <Window
                  key={`window-${key}`}
                  left={
                    isModal
                      ? window.innerWidth / 2 - ALERT_WIDTH / 2
                      : ((desktopWindow.zIndex * 50) % 200) +
                        defaultWindowSize.margin * window.innerWidth
                  }
                  top={
                    isModal
                      ? 0.17 * window.innerHeight
                      : ((desktopWindow.zIndex * 50) % 200) +
                        defaultWindowSize.margin * window.innerHeight
                  }
                  application={desktopWindow.application}
                  taskbarPos={taskbarAppPosX[key]}
                  onInteract={() => onInteract(key)}
                  onMinimize={() => minimizeWindow(key)}
                  onClose={
                    isModal
                      ? desktopWindow.application.props.onCancel
                      : () => removeWindow(key)
                  }
                  animationState={desktopWindow.animationState}
                  setAnimationState={(state) =>
                    setWindowAnimationState(key, state)
                  }
                  isModal={isModal}
                />
              </div>
            );
          })}
          <div className={"h-screen w-screen"}>
            <div
              className={
                "text-sm flex flex-col w-fit whitespace-nowrap px-3 py-1 flex-wrap gap-0 max-h-[calc(100vh-40px)]"
              }
            >
              {shortcuts?.map((shortcut) => {
                return (
                  <AppShortcut
                    key={shortcut.name}
                    icon={shortcut.icon}
                    name={shortcut.name}
                    isFocused={shortcut.isFocused}
                    setFocused={shortcut.setFocused}
                    onOpen={shortcut.onOpen}
                  />
                );
              })}
            </div>
          </div>

          <Taskbar
            toggleMinimize={toggleMinimize}
            windows={windows}
            minimizeAll={minimizeAll}
            updateTaskbarAppPosX={updateTaskbarAppPosX}
          />
        </main>
      </AlertProvider>
    </DesktopContext.Provider>
  );
}

export default Desktop;
