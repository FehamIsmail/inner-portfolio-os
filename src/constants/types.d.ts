import {IconName} from "@/assets/icons";
import React from "react";
import {WindowAnimationState} from "@/constants/enums";

declare type DesktopWindow = {
    zIndex: number;
    minimized: boolean;
    maximized: boolean;
    animationState: WindowAnimationState;
    application: ApplicationType;
}

declare type DesktopWindows = {key
    [key: string]: DesktopWindow
};

declare type ApplicationType = {
    key: string;
    name: string;
    icon: IconName;
    titleBarColor: 'red' | 'green' | 'blue' | 'yellow';
    component: React.ForwardRefExoticComponent<T & React.RefAttributes<HTMLDivElement>>;
    children?: React.ReactNode; // Used in MyPortfolioLayout to handle routing
    props?: any;
    width?: number;
    height?: number;
};