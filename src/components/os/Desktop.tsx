import React from 'react';
import Taskbar from "@/components/os/Taskbar";
import {Nunito} from 'next/font/google'

const manjari = Nunito({
    weight: ['400', '700'],
    subsets: ['latin']}
);

function Desktop() {
    return (
        <main className={"w-screen h-screen p-0 m-0 bg-[#ffe28a] " + manjari.className}>
            <div className="relative top-[calc(100%-52px)]">
                <Taskbar
                    toggleMinimize={() => {}}
                    windows={{} as any}
                />
            </div>
        </main>

    );
}

export default Desktop;