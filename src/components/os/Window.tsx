"use client"
import React, {useCallback, useEffect, useRef} from 'react';
import Icon from "@/components/common/Icon";
import {ApplicationType} from "@/constants/types";
import {motion, useSpring} from "framer-motion"
import {WindowAnimationState} from "@/constants/enums";

interface WindowProps {
    onClose: () => void;
    onMinimize: () => void;
    onInteract: () => void;
    animationState: WindowAnimationState;
    setAnimationState: (state: WindowAnimationState) => void;
    application: ApplicationType;
    top: number;
    left: number;
    taskbarPos: number;
}

const titleBarColors = {
    red: 'bg-retro-red',
    green: 'bg-retro-green',
    blue: 'bg-retro-blue',
    yellow: 'bg-retro-yellow',
}

export const MIN_WIDTH = 420;
export const MIN_HEIGHT = 220;
export const WINDOW_ANIMATION_DURATION = 180;

const titleBarHeight = {
    value: 24,
    className: 'max-h-[24px]',
};

const statusBarHeight = {
    value: 20,
    className: 'h-[20px]',
};

interface WindowDimensions {
    x: number;
    y: number;
    width: number;
    height: number;
}

function Window(props: WindowProps) {
    const [firstLoad, setFirstLoad] = React.useState<boolean>(true);
    const [isMaximized, setIsMaximized] = React.useState<boolean>(false);
    const {animationState, setAnimationState} = props;

    const windowRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const titleBarColor = titleBarColors[props.application.titleBarColor];

    const springOptions = { damping: 50, stiffness: 2000 }
    const motionX = useSpring(0, springOptions)
    const motionY = useSpring(0, springOptions)
    const motionWidth = useSpring(0, springOptions)
    const motionHeight = useSpring(0, springOptions)

    const [currentWindowDimensions, setCurrentWindowDimensions] = React.useState<WindowDimensions>({
        x: props.left,
        y: props.top,
        width: props.application.width,
        height: props.application.height,
    } as WindowDimensions);

    const [prevWindowDimensions, setPrevWindowDimensions] = React.useState<WindowDimensions>({
        x: props.left,
        y: props.top,
        width: props.application.width,
        height: props.application.height,
    } as WindowDimensions);

    const dragCoords = useRef<{
        dragStartX: any,
        dragStartY: any,
    }>()

    const setMotionValues = useCallback((values: WindowDimensions) => {
        motionX.set(values.x)
        motionY.set(values.y)
        motionWidth.set(values.width || MIN_WIDTH)
        motionHeight.set(values.height || MIN_HEIGHT)
    }, [motionX, motionY, motionWidth, motionHeight])

    const startResize = (e: React.MouseEvent) => {
        e.preventDefault()
        setAnimationState(WindowAnimationState.RESIZING)
        window.addEventListener('mousemove', onResize, false);
        window.addEventListener('mouseup', stopResize, false);
    }

    const onResize = ({ clientX, clientY }: MouseEvent) => {
        const currentWidth = clientX - currentWindowDimensions.x;
        const currentHeight = clientY - currentWindowDimensions.y;
        if (currentWidth >= MIN_WIDTH) currentWindowDimensions.width = currentWidth;
        if (currentHeight >= MIN_HEIGHT) currentWindowDimensions.height = currentHeight;
        setCurrentWindowDimensions({...currentWindowDimensions});
    }

    const stopResize = () => {
        setPrevWindowDimensions(currentWindowDimensions)
        setAnimationState(WindowAnimationState.VISIBLE)
        window.removeEventListener('mousemove', onResize, false);
        window.removeEventListener('mouseup', stopResize, false);
    }

    const getOffsetX = () => {
        let offsetX = 0;
        if(isMaximized) {
            const startX = dragCoords.current?.dragStartX;
            const prevWidth = prevWindowDimensions.width;
            if(startX >= prevWidth / 2 && startX <= window.innerWidth - prevWidth / 2)
                offsetX = startX - prevWidth / 2;
            else if(startX >= window.innerWidth - prevWidth / 2)
                offsetX = window.innerWidth - prevWidth;
        }
        return offsetX;
    }

    const startDrag = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        props.onInteract();
        const {clientX, clientY} = e;
        dragCoords.current = {
            dragStartX: clientX,
            dragStartY: clientY,
        };
        setAnimationState(WindowAnimationState.DRAGGING)
        window.addEventListener('mousemove', onDrag, false);
        window.addEventListener('mouseup', stopDrag, false);
    }

    const onDrag = (e: MouseEvent) => {
        const { x, y } = getRealCoords(e.clientX, e.clientY);
        // Check for a change in position
        if (x === currentWindowDimensions.x && y === currentWindowDimensions.y) return;
        const { width, height } = isMaximized ? prevWindowDimensions : currentWindowDimensions;
        const isGettingMaximized = y < 0;
        setCurrentWindowDimensions({
            x: isGettingMaximized ? 0 : x + getOffsetX(),
            y: isGettingMaximized ? 0 : y,
            width: isGettingMaximized ? window.innerWidth : width,
            height: isGettingMaximized ? window.innerHeight - 40 : height
        });
        setIsMaximized(isGettingMaximized)
    }

    const stopDrag = ({ clientX, clientY }: MouseEvent) => {
        if(!windowRef.current) return
        let { x, y } = getRealCoords(clientX, clientY);
        // Get Window dimensions
        const { width } = windowRef.current.getBoundingClientRect();
        // Add boundary checks
        if (x + getOffsetX() < -width + 145) x = -width + 145 - getOffsetX();
        if (y < 0) {
            maximizeWindow('DRAG')
            window.removeEventListener('mousemove', onDrag, false);
            window.removeEventListener('mouseup', stopDrag, false);
            setAnimationState(WindowAnimationState.VISIBLE)
            return;
        }
        if (x > window.innerWidth - 102) x = window.innerWidth - 102;
        if (y > window.innerHeight - 100) y = window.innerHeight - 100;
        const { width: finalWidth, height: finalHeight } = isMaximized ? prevWindowDimensions : currentWindowDimensions;
        setCurrentWindowDimensions({ x: x + getOffsetX(), y, width:finalWidth, height:finalHeight });
        setPrevWindowDimensions({ ...prevWindowDimensions, x: x + getOffsetX(), y });
        setAnimationState(WindowAnimationState.VISIBLE)
        window.removeEventListener('mousemove', onDrag, false);
        window.removeEventListener('mouseup', stopDrag, false);
    }

    const getRealCoords = (clientX: number, clientY: number): {x: number, y: number} => {
        if(!dragCoords.current) return {x: 0, y: 0}
        const { dragStartX, dragStartY } = dragCoords.current;
        return {
            x: clientX - dragStartX + currentWindowDimensions.x,
            y: clientY - dragStartY + currentWindowDimensions.y,
        }
    }

    const maximizeHandler = () => {
        if (isMaximized) {
            setCurrentWindowDimensions(prevWindowDimensions);
            setIsMaximized(false);
        } else {
            maximizeWindow('BUTTON')
        }
    }
    const maximizeWindow = (actionOrigin: 'DRAG' | 'BUTTON') => {
        setIsMaximized(true);
        if(actionOrigin === 'BUTTON') setPrevWindowDimensions(currentWindowDimensions);
        setCurrentWindowDimensions({
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight - 40,
        });
    }

    const animateMinimize = () => {
        setAnimationState(WindowAnimationState.MINIMIZING)
        setCurrentWindowDimensions(
            {
                x: -40,
                y: window.innerHeight - 60,
                width: 200,
                height: 100,
            }
        )
    }

    const revertWindow = () => {
        setCurrentWindowDimensions(prevWindowDimensions)
    }

    const getScale = () => {
        const scale = 1.05;
        if (animationState === WindowAnimationState.MINIMIZING) return 0.2;
        if (animationState === WindowAnimationState.MINIMIZED) return 0;
        if (animationState === WindowAnimationState.RESTORING) return 0;
        if (animationState === WindowAnimationState.DRAGGING && !isMaximized) return scale;
        if (animationState === WindowAnimationState.RESIZING) return 1
        return 1;
    }

    useEffect(() => {
        console.log('Animation State', animationState)
        if (animationState === WindowAnimationState.VISIBLE ||
            animationState === WindowAnimationState.MINIMIZED
        ) return;

    }, [animationState]);

    useEffect(() => {
        if(windowRef.current && contentRef.current && !currentWindowDimensions.height && !currentWindowDimensions.width && firstLoad) {
            const { width, height } = windowRef.current.getBoundingClientRect();
            const { maxWidth, maxHeight } = { maxWidth: Math.max(width, MIN_WIDTH), maxHeight: Math.max(height, MIN_HEIGHT) };
            console.log(maxHeight, maxWidth)
            setCurrentWindowDimensions({ x: props.left, y: props.top, width: maxWidth, height: maxHeight });
            setPrevWindowDimensions({ x: props.left, y: props.top, width: maxWidth, height: maxHeight })
            setFirstLoad(false);
        }
    }, [contentRef, windowRef, currentWindowDimensions, firstLoad, props.left, props.top]);

    useEffect(() => {
        setMotionValues(currentWindowDimensions)
    }, [currentWindowDimensions, setMotionValues])

    useEffect(() => {
        console.log('X position', props.taskbarPos)
    }, [props.taskbarPos]);

    return (
        <div>
        <motion.div
            className={`flex flex-col bg-retro-white absolute  divide-y-3 divide-retro-dark border-3 rounded-lg border-retro-dark 
                ${isMaximized && !(animationState === WindowAnimationState.MINIMIZING) ? 'border-b-0  shadow-window-maximized' : 'shadow-window'}`}
            animate={{
                scale: getScale(),
                opacity: 1,
            }}
            style={{
                x: motionX,
                y: motionY,
                width: motionWidth,
                height: motionHeight,
            }}
            ref={windowRef}
            onMouseDown={props.onInteract}
        >
            <div
                className={`titleBar flex flex-row ${titleBarHeight.className} w-full justify-between px-3 rounded-t-[4px] ` + titleBarColor}
            >
                <div
                    className="left-titleBar text-md text-retro-dark font-bold flex w-full flex-row items-center gap-3"
                    onMouseDown={startDrag}
                >
                    {/*<Icon className={""} icon={props.application.icon} size={22}/>*/}
                    <span className={"select-none"}>{props.application.name}</span>
                </div>
                <div className="flex items-center right-titleBar">
                    <div className="flex gap-4 items-center">
                        <button
                            className="w-4 h-4 border-3 border-retro-dark rounded-full flex items-center justify-center bg-[#c5e351]"
                            onClick={props.onMinimize}
                        >
                        </button>
                        <button
                            className="w-4 h-4 border-3 border-retro-dark rounded-full flex items-center justify-center hover:cursor-pointer bg-[#FEED5C]"
                            onClick={maximizeHandler}
                        >
                        </button>
                        <button
                            className="w-4 h-4 border-3 border-retro-dark rounded-full flex items-center justify-center bg-[#fd89c2]"
                            onClick={props.onClose}
                        >
                        </button>
                    </div>
                </div>
            </div>
            <section className={'h-full'}>
                <div
                    className={"h-full"}
                    ref={contentRef}
                >
                    <props.application.component />
                </div>
            </section>
            {!isMaximized &&
                <div className={`${statusBarHeight.className} select-none flex flex-row-reverse rounded-b-lg p-[2px]`}>
                    <button
                        className={"flex flex-row cursor-se-resize"}
                        onMouseDown={startResize}
                    >
                        <Icon className={'self-end'} icon={'resize'} size={12}/>
                    </button>
                </div>
            }
        </motion.div>
        </div>
    );
}

export default Window;