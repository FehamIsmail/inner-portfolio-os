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
import {
  DESKTOP_TASKBAR_HEIGHT,
  MOBILE_TASKBAR_HEIGHT,
  useViewport,
} from "@/hooks/useIsMobile";


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
  const {
    width: viewportWidth,
    height: viewportHeight,
    isMobile,
    safeAreaBottom,
  } = useViewport();
  const taskbarHeight = isMobile
    ? MOBILE_TASKBAR_HEIGHT + safeAreaBottom
    : DESKTOP_TASKBAR_HEIGHT;
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
      if (isMobile && application.hideOnMobile) return;
      addWindow(application);
      performPostAnimationAction(() => {
        setWindowAnimationState(application.key, WindowAnimationState.VISIBLE);
      });
    },
    [addWindow, isMobile, performPostAnimationAction, setWindowAnimationState],
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
    const newShortcuts = APPLICATIONS.filter(
      (application) => !(isMobile && application.hideOnMobile),
    ).map((application) => {
      return {
        icon: application.icon,
        name: application.name,
        isFocused: false,
        isMobile,
        setFocused: () => setShortcutOnFocus(application.name),
        onOpen: () => onOpen(application),
      };
    });
    setShortcuts(newShortcuts);
  }, [getPortfolioIcon, isMobile, onOpen]);

  useEffect(() => {
    if (!viewportWidth || !viewportHeight) return;
    setDefaultWindowSize({
      margin: isMobile ? 0 : 0.05,
      width: isMobile
        ? viewportWidth
        : viewportWidth - viewportWidth * 0.05 * 2,
      height: isMobile
        ? viewportHeight - taskbarHeight
        : viewportHeight - viewportHeight * 0.05 * 2 - taskbarHeight,
    });
  }, [isMobile, taskbarHeight, viewportHeight, viewportWidth]);

  useEffect(() => {
    if (!firstRender) return;
    if (!defaultWindowSize.width || !defaultWindowSize.height) return;
    setFirstRender(false);
    const myPortfolio = APPLICATIONS.find(
      (application) => application.key === "myPortfolio",
    );
    if (myPortfolio) {
      onOpen(myPortfolio);
    }
  }, [
    defaultWindowSize.height,
    defaultWindowSize.width,
    firstRender,
    onOpen,
  ]);

  useEffect(() => {
    if (!isMobile) return;
    setWindows((currentWindows) =>
      Object.fromEntries(
        Object.entries(currentWindows).filter(
          ([, desktopWindow]) => !desktopWindow.application.hideOnMobile,
        ),
      ) as DesktopWindows,
    );
  }, [isMobile]);

  return (
    <DesktopContext.Provider
      value={{ addModal, addWindow, removeWindow, removeModal, onOpen }}
    >
      <AlertProvider>
        <main className="font-nunito z-[-200] background-retro-gradient h-dvh min-h-0 flex flex-col select-none overflow-hidden">
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
                      ? Math.max(
                          12,
                          viewportWidth / 2 -
                            Math.min(ALERT_WIDTH, viewportWidth - 24) / 2,
                        )
                      : isMobile
                        ? 0
                        : ((desktopWindow.zIndex * 50) % 200) +
                          defaultWindowSize.margin * viewportWidth
                  }
                  top={
                    isModal
                      ? Math.max(12, 0.12 * viewportHeight)
                      : isMobile
                        ? 0
                        : ((desktopWindow.zIndex * 50) % 200) +
                          defaultWindowSize.margin * viewportHeight
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
                  isMobile={isMobile}
                  viewportWidth={viewportWidth}
                  viewportHeight={viewportHeight}
                  taskbarHeight={taskbarHeight}
                />
              </div>
            );
          })}
          <div className={"h-screen w-screen"}>
            <div
              className={
                `text-sm flex flex-col w-fit whitespace-nowrap px-3 py-1 flex-wrap gap-0 ${
                  isMobile
                    ? "max-h-[calc(100dvh-48px)]"
                    : "max-h-[calc(100dvh-40px)]"
                }`
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
                    isMobile={isMobile}
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
            isMobile={isMobile}
            taskbarHeight={taskbarHeight}
          />
        </main>
      </AlertProvider>
    </DesktopContext.Provider>
  );
}

export default Desktop;
