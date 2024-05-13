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
    const [shortcuts, setShortcuts] = React.useState<AppShortcutProps[]>();

    const getHighestZIndex = (prevWindows: DesktopWindows = windows) => {
        if (Object.keys(prevWindows).length === 0) return -1;
        return Math.max(...Object.values(prevWindows).map(window => window.zIndex));
    }

    const addWindow = useCallback((key: string, application: ApplicationType) => {
        setWindows((prevWindows) => {
            const newZIndex = getHighestZIndex(prevWindows) + 1;
            return {
                ...prevWindows,
                [key]: {
                    zIndex: newZIndex,
                    minimized: false,
                    application,
                }
            };
        });
        if (application.key === 'myPortfolio') togglePortfolioIcon();
    }, []);

    const removeWindow = useCallback((key: string) => {
        const newWindows = {...windows};
        delete newWindows[key];
        setWindows(newWindows);
    }, [windows]);

    const minimizeWindow = useCallback((key: string) => {
        const newWindows = {...windows};
        newWindows[key].minimized = true;
        setWindows(newWindows);
        getHighestZIndex();
        if(key === 'myPortfolio') togglePortfolioIcon();
    }, [windows]);

    const minimizeAll = useCallback(() => {
        Object.keys(windows).forEach((key) => {
            minimizeWindow(key);
        });
    }, [windows]);

    const toggleMinimize = useCallback((key: string) => {
        const newWindows = {...windows};
        const highestZIndex = getHighestZIndex();
        if(newWindows[key].minimized || newWindows[key].zIndex === highestZIndex) {
            newWindows[key].minimized = !newWindows[key].minimized;
        }
        newWindows[key].zIndex = getHighestZIndex() + 1;
        setWindows(newWindows);
    }, [windows]);

    const onInteract = useCallback((key: string) => {
        setWindows( (prevWindows ) => ({
            ...prevWindows,
            [key]: {
                ...prevWindows[key],
                zIndex: getHighestZIndex(prevWindows) + 1,
            }
        }));
    }, []);

    const togglePortfolioIcon = () => {
        if(!shortcuts) return;
        const portfolioIcon = shortcuts?.find((shortcut) => shortcut.name === 'My Portfolio');
        if(portfolioIcon) {
            const newShortcuts = [...shortcuts];
            const index = newShortcuts.indexOf(portfolioIcon);
            newShortcuts[index] = {
                ...portfolioIcon,
                icon: portfolioIcon.icon === 'myPortfolioOpened' ? 'myPortfolioClosed' : 'myPortfolioOpened'
            }
            setShortcuts(newShortcuts);
        }
    }

    useEffect(() => {
        const newShortcuts = APPLICATIONS.map((application) => {
            return {
                icon: application.icon,
                name: application.name,
                isFocused: false,
                onOpen: () => { addWindow(application.key, application); }
            }
        });

        // Open My Portfolio on load
        newShortcuts.find((shortcut) => shortcut.name === 'My Portfolio')?.onOpen();

        setShortcuts(newShortcuts);
    }, []);


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
                            left={window.zIndex * 50 % 400}
                            top={window.zIndex * 50 % 400}
                            application={window.application}
                            onInteract={() => onInteract(key)}
                            onMinimize={() => minimizeWindow(key)}
                            onClose={() => removeWindow(key)}
                        />
                    </div>
                );
            })}
            <div className={"h-screen w-screen"}>
                <div className={"text-sm flex flex-col w-fit whitespace-nowrap flex-wrap gap-4"}>
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
            />
        </main>
    );
}

export default Desktop;