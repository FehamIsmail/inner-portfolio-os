"use client"
import React, {useCallback, useEffect} from 'react';
import Taskbar from "@/components/os/Taskbar";
import {Nunito} from 'next/font/google'
import Window from "@/components/os/Window";
import {APPLICATIONS} from "@/constants/data";
import {ApplicationType, DesktopWindows} from "@/constants/types";
import AppShortcut, {AppShortcutProps} from "@/components/os/AppShortcut";

const nunito = Nunito({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    style: 'normal'
});

function Desktop() {
    const [windows, setWindows] = React.useState<DesktopWindows>({} as DesktopWindows);
    const [shortcuts, setShortcuts] = React.useState<AppShortcutProps[]>([]);
    const [taskbarAppPosX, setTaskbarAppPosX] = React.useState<{[key: string]: number}>({});
    const [firstLoad, setFirstLoad] = React.useState(true);

    const getHighestZIndex = useCallback(() => {
        if (Object.keys(windows).length === 0) return -1;
        return Math.max(...Object.values(windows).map(window => window.zIndex));
    }, [windows])

    const addWindow = useCallback((application: ApplicationType) => {
        setWindows(prevWindows => {
            return {
                ...prevWindows,
                [application.key]: {
                    zIndex: getHighestZIndex() + 1,
                    minimized: false,
                    application,
                }
            };
        });
    }, [getHighestZIndex]);

    const removeWindow = useCallback((key: string) => {
        const newWindows = {...windows};
        delete newWindows[key];
        setWindows(newWindows);
    }, [windows]);

    const minimizeWindow = useCallback((key: string) => {
        const newWindows = {...windows};
        newWindows[key].minimized = true;
        setWindows(newWindows);
    }, [windows]);

    const minimizeAll = useCallback(() => {
        Object.keys(windows).forEach((key) => {
            minimizeWindow(key);
        });
    }, [minimizeWindow, windows]);

    const toggleMinimize = useCallback((key: string) => {
        const newWindows = {...windows};
        const highestZIndex = getHighestZIndex();
        if(newWindows[key].minimized || newWindows[key].zIndex === highestZIndex) {
            newWindows[key].minimized = !newWindows[key].minimized;
        }
        newWindows[key].zIndex = getHighestZIndex() + 1;
        setWindows(newWindows);
    }, [getHighestZIndex, windows]);

    const onInteract = useCallback((key: string) => {
        setWindows( (prevWindows ) => ({
            ...prevWindows,
            [key]: {
                ...prevWindows[key],
                zIndex: getHighestZIndex() + 1,
            }
        }));
    }, [getHighestZIndex]);

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

    const onOpen = useCallback((application: ApplicationType) => {
        addWindow(application);
    }, [addWindow]);

    useEffect(() => {
        // Update APPLICATIONS with new portfolio icon
        APPLICATIONS.find(application => application.key === 'myPortfolio')!.icon = getPortfolioIcon();
        const newShortcuts = APPLICATIONS.map((application) => {
            return {
                icon: application.icon,
                name: application.name,
                isFocused: false,
                onOpen: () => onOpen(application),
            }
        });
        setShortcuts(newShortcuts);
    }, [getPortfolioIcon, onOpen]);

    useEffect(() => {
        if (firstLoad) {
            setFirstLoad(false);
            const myPortfolio = APPLICATIONS.find(application => application.key === 'myPortfolio');
            if (myPortfolio) {
                onOpen(myPortfolio);
            }
        }
    }, [firstLoad, onOpen]);

    return (
        <main
            className={"min-h-full bg-retro-background flex flex-col" + nunito.className}
        >
            {Object.keys(windows).map((key) => {
                const window = windows[key];
                return (
                    <div
                        className={`relative ${window.minimized ? 'hidden' : ''}`}
                        key={key}
                        style={{zIndex: window.zIndex}}
                    >
                        <Window
                            key={`win-${key}`}
                            left={window.zIndex * 50 % 200 + 100}
                            top={window.zIndex * 50 % 200 + 100}
                            isMinimized={window.minimized}
                            application={window.application}
                            taskbarPos={taskbarAppPosX[key]}
                            onInteract={() => onInteract(key)}
                            onMinimize={() => minimizeWindow(key)}
                            onClose={() => removeWindow(key)}
                        />
                    </div>
                );
            })}
            <div className={"h-screen w-screen"}>
                <div className={"text-sm flex flex-col w-fit whitespace-nowrap p-4 flex-wrap gap-4"}>
                    {shortcuts?.map((shortcut) => {
                        return (
                            <AppShortcut
                                key={shortcut.name}
                                icon={shortcut.icon}
                                name={shortcut.name}
                                isFocused={false}
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