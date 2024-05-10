import {IconName} from "@/assets/icons";
import React from "react";

declare type ApplicationProps = {
    onClose: () => void;
    onMinimize: () => void;
    onMaximize: () => void;
}

declare type ExtendedApplicationProps<T> = T & ApplicationProps;

declare type DesktopWindow = {
    zIndex: number;
    name: string;
    minimized: boolean;
    icon: IconName;
    component: React.ReactElement;
}

declare type DesktopWindows = {key
    [key: string]: DesktopWindow
}

declare type ApplicationType = {
    key: string;
    name: string;
    icon: IconName,
    component: React.ReactElement,

}