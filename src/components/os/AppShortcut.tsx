import React, {useRef} from 'react';
import {IconName} from "@/assets/icons";
import Icon from "@/components/common/Icon";

export interface AppShortcutProps {
    icon: IconName;
    isFocused: boolean;
    name: string;
    onOpen: () => void;
}

function AppShortcut(props: AppShortcutProps) {
    const shortcutRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);

    return (
        <div
            className={`flex flex-col max-w-[120px] items-center justify-center app-shortcut`}
            onDoubleClick={props.onOpen}
        >
            <div className={`p-2 rounded-t-md ${!props.isFocused ? 'bg-indigo-700' : ''}`}>
                <Icon icon={props.icon} size={70}/>
            </div>
            <div className={`p-2 rounded-md ${!props.isFocused ? 'bg-indigo-700' : ''}`}>
                <p
                    className={"px-[7px] py-[2px] max-w-full text-center select-none overflow-hidden whitespace-normal " +
                        "text-ellipsis bg-retro-white text-retro-dark font-bold rounded-md border-2 border-retro-dark line-clamp-2"}
                >
                    {props.name}
                </p>
            </div>
        </div>
    );
}

export default AppShortcut;