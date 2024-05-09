import React from 'react';
import {DesktopWindows} from "@/constants/types";
import Icon from "@/components/common/Icon";

interface TaskbarProps {
    windows: DesktopWindows;
    toggleMinimize: (key: string) => void;
}

function Taskbar(props: TaskbarProps) {
    return (
        <div className="flex font-extrabold justify-between items-center w-full h-[52px] bg-[#6fcb9f] px-2 border-black border-t-2">
            <div className="bg-[#fffeb3] hover:cursor-pointer hover:bg-amber-200 border-2 border-black p-1 pr-2 rounded-md">
                <div className="flex items-center gap-2">
                    <Icon icon={'start'} size={32}/>
                    <span className="text-black text-lg">Start</span>
                </div>
            </div>
            <div className="flex gap-2 items-center">
                <div className="h-full hover:cursor-pointer hover:bg-amber-200 flex gap-2 items-center bg-[#fffeb3] border-2 border-black py-1 px-4 rounded-full">
                    {/*<Icon icon={'networkTabs'} size={24}/>*/}
                    <Icon icon={'wifi'} size={24}/>
                    <Icon icon={'speaker'} size={20}/>
                    <span className="text-black text-sm">{' '}</span>
                    <span className="text-black text-md cursor-default select-none hover:cursor-pointer">
                        {new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}
                    </span>
                    <span className="text-black text-sm">{' '}</span>
                    <Icon icon={'battery'} className={"mb-[1px]"} size={14}/>

                </div>
                <button className="bg-amber-200 border-2 border-black p-1 rounded-full w-0 h-0 hover:bg-amber-400"/>

            </div>
        </div>
    );
}

export default Taskbar;