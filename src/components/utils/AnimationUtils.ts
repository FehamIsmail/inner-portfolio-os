import {WindowAnimationState} from "@/constants/enums";


export const WINDOW_ANIMATION_DURATION = 200;


export const getScale = (animationState: WindowAnimationState, isMaximized: boolean, firstLoad: boolean) => {
    if(firstLoad) return 0;
    const scale = 1.05;
    switch (animationState) {
        case WindowAnimationState.OPENING:
            return 1;
        case WindowAnimationState.MINIMIZING:
            return 0;
        case WindowAnimationState.MINIMIZED:
            return 0.82;
        case WindowAnimationState.RESTORING:
            return 1;
        case WindowAnimationState.DRAGGING:
            if(isMaximized) return 1;
            return scale;
        case WindowAnimationState.RESIZING:
            return 1;
        case WindowAnimationState.CLOSING:
            return 0;
        default:
            return 1;
    }
}

export const getOpacity = (animationState: WindowAnimationState) => {
    switch (animationState) {
        case WindowAnimationState.MINIMIZING:
            return 0;
        case WindowAnimationState.MINIMIZED:
            return 0.2;
        case WindowAnimationState.RESTORING:
            return 1;
        case WindowAnimationState.CLOSING:
            return 0;
        default:
            return 1;
    }
}

export const getAnimationDuration = (animationState: WindowAnimationState, isMaximized: boolean) => {
    if(isMaximized && animationState === WindowAnimationState.VISIBLE) return 60;
    switch (animationState) {
        case WindowAnimationState.MINIMIZING:
            return 200;
        case WindowAnimationState.MINIMIZED:
            return 60;
        case WindowAnimationState.DRAGGING:
            if(isMaximized) return 60;
            return 0;
        case WindowAnimationState.RESTORING:
            return 400;
        case WindowAnimationState.CLOSING:
            return 200;
        case WindowAnimationState.OPENING:
            return 0;
        default:
            return 0;
    }
}