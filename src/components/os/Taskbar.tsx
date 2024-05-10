import React from 'react';
import {DesktopWindows} from "@/constants/types";
import Icon from "@/components/common/Icon";

interface TaskbarProps {
    windows: DesktopWindows;
    toggleMinimize: (key: string) => void;
}

function Taskbar(props: TaskbarProps) {
    const [time, setTime] = React.useState(new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}));

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}));
        }, 60000);
        return () => clearInterval(timer); // This will clear the interval when the component unmounts
    }, []);

    return (
        <div className="z-40 rounded-t-xl absolute flex bottom-0 w-full h-[58px] px-2 border-retro-dark border-t-3 border-x-3 font-extrabold justify-between items-center bg-retro-white">
            <div className="flex flex-row w-full h-full justify-between pl-3">
                <div className="bg-retro-white hover:cursor-pointer hover:bg-amber-200 border-x-3 border-retro-dark px-6">
                    <div className="flex items-center gap-2 h-full">
                        <Icon icon={'start'} size={32}/>
                        <span className="text-retro-dark text-lg">Start</span>
                    </div>
                </div>
                <div className="flex gap-3 items-center pr-1">
                    <div className="h-full hover:cursor-pointer hover:bg-amber-200 flex gap-2 items-center bg-retro-white border-x-3 border-retro-dark py-1 px-4 ">
                        <Icon icon={'wifi'} size={20}/>
                        <Icon icon={'speaker'} size={18}/>
                        <span className="text-retro-dark text-sm">{' '}</span>
                        <span className="text-retro-dark text-md cursor-default select-none hover:cursor-pointer">
                            {time}
                        </span>
                        <span className="text-retro-dark text-sm">{' '}</span>
                        <Icon icon={'battery'} className={"mb-[1px]"} size={13}/>
                    </div>
                    <button className="bg-amber-200 border-3 border-retro-dark p-[5px] rounded-full w-0 h-0 hover:bg-amber-400"/>
                </div>
            </div>
        </div>
    );
}

export default Taskbar;