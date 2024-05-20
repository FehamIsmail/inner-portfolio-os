import {IconName} from "@/assets/icons";
import React from "react";

declare type DesktopWindow = {
    zIndex: number;
    minimized: boolean;
    animationState: WindowAnimationState;
    application: ApplicationType;
}

declare type DesktopWindows = {key
    [key: string]: DesktopWindow
}

declare type ApplicationType = {
    key: string;
    name: string;
    icon: IconName;
    titleBarColor: 'red' | 'green' | 'blue' | 'yellow';
    component: React.ForwardRefExoticComponent<React.RefAttributes<HTMLDivElement>>;
    width?: number;
    height?: number;
};