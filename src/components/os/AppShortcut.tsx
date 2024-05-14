import React from 'react';
import {IconName} from "@/assets/icons";
import Icon from "@/components/common/Icon";

export interface AppShortcutProps {
    icon: IconName;
    isFocused: boolean;
    name: string;
    onOpen: () => void;
}

function AppShortcut(props: AppShortcutProps) {
    return (
        <div
            className="flex flex-col max-w-[81px] gap-2 items-center justify-center app-shortcut"
            onDoubleClick={props.onOpen}
        >
            <Icon icon={props.icon} size={70}/>
            <p className={"max-w-full text-center overflow-hidden whitespace-normal text-ellipsis"}>{props.name}</p>
        </div>
    );
}

export default AppShortcut;