"use client"
import React, {useCallback, useEffect} from 'react';
import Taskbar from "@/components/os/Taskbar";
import {Nunito} from 'next/font/google'
import Window from "@/components/os/Window";
import {APPLICATIONS} from "@/constants/data";
import AppShortcut, {AppShortcutProps} from "@/components/os/AppShortcut";
import {ApplicationType, DesktopWindows} from "@/constants/types";
import {WindowAnimationState} from "@/constants/enums";
import {WINDOW_ANIMATION_DURATION} from "@/components/utils/AnimationUtils";
import {setDynamicColors} from "@/components/utils/ColorUtils";

interface DesktopProps {
    children?: React.ReactNode;
}

function Desktop({children}: DesktopProps) {
    const [windows, setWindows] = React.useState<DesktopWindows>({} as DesktopWindows);
    const [shortcuts, setShortcuts] = React.useState<AppShortcutProps[]>([]);
    const [taskbarAppPosX, setTaskbarAppPosX] = React.useState<{[key: string]: number}>({});
    const [firstRender, setFirstRender] = React.useState(true);

    const updateWindowProperties = useCallback((key: string, properties: Partial<DesktopWindows[string]>) => {
        setWindows((prevWindows) => ({
            ...prevWindows,
            [key]: {
                ...prevWindows[key],
                ...properties,
            }
        }));
    }, [setWindows]);

    const setWindowAnimationState = useCallback((key: string, state: WindowAnimationState) => {
        updateWindowProperties(key, {animationState: state});
    }, [updateWindowProperties]);

    const performPostAnimationAction =  useCallback((action: () => void) => {
        setTimeout(() => {
            action();
        }, WINDOW_ANIMATION_DURATION);
    }, [])

    const getHighestZIndex = useCallback(() => {
        if (Object.keys(windows).length === 0) return 199;
        return Math.max(...Object.values(windows).map(window => window.zIndex));
    }, [windows])

    const getLowestZIndex = useCallback(() => {
        if (Object.keys(windows).length === 0) return 0;
        return Math.min(...Object.values(windows).map(window => window.zIndex));
    }, [windows])

    const addWindow = useCallback((application: ApplicationType) => {
        updateWindowProperties(application.key,
            {
                zIndex: getHighestZIndex() + 1,
                minimized: false,
                animationState: WindowAnimationState.OPENING,
                application,
            });
    }, [getHighestZIndex, updateWindowProperties]);

    const removeWindow = useCallback((key: string) => {
        setWindows(prevState => {
            const newWindows = {...prevState};
            setWindowAnimationState(key, WindowAnimationState.CLOSING);
            return newWindows;
        });
        performPostAnimationAction(() => {
            setWindows(prevState => {
                const newWindows = {...prevState};
                delete newWindows[key];
                return newWindows;
            });
        });
    }, [performPostAnimationAction, setWindowAnimationState]);

    const minimizeWindow = useCallback((key: string) => {
        setWindowAnimationState(key, WindowAnimationState.MINIMIZING);
        performPostAnimationAction(() => {
            updateWindowProperties(key, {minimized: true});
            setWindowAnimationState(key, WindowAnimationState.MINIMIZED);
        });
    }, [performPostAnimationAction, setWindowAnimationState, updateWindowProperties]);

    const minimizeAll = useCallback(() => {
        Object.keys(windows).forEach((key) => {
            minimizeWindow(key);
        });
    }, [minimizeWindow, windows]);

    const toggleMinimize = useCallback((key: string) => {
        const highestZIndex = getHighestZIndex();
        const isFocused = windows[key].zIndex === highestZIndex;
        const newAnimationState = windows[key].minimized ? WindowAnimationState.RESTORING : isFocused ? WindowAnimationState.MINIMIZING : WindowAnimationState.VISIBLE;

        updateWindowProperties(key, {
            animationState: newAnimationState,
            zIndex: isFocused ? getLowestZIndex() - 1 : highestZIndex + 1,
            minimized: newAnimationState === WindowAnimationState.RESTORING ? false : windows[key].minimized,
        });

        performPostAnimationAction(() => {
            const shouldToggle =  windows[key].minimized || isFocused;
            const newMinimized =  shouldToggle ? !windows[key].minimized : windows[key].minimized;
            const finalState = newMinimized ? WindowAnimationState.MINIMIZED : WindowAnimationState.VISIBLE;
            updateWindowProperties(key, {minimized: newMinimized});
            setWindowAnimationState(key, finalState);
        });
    }, [getHighestZIndex, getLowestZIndex, performPostAnimationAction, setWindowAnimationState, updateWindowProperties, windows]);

    const onInteract = useCallback((key: string) => {
        updateWindowProperties(key, {zIndex: getHighestZIndex() + 1});
    }, [getHighestZIndex, updateWindowProperties]);

    const onOpen = useCallback((application: ApplicationType) => {
        addWindow(application);
        performPostAnimationAction(() => {
            setWindowAnimationState(application.key, WindowAnimationState.VISIBLE);
        })
    }, [addWindow, performPostAnimationAction, setWindowAnimationState]);

    const updateTaskbarAppPosX = useCallback((key: string, posX: number) => {
        setTaskbarAppPosX((prev) => ({
            ...prev,
            [key]: posX,
        }));
    }, []);

    const getPortfolioIcon = useCallback(() => {
        if (!Object.keys(windows).includes('myPortfolio')) return 'myPortfolioClosed';
        return windows['myPortfolio'].minimized ? 'myPortfolioClosed' : 'myPortfolioOpened';
    }, [windows]);

    const setShortcutOnFocus = useCallback((name: string) => {
        setShortcuts((prevShortcuts) => {
            return prevShortcuts.map(shortcut => {
                return {
                    ...shortcut,
                    isFocused: shortcut.name === name,
                }
            });
        });
    }, []);

    useEffect(() => {
        APPLICATIONS.find(application => application.key === 'myPortfolio')!.icon = getPortfolioIcon();
        const newShortcuts = APPLICATIONS.map((application) => {
            return {
                icon: application.icon,
                name: application.name,
                isFocused: false,
                setFocused: () => setShortcutOnFocus(application.name),
                onOpen: () => onOpen(application),
            }
        });
        setShortcuts(newShortcuts);
    }, [getPortfolioIcon, onOpen]);

    useEffect(() => {
        if (firstRender) {
            setFirstRender(false);
            const myPortfolio = APPLICATIONS.find(application => application.key === 'myPortfolio');
            if (myPortfolio) {
                onOpen(myPortfolio);
            }
        }
    }, [firstRender, onOpen]);

    useEffect(() => {
        setDynamicColors();
    }, []);

    return (
        <main
            className={"font-nunito desktop-background z-[-999] min-h-full bg-retro-background flex flex-col select-none"}
        >
            {Object.keys(windows).map((key) => {
                const window = windows[key];
                if(key === 'myPortfolio')
                    window.application.children = children;
                return (
                    <div
                        className={`relative ${window.minimized ? 'hidden' : ''}`}
                        key={key}
                        style={{zIndex: window.zIndex}}
                    >
                        <Window
                            key={`window-${key}`}
                            left={window.zIndex * 50 % 200 + 100}
                            top={window.zIndex * 50 % 200 + 100}
                            application={window.application}
                            taskbarPos={taskbarAppPosX[key]}
                            onInteract={() => onInteract(key)}
                            onMinimize={() => minimizeWindow(key)}
                            onClose={() => removeWindow(key)}
                            animationState={window.animationState}
                            setAnimationState={(state) => setWindowAnimationState(key, state)}
                        />
                    </div>
                );
            })}
            <div className={"h-screen w-screen"}>
                <div className={"text-sm flex flex-col w-fit whitespace-nowrap p-6 flex-wrap gap-8"}>
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
                        )
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
    );
}

export default Desktop;