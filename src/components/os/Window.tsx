"use client"
import React, {useCallback, useEffect, useRef} from 'react';
import Icon from "@/components/common/Icon";
import {ApplicationType} from "@/constants/types";
import {motion, useSpring} from "framer-motion"
import {WindowAnimationState} from "@/constants/enums";
import {getAnimationDuration, getOpacity, getScale} from "@/components/utils/AnimationUtils";
import useResizeObserver from "@react-hook/resize-observer";
import {usePathname} from "next/navigation";

const titleBarColors = {
    red: 'bg-retro-red',
    green: 'bg-retro-green',
    blue: 'bg-retro-blue',
    yellow: 'bg-retro-yellow',
}

export const MIN_WIDTH = 420;
export const MIN_HEIGHT = 180;

const titleBarHeight = {
    value: 24,
    className: 'max-h-[24px]',
};

const statusBarHeight = {
    value: 20,
    className: 'min-h-[20px]',
};

interface WindowDimensions {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface WindowProps {
    top: number;
    left: number;
    onClose: () => void;
    onMinimize?: () => void;
    onInteract: () => void;
    animationState: WindowAnimationState;
    setAnimationState: (state: WindowAnimationState) => void;
    application: ApplicationType;
    taskbarPos: number;
    isModal?: boolean;
}

function Window(props: WindowProps) {
    const [firstRender, setFirstRender] = React.useState<boolean>(true);
    const [sizeInitialized, setSizeInitialized] = React.useState<boolean>(false);
    const [isMaximized, setIsMaximized] = React.useState<boolean>(false);
    const [isOverflowing, setIsOverflowing] = React.useState<boolean>(false);
    const {animationState, setAnimationState} = props;
    const navigation = usePathname();

    const windowRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollBarBorderRef = useRef<HTMLDivElement>(null);
    const scrollBarClassNames = "scrollbar scrollbar-thumb-retro-dark scrollbar-track-transparent scrollbar-corner-retro-dark scrollbar-track-rounded-none"

    const titleBarColor = titleBarColors[props.application.titleBarColor];

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
    const motionScale = useSpring(0.6, springOptions)

    useResizeObserver(containerRef, () => {
        checkOverflow();
    });

    const dragCoords = useRef<{
        dragStartX: any,
        dragStartY: any,
    }>()

    const setMotionValues = useCallback((values: WindowDimensions) => {
        if ((animationState === WindowAnimationState.DRAGGING ||
            animationState === WindowAnimationState.RESIZING)
            && !isMaximized) {
            motionX.jump(values.x, true);
            motionY.jump(values.y, true);
            motionWidth.jump(values.width || MIN_WIDTH, true);
            motionHeight.jump(values.height || MIN_HEIGHT, true);
        } else {
            motionX.set(values.x);
            motionY.set(values.y);
            motionWidth.set(values.width || MIN_WIDTH);
            motionHeight.set(values.height || MIN_HEIGHT);
        }
    }, [motionX, motionY, motionWidth, motionHeight, animationState, isMaximized]);

    const checkOverflow = useCallback(() => {
        if(props.application.resizable === false) return
        const cont = containerRef.current;
        const scrollBarBorder = scrollBarBorderRef.current;
        if (cont && animationState !== WindowAnimationState.MINIMIZING) {
            setIsOverflowing(cont.scrollHeight > cont.clientHeight);
            if (scrollBarBorder) {
                scrollBarBorder.style.height = `${cont.clientHeight}px`;
            }
        }
    }, [containerRef, scrollBarBorderRef, animationState]);

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
        if (!(e.buttons & 1)) { // Check if the left mouse button is not pressed
            stopDrag(e);
            return;
        }
        const { x, y } = getRealCoords(e.clientX, e.clientY);
        // Check for a change in position
        if (x === currentWindowDimensions.x && y === currentWindowDimensions.y) return;
        const { width, height } = isMaximized ? prevWindowDimensions : currentWindowDimensions;
        const isGettingMaximized = props.application.resizable === false ? false : y < 0;
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
        if (y < 0 && (props.application.resizable !== false)) {
            maximizeWindow('DRAG')
            window.removeEventListener('mousemove', onDrag, false);
            window.removeEventListener('mouseup', stopDrag, false);
            setAnimationState(WindowAnimationState.VISIBLE)
            return;
        }
        if (x > window.innerWidth - 102) x = window.innerWidth - 102;
        if (y > window.innerHeight - 100) y = window.innerHeight - 100;
        if (y < 0) y = 0;
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
        if(props.application.resizable === false) return
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
        setCurrentWindowDimensions({
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
        setCurrentWindowDimensions({
                ...currentWindowDimensions,
                x: (currentWindowDimensions.x + prevWindowDimensions.x) / 2,
                y: (currentWindowDimensions.y + prevWindowDimensions.y) / 2,
            }
        )
    }

    useEffect(() => {
        switch (animationState) {
            case WindowAnimationState.OPENING:
                setCurrentWindowDimensions(prevWindowDimensions)
                break;
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
            case WindowAnimationState.INITIALIZING:
                setTimeout(() => {
                    setAnimationState(WindowAnimationState.VISIBLE);
                }, 400);
                break;
            default:
                break;
        }
        motionScale.set(getScale(animationState, isMaximized, firstRender));
    }, [animationState, isMaximized, firstRender, motionScale]);

    useEffect(() => {
        if(!firstRender || !contentRef.current) return
        checkOverflow()
        if (animationState === WindowAnimationState.OPENING) {
            setFirstRender(false);
            const { width, height } = {
                width: props.application.width ||  MIN_WIDTH,
                height: props.application.height || (props.isModal ? 50 : MIN_HEIGHT),
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
            if(props.application.width && props.application.height)
                setSizeInitialized(true);
        }
    }, [firstRender, contentRef, animationState]);

    useEffect(() => {
        if(!contentRef.current) return
        if(!sizeInitialized && animationState === WindowAnimationState.VISIBLE) {
            setAnimationState(WindowAnimationState.INITIALIZING)
            const { clientWidth, clientHeight } = contentRef.current;
            const margin = titleBarHeight.value + (props.isModal ? 0 : statusBarHeight.value) + 8;
            if (!props.application.width){
                setCurrentWindowDimensions({...currentWindowDimensions, width: clientWidth + margin});
                setPrevWindowDimensions({...prevWindowDimensions, width: clientWidth + margin})
            }
            if (!props.application.height){
                setCurrentWindowDimensions({...currentWindowDimensions, height: clientHeight + margin});
                setPrevWindowDimensions({...prevWindowDimensions, height: clientHeight + margin})
            }
            setSizeInitialized(true)
        }
    }, [sizeInitialized, contentRef, animationState]);

    useEffect(() => {
        setMotionValues(currentWindowDimensions)
    }, [currentWindowDimensions, setMotionValues])

    useEffect(() => {
        checkOverflow()
    }, [checkOverflow, navigation]);

    return (
        <motion.div
            className={`flex flex-col bg-retro-white absolute divide-y-3 divide-retro-dark border-3 rounded-lg border-retro-dark 
            ${isMaximized && !(animationState === WindowAnimationState.MINIMIZING) ? 'border-b-0  shadow-window-maximized' : 'shadow-window'}`}
            animate={{
                opacity: getOpacity(animationState),
                transitionDuration: animationState === WindowAnimationState.RESTORING ? `20ms` : undefined,
            }}
            style={{
                x: motionX,
                y: motionY,
                width: motionWidth,
                height: motionHeight,
                scale: motionScale,
                transitionDuration: `${getAnimationDuration(animationState, isMaximized)}ms`,
            }}
            initial={{
                scale: 0.6,
                opacity: 0.1,
            }}
            ref={windowRef}
            onMouseDown={props.onInteract}
        >
            <div
                className={`titleBar flex flex-row ${titleBarHeight.className} w-full justify-between px-[6px] rounded-t-[4px] ${titleBarColor}`}
            >
                <div
                    className="left-titleBar text-md text-retro-dark font-bold flex w-full flex-row items-center gap-3"
                    onMouseDown={startDrag}
                >
                    <span className={"select-none"}>{props.application.name}</span>
                </div>
                <div className="flex items-center right-titleBar">
                    <div className="flex gap-2 items-end">
                        {props.application.resizable !== false &&
                            <div
                                className="flex-grow justify-center hover:cursor-pointer pb-[1px]"
                                onClick={props.onMinimize}
                            >
                                <Icon className={"pt-[14px] pb-[3px] px-[4px]"} icon={'minimize'} size={13} colorize={true}/>
                            </div>
                        }
                        {props.application.resizable !== false &&
                            <div
                                className="flex items-center justify-center hover:cursor-pointer"
                                onClick={maximizeHandler}
                            >
                                <Icon className={"p-[4px]"}
                                      icon={isMaximized ? 'restoreDown' : 'maximize'}
                                      size={13}
                                      colorize={true}/>
                            </div>
                        }
                        <div
                            className="flex items-center justify-center hover:cursor-pointer"
                            onClick={props.onClose}
                        >
                            <Icon className={"p-[4px]"} icon={'close'} size={11} colorize={true}/>
                        </div>
                    </div>
                </div>
            </div>
            <section
                className={`flex-grow flex flex-row ${scrollBarClassNames} ${(
                    animationState === WindowAnimationState.RESTORING || 
                    animationState === WindowAnimationState.OPENING || 
                    animationState === WindowAnimationState.INITIALIZING ||
                    props.application.resizable === false ||
                    !sizeInitialized 
                ) ?
                    'overflow-hidden' : 'overflow-y-auto overflow-x-clip'}`}
                ref={containerRef}
            >
                <props.application.component ref={contentRef} {...props.application.props}>
                    {props.application.children}
                </props.application.component>
                {(
                    isOverflowing &&
                    animationState !== WindowAnimationState.INITIALIZING &&
                    animationState !== WindowAnimationState.OPENING &&
                    sizeInitialized
                ) &&
                    <div
                        className={"absolute z-200 right-[16px] bg-retro-dark w-[3px] scrollbar-right-border"}
                        ref={scrollBarBorderRef}
                    />
                }
            </section>

            {(!isMaximized && !props.isModal) &&
                <div className={`${statusBarHeight.className} select-none flex flex-row-reverse rounded-b-lg ${props.application.resizable !== false ? '' : 'bg-retro-medium'}`}>
                    {props.application.resizable !== false &&
                        <button
                            className={`flex flex-row cursor-se-resize p-[2px] border-retro-dark h-full`}
                            onMouseDown={startResize}
                        >
                            <Icon className={'text-retro-background self-end'} icon={'resize'} size={12}
                                  colorize={true}/>
                        </button>}
                </div>
            }
        </motion.div>
    );
}

export default Window;