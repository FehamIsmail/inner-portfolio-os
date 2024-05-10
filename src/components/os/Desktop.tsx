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
        <main className={"min-h-full flex flex-col bg-[#ffe28a] " + nunito.className}>
            <div className="z-30 relative">
                <Window
                    closeWindow={() => {
                    }}
                    minimizeWindow={() => {
                    }}
                    width={1200}
                    height={800}
                    top={200}
                    left={200}
                    title={"Window Title"}
                    titleBarColor={"#e19b12"}
                    titleBarIcon={'start'}
                    onWidthChange={() => {
                    }}
                    onHeightChange={() => {
                    }}
                />
            </div>
            <div
                className="z-50 absolute flex bottom-0 w-full h-[58px] px-2 border-black border-t-3 font-extrabold justify-between items-center bg-[#6fcb9f]">
                <Taskbar
                    toggleMinimize={() => {
                    }}
                    windows={{} as any}
                />
            </div>
        </main>

    );
}

export default Desktop;