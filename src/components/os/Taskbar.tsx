import React from 'react';
import {DesktopWindows} from "@/constants/types";
import Icon from "@/components/common/Icon";

interface TaskbarProps {
    windows: DesktopWindows;
    toggleMinimize: (key: string) => void;
}

function Taskbar(props: TaskbarProps) {
    const [showStartMenu, setShowStartMenu] = React.useState(false);
    const [time, setTime] = React.useState(new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}));

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}));
        }, 60000);
        return () => clearInterval(timer); // This will clear the interval when the component unmounts
    }, []);

    return (
        <div className="z-40 text-retro-dark text-md rounded-t-lg rounded-b-lg select-none shadow-taskbar absolute flex bottom-0 w-full h-[40px] px-2 border-retro-dark border-t-3 border-x-3 font-extrabold justify-between items-center bg-retro-white">
            <div className="flex flex-row w-full h-full justify-between pl-3">
                <div
                    className="flex items-center flex-row gap-2">
                    <button className={"h-full hover:cursor-pointer hover:bg-retro-medium border-x-3 border-retro-dark px-6"}>Start</button>
                    <div className="flex gap-3 h-full">
                        {Object.keys(props.windows).map((key) => {
                            return (
                                <button
                                    key={key}
                                    className={`flex flex-row gap-2 cursor-default items-center h-full border-x-3 border-retro-dark px-3 bg-retro-white
                                    ${props.windows[key].minimized ? '' : 'dotted'}`}
                                    onClick={() => props.toggleMinimize(key)}
                                >
                                    <Icon icon={props.windows[key].application.icon} size={24}/>
                                    <span>{props.windows[key].application.name}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="flex gap-3 items-center pr-1">
                    <div
                        className="h-full hover:cursor-pointer hover:bg-retro-medium flex gap-3 items-center bg-retro-white border-x-3 border-retro-dark py-1 px-4 ">
                        <Icon icon={'wifi'} size={18}/>
                        <Icon icon={'speaker'} size={16}/>
                        <span>{time}</span>
                        <Icon icon={'battery'} className={"mb"} size={12}/>
                    </div>
                    <button className="hover:bg-retro-medium border-3 border-retro-dark p-[5px] rounded-full w-0 h-0 "/>
                </div>
            </div>
        </div>
    );
}

export default Taskbar;