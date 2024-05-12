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


    const getHighestZIndex = useCallback(() => {
        if(Object.keys(windows).length === 0) return 10;
        return Math.max(...Object.values(windows).map((window) => window.zIndex));
    }, [windows]);

    const addWindow = useCallback((key: string, application: ApplicationType) => {
        console.log(getHighestZIndex())
        setWindows(
            {
                ...windows,
                [key]: {
                    zIndex: getHighestZIndex() + 1,
                    minimized: false,
                    application,
                }
            }
        )
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

    const toggleMinimize = useCallback((key: string) => {
        const newWindows = {...windows};
        const highestZIndex = getHighestZIndex();
        if(newWindows[key].minimized || newWindows[key].zIndex === highestZIndex) {
            newWindows[key].minimized = !newWindows[key].minimized;
        }
        newWindows[key].zIndex = getHighestZIndex() + 1;
        setWindows(newWindows);
    }, [windows, getHighestZIndex]);

    const onInteract = useCallback((key: string) => {
        setWindows( (prevWindows) => ({
            ...prevWindows,
            [key]: {
                ...prevWindows[key],
                zIndex: getHighestZIndex() + 1,
            }
        }));
    }, []);


    useEffect(() => {
        const newShortcuts = APPLICATIONS.map((application) => {
            return {
                icon: application.icon,
                name: application.name,
                onOpen: () => {
                    addWindow(application.key, application);
                }
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
                console.log(window)
                return (
                    <div
                        className={`relative ${window.minimized ? 'hidden' : ''}`}
                        key={key}
                        style={{zIndex: window.zIndex}}
                    >
                        <Window
                            key={`win-${key}`}
                            left={10}
                            top={10}
                            application={window.application}
                            onInteract={() => onInteract(key)}
                            minimizeWindow={() => minimizeWindow(key)}
                            closeWindow={() => removeWindow(key)}
                        />

                    </div>
                );
            })}

            <Taskbar
                    toggleMinimize={toggleMinimize}
                    windows={windows}
            />
        </main>
    );
}

export default Desktop;