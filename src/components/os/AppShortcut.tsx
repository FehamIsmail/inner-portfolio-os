import React from 'react';
import {IconName} from "@/assets/icons";

export interface AppShortcutProps {
    icon: IconName;
    name: string;
    onOpen: () => void;
}

function AppShortcut(props: AppShortcutProps) {
    return (
        <div></div>
    );
}

export default AppShortcut;