"use client"
import React, {useCallback, useEffect, useRef} from 'react';
import Icon from "@/components/common/Icon";
import {ApplicationType} from "@/constants/types";
import {motion, useSpring} from "framer-motion"
import {WindowAnimationState} from "@/constants/enums";
import {getAnimationDuration, getOpacity, getScale} from "@/components/utils/AnimationUtils";
import useResizeObserver from "@react-hook/resize-observer";

const titleBarColors = {
    red: 'bg-retro-red',
    green: 'bg-retro-green',
    blue: 'bg-retro-blue',
    yellow: 'bg-retro-yellow',
}

export const MIN_WIDTH = 420;
export const MIN_HEIGHT = 220;

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

function Window(props: WindowProps) {
    const [firstRender, setFirstRender] = React.useState<boolean>(true);
    const [isMaximized, setIsMaximized] = React.useState<boolean>(false);
    const [isOverflown, setIsOverflown] = React.useState<boolean>(false);
    const {animationState, setAnimationState} = props;

    const windowRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollBarBorderRef = useRef<HTMLDivElement>(null);

    const titleBarColor = titleBarColors[props.application.titleBarColor];
    const scrollBarClassNames = " scrollbar scrollbar-thumb-retro-dark scrollbar-track-transparent scrollbar-corner-retro-dark scrollbar-track-rounded-none"

    const [currentWindowDimensions, setCurrentWindowDimensions] = React.useState<WindowDimensions>({
        x: props.left,
        y: props.top,
        width: props.application.width || MIN_WIDTH,
        height: props.application.height || MIN_HEIGHT,
    } as WindowDimensions);

    const [prevWindowDimensions, setPrevWindowDimensions] = React.useState<WindowDimensions>({
        x: props.left,
        y: props.top,
        width: props.application.width,
        height: props.application.height,
    } as WindowDimensions);

    const springOptions = { damping: 54, stiffness: 3000 }
    const motionX = useSpring(currentWindowDimensions.x, springOptions)
    const motionY = useSpring(currentWindowDimensions.y, springOptions)
    const motionWidth = useSpring(currentWindowDimensions.width, springOptions)
    const motionHeight = useSpring(currentWindowDimensions.height, springOptions)

    useResizeObserver(containerRef, () => {
        checkOverflow();
    });

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
        setCurrentWindowDimensions(
            {
                ...currentWindowDimensions,
                x: props.taskbarPos - currentWindowDimensions.width / 2,
                y: window.innerHeight - 140,
            }
        )
    }

    const revertWindow = () => {
        setCurrentWindowDimensions(prevWindowDimensions)
    }

    const repositionWindow = () => {
        setCurrentWindowDimensions(
            {
                ...currentWindowDimensions,
                x: (currentWindowDimensions.x + prevWindowDimensions.x) / 2,
                y: (currentWindowDimensions.y + prevWindowDimensions.y) / 2,
            }
        )
    }

    const checkOverflow = () => {
        const cont = containerRef.current;
        const scrollBarBorder = scrollBarBorderRef.current;
        if (cont && animationState !== WindowAnimationState.MINIMIZING) {
            setIsOverflown(cont.scrollHeight > cont.clientHeight);
            if (scrollBarBorder) {
                scrollBarBorder.style.height = `${cont.clientHeight}px`;
            }
        }
    };

    useEffect(() => {
        switch (animationState) {
            case WindowAnimationState.RESTORING:
                if(isMaximized) maximizeWindow('BUTTON')
                else revertWindow()
                break;
            case WindowAnimationState.MINIMIZING:
                animateMinimize()
                break;
            case WindowAnimationState.MINIMIZED:
                repositionWindow()
                break;
            default:
                return
        }
    }, [animationState, isMaximized]);

    useEffect(() => {
        if(!firstRender) return
        checkOverflow()
        if (contentRef.current && animationState === WindowAnimationState.OPENING) {
            setFirstRender(false);
            const contentRect = contentRef.current.getBoundingClientRect();
            const margin = statusBarHeight.value + titleBarHeight.value + 9;
            const { width, height } = {
                width: props.application.width || Math.max(contentRect.width + margin, MIN_WIDTH),
                height: props.application.height || Math.max(contentRect.height + margin, MIN_HEIGHT),
            }
            setCurrentWindowDimensions({
                ...currentWindowDimensions,
                width,
                height,
            });
            setPrevWindowDimensions({
                ...prevWindowDimensions,
                width,
                height,
            });
        }
    }, [firstRender, contentRef, animationState]);

    useEffect(() => {
        setMotionValues(currentWindowDimensions)
    }, [currentWindowDimensions, setMotionValues])

    return (
        <motion.div
            className={`flex flex-col bg-retro-white absolute divide-y-3 divide-retro-dark border-3 rounded-lg border-retro-dark 
                ${isMaximized && !(animationState === WindowAnimationState.MINIMIZING) ? 'border-b-0  shadow-window-maximized' : 'shadow-window'}`}
            animate={{
                scale: getScale(animationState, isMaximized, firstRender),
                opacity: getOpacity(animationState),
                transitionDuration: animationState === WindowAnimationState.RESTORING ? `20ms`: undefined,
            }}
            style={{
                x: motionX,
                y: motionY,
                width: motionWidth,
                height: motionHeight,
                transitionDuration: `${getAnimationDuration(animationState, isMaximized)}ms`,
            }}
            initial={
                {
                    scale: 0.8,
                    opacity: 0,
                }
            }
            ref={windowRef}
            onMouseDown={props.onInteract}
        >
            <div
                className={`titleBar flex flex-row ${titleBarHeight.className} w-full justify-between px-3 rounded-t-[4px] ${titleBarColor}`}
            >
                <div
                    className="left-titleBar text-md text-retro-dark font-bold flex w-full flex-row items-center gap-3"
                    onMouseDown={startDrag}
                >
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
            <section
                    className={`flex-grow flex flex-row
                    ${animationState === WindowAnimationState.RESTORING ||  animationState === WindowAnimationState.OPENING ? 
                    'overflow-hidden' : 'overflow-y-auto overflow-x-clip'} ${scrollBarClassNames}`}
                     ref={containerRef}>
                <props.application.component ref={contentRef}>
                    {props.application.children}
                </props.application.component>
                {isOverflown &&
                    <div
                        className={"absolute z-200 right-[16px] bg-retro-dark w-[3px] scrollbar-right-border"}
                        ref={scrollBarBorderRef}
                    />
                }
            </section>

            {!isMaximized &&
                <div className={`${statusBarHeight.className} select-none flex flex-row-reverse rounded-b-lg`}>
                    <button
                        className={`flex flex-row cursor-se-resize p-[2px] border-retro-dark h-full`}
                        onMouseDown={startResize}
                    >
                        <Icon className={'text-retro-background self-end'} icon={'resize'} size={12} colorize={true}/>
                    </button>
                </div>
            }
        </motion.div>
    );
}

export default Window;