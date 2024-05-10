"use client"
import React from 'react';
import Taskbar from "@/components/os/Taskbar";
import {Nunito} from 'next/font/google'
import Window from "@/components/os/Window";

const nunito = Nunito({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    style: 'normal'
});

function Desktop() {
    return (
        <div className="relative z-0 min-h-full bg-retro-background">
        <main
            className={"min-h-full flex flex-col" + nunito.className}
            // style={{filter: }}
        >
            <div className="z-30 relative">
                <Window
                    closeWindow={() => {
                    }}
                    minimizeWindow={() => {
                    }}
                    width={500}
                    height={300}
                    top={200}
                    left={200}
                    title={"Window Title"}
                    titleBarColor={'blue'}
                    titleBarIcon={'start'}
                    onWidthChange={() => {
                    }}
                    onHeightChange={() => {
                    }}
                />
            </div>
            <div className={"h-80 w-80 border-retro-dark border-3 bg-white rounded-xl relative top-20 left-20"}>

            </div>
            <Taskbar
                    toggleMinimize={() => {
                    }}
                    windows={{} as any}
            />
        </main>
        </div>
    );
}

export default Desktop;