"use client";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import Taskbar from "@/components/os/Taskbar";
import Window from "@/components/os/Window";
import { APPLICATIONS } from "@/constants/data";
import AppShortcut from "@/components/os/AppShortcut";
import { ApplicationType, DesktopWindows } from "@/constants/types";
import { WindowAnimationState } from "@/constants/enums";
import { WINDOW_ANIMATION_DURATION } from "@/components/utils/AnimationUtils";
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

const highestZ = (windows: DesktopWindows) => {
  const values = Object.values(windows);
  if (values.length === 0) return 199;
  return Math.max(...values.map((window) => window.zIndex));
};

const lowestZ = (windows: DesktopWindows) => {
  const values = Object.values(windows);
  if (values.length === 0) return 0;
  return Math.min(...values.map((window) => window.zIndex));
};

const hasModal = (windows: DesktopWindows) => "modal" in windows;

function Desktop({ children }: DesktopProps) {
  const {
    width: viewportWidth,
    height: viewportHeight,
    isMobile,
  } = useViewport();
  const taskbarHeight = isMobile
    ? MOBILE_TASKBAR_HEIGHT
    : DESKTOP_TASKBAR_HEIGHT;
  const [windows, setWindows] = useState<DesktopWindows>({} as DesktopWindows);
  const [focusedShortcut, setFocusedShortcut] = useState<string | null>(null);
  const [taskbarAppPosX, setTaskbarAppPosX] = useState<{
    [key: string]: number;
  }>({});
  const [firstRender, setFirstRender] = useState(true);
  const [shellReady, setShellReady] = useState(false);
  const [defaultWindowSize, setDefaultWindowSize] = useState({
    margin: 0.05,
    width: 0,
    height: 0,
  });

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
    [],
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

  const addWindow = useCallback((application: ApplicationType) => {
    setWindows((prev) => ({
      ...prev,
      [application.key]: {
        ...prev[application.key],
        zIndex: highestZ(prev) + 1,
        minimized: false,
        maximized: false,
        animationState: WindowAnimationState.OPENING,
        application,
      },
    }));
  }, []);

  const removeWindow = useCallback(
    (key: string) => {
      if (isMobile) {
        setWindows((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        return;
      }
      setWindowAnimationState(key, WindowAnimationState.CLOSING);
      performPostAnimationAction(() => {
        setWindows((prevState) => {
          const newWindows = { ...prevState };
          delete newWindows[key];
          return newWindows;
        });
      });
    },
    [isMobile, performPostAnimationAction, setWindowAnimationState],
  );

  const minimizeWindow = useCallback(
    (key: string) => {
      if (isMobile) {
        updateWindowProperties(key, {
          minimized: true,
          animationState: WindowAnimationState.MINIMIZED,
        });
        return;
      }
      setWindowAnimationState(key, WindowAnimationState.MINIMIZING);
      performPostAnimationAction(() => {
        updateWindowProperties(key, { minimized: true });
        setWindowAnimationState(key, WindowAnimationState.MINIMIZED);
      });
    },
    [
      isMobile,
      performPostAnimationAction,
      setWindowAnimationState,
      updateWindowProperties,
    ],
  );

  const minimizeAll = useCallback(() => {
    setWindows((prev) => {
      if (hasModal(prev)) return prev;
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        next[key] = {
          ...next[key],
          minimized: true,
          animationState: WindowAnimationState.MINIMIZED,
        };
      });
      return next;
    });
  }, []);

  const toggleMinimize = useCallback(
    (key: string) => {
      if (isMobile) {
        setWindows((prev) => {
          if (hasModal(prev) || !prev[key]) return prev;
          const focusedZ = highestZ(prev);
          const isFocused = prev[key].zIndex === focusedZ;
          const restoring = prev[key].minimized;
          return {
            ...prev,
            [key]: {
              ...prev[key],
              minimized: restoring ? false : isFocused ? true : prev[key].minimized,
              zIndex: restoring || !isFocused ? focusedZ + 1 : lowestZ(prev) - 1,
              animationState: restoring
                ? WindowAnimationState.VISIBLE
                : isFocused
                  ? WindowAnimationState.MINIMIZED
                  : WindowAnimationState.VISIBLE,
            },
          };
        });
        return;
      }

      setWindows((prev) => {
        if (hasModal(prev) || !prev[key]) return prev;
        const focusedZ = highestZ(prev);
        const isFocused = prev[key].zIndex === focusedZ;
        const newAnimationState = prev[key].minimized
          ? WindowAnimationState.RESTORING
          : isFocused
            ? WindowAnimationState.MINIMIZING
            : WindowAnimationState.VISIBLE;
        return {
          ...prev,
          [key]: {
            ...prev[key],
            animationState: newAnimationState,
            zIndex: isFocused ? lowestZ(prev) - 1 : focusedZ + 1,
            minimized:
              newAnimationState === WindowAnimationState.RESTORING
                ? false
                : prev[key].minimized,
          },
        };
      });

      performPostAnimationAction(() => {
        setWindows((prev) => {
          if (!prev[key]) return prev;
          const anim = prev[key].animationState;
          if (anim === WindowAnimationState.MINIMIZING) {
            return {
              ...prev,
              [key]: {
                ...prev[key],
                minimized: true,
                animationState: WindowAnimationState.MINIMIZED,
              },
            };
          }
          if (anim === WindowAnimationState.RESTORING) {
            return {
              ...prev,
              [key]: {
                ...prev[key],
                minimized: false,
                animationState: WindowAnimationState.VISIBLE,
              },
            };
          }
          return prev;
        });
      });
    },
    [isMobile, performPostAnimationAction],
  );

  const onInteract = useCallback((key: string) => {
    setWindows((prev) => {
      if (hasModal(prev) || !prev[key]) return prev;
      const focusedZ = highestZ(prev);
      if (prev[key].zIndex === focusedZ) return prev;
      return {
        ...prev,
        [key]: { ...prev[key], zIndex: focusedZ + 1 },
      };
    });
  }, []);

  const onOpen = useCallback(
    (application: ApplicationType) => {
      if (isMobile && application.hideOnMobile) return;

      setWindows((prev) => {
        const existing = prev[application.key];
        if (existing && !existing.minimized) {
          const focusedZ = highestZ(prev);
          if (
            existing.zIndex === focusedZ &&
            existing.animationState === WindowAnimationState.VISIBLE
          ) {
            return prev;
          }
          return {
            ...prev,
            [application.key]: {
              ...existing,
              zIndex: focusedZ + 1,
              animationState: WindowAnimationState.VISIBLE,
            },
          };
        }

        if (existing?.minimized) {
          return {
            ...prev,
            [application.key]: {
              ...existing,
              minimized: false,
              zIndex: highestZ(prev) + 1,
              animationState: isMobile
                ? WindowAnimationState.VISIBLE
                : WindowAnimationState.RESTORING,
            },
          };
        }

        return {
          ...prev,
          [application.key]: {
            zIndex: highestZ(prev) + 1,
            minimized: false,
            maximized: isMobile,
            animationState: WindowAnimationState.OPENING,
            application,
          },
        };
      });

      performPostAnimationAction(() => {
        setWindows((prev) => {
          const win = prev[application.key];
          if (!win) return prev;
          if (
            win.animationState !== WindowAnimationState.OPENING &&
            win.animationState !== WindowAnimationState.RESTORING
          ) {
            return prev;
          }
          return {
            ...prev,
            [application.key]: {
              ...win,
              minimized: false,
              animationState: WindowAnimationState.VISIBLE,
            },
          };
        });
      });
    },
    [isMobile, performPostAnimationAction],
  );

  const updateTaskbarAppPosX = useCallback((key: string, posX: number) => {
    setTaskbarAppPosX((prev) => ({
      ...prev,
      [key]: posX,
    }));
  }, []);

  const addModal = useCallback(
    (application: ApplicationType) => {
      onOpen(application);
    },
    [onOpen],
  );

  const removeModal = useCallback(() => {
    removeWindow("modal");
  }, [removeWindow]);

  const desktopContextValue = useMemo(
    () => ({ addModal, addWindow, removeWindow, removeModal, onOpen }),
    [addModal, addWindow, removeWindow, removeModal, onOpen],
  );

  const portfolioIcon =
    windows.myPortfolio && !windows.myPortfolio.minimized
      ? "myPortfolioOpened"
      : "myPortfolioClosed";

  const visibleShortcuts = useMemo(
    () =>
      APPLICATIONS.filter(
        (application) => !(isMobile && application.hideOnMobile),
      ),
    [isMobile],
  );

  const hasVisibleWindow = Object.values(windows).some(
    (desktopWindow) => !desktopWindow.minimized,
  );

  useLayoutEffect(() => {
    if (viewportWidth > 0) setShellReady(true);
  }, [viewportWidth]);

  useEffect(() => {
    if (!shellReady) return;
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
  }, [isMobile, shellReady, taskbarHeight, viewportHeight, viewportWidth]);

  useEffect(() => {
    if (!shellReady || !firstRender) return;
    const myPortfolio = APPLICATIONS.find(
      (application) => application.key === "myPortfolio",
    );
    if (!myPortfolio) return;
    if (!isMobile && (!defaultWindowSize.width || !defaultWindowSize.height)) {
      return;
    }
    setFirstRender(false);
    onOpen(myPortfolio);
  }, [
    defaultWindowSize.height,
    defaultWindowSize.width,
    firstRender,
    isMobile,
    onOpen,
    shellReady,
  ]);

  useEffect(() => {
    if (!shellReady || !isMobile) return;
    setWindows((currentWindows) =>
      Object.fromEntries(
        Object.entries(currentWindows).filter(
          ([, desktopWindow]) => !desktopWindow.application.hideOnMobile,
        ),
      ) as DesktopWindows,
    );
  }, [isMobile, shellReady]);

  return (
    <DesktopContext.Provider value={desktopContextValue}>
      <AlertProvider>
        <main className="font-nunito z-[-200] h-dvh min-h-0 flex flex-col select-none overflow-hidden">
          <Wallpaper />
          {shellReady &&
            Object.keys(windows).map((key) => {
            const desktopWindow = windows[key];
            const isModal = key === "modal";
            const application =
              key === "myPortfolio"
                ? {
                    ...desktopWindow.application,
                    children,
                    width: isMobile
                      ? viewportWidth
                      : defaultWindowSize.width,
                    height: isMobile
                      ? viewportHeight
                      : defaultWindowSize.height,
                  }
                : desktopWindow.application;
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
                  application={application}
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
          {(!isMobile || !hasVisibleWindow) && (
            <div className="h-dvh w-full">
              <div
                className={`text-sm flex flex-col w-fit whitespace-nowrap px-3 py-1 flex-wrap gap-0 ${
                  isMobile
                    ? "max-h-[calc(100dvh-var(--os-taskbar-total))]"
                    : "max-h-[calc(100dvh-40px)]"
                }`}
              >
                {visibleShortcuts.map((shortcut) => (
                  <AppShortcut
                    key={shortcut.name}
                    icon={
                      shortcut.key === "myPortfolio"
                        ? portfolioIcon
                        : shortcut.icon
                    }
                    name={shortcut.name}
                    isFocused={focusedShortcut === shortcut.name}
                    setFocused={() => setFocusedShortcut(shortcut.name)}
                    onOpen={() => onOpen(shortcut)}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            </div>
          )}

          <Taskbar
            toggleMinimize={toggleMinimize}
            windows={windows}
            minimizeAll={minimizeAll}
            updateTaskbarAppPosX={updateTaskbarAppPosX}
            isMobile={isMobile}
          />
        </main>
      </AlertProvider>
    </DesktopContext.Provider>
  );
}

export default Desktop;
