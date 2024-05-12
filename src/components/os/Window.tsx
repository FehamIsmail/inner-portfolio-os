"use client"
import React, {useEffect, useRef} from 'react';
import Icon from "@/components/common/Icon";
import {ApplicationType} from "@/constants/types";

interface WindowProps {
    closeWindow: () => void;
    minimizeWindow: () => void;
    onInteract: () => void;
    application: ApplicationType;
    top: number;
    left: number;
}

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

function Window(props: WindowProps) {
    const [isFocused, setIsFocused] = React.useState(false);
    const [isMaximized, setIsMaximized] = React.useState(false);

    const windowRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const titleBarColor = titleBarColors[props.application.titleBarColor];

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

    const startResize = (e: React.MouseEvent) => {
        e.preventDefault()
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
        window.removeEventListener('mousemove', onResize, false);
        window.removeEventListener('mouseup', stopResize, false);
    }

    const startDrag = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const {clientX, clientY} = e;
        dragCoords.current = {
            dragStartX: clientX,
            dragStartY: clientY,
        };
        window.addEventListener('mousemove', onDrag, false);
        window.addEventListener('mouseup', stopDrag, false);
    }

    const onDrag = (e: MouseEvent) => {
        const { x, y } = getRealCoords(e.clientX, e.clientY);
        // Check for a change in position
        if (x === currentWindowDimensions.x && y === currentWindowDimensions.y) return;
        const { width, height } = isMaximized ? prevWindowDimensions : currentWindowDimensions;
        setCurrentWindowDimensions({ x: x + getOffsetX() , y, width, height });
        setIsMaximized(false)
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

    const stopDrag = ({ clientX, clientY }: MouseEvent) => {
        if(!windowRef.current) return
        let { x, y } = getRealCoords(clientX, clientY);
        // Get Window dimensions
        const { width } = windowRef.current.getBoundingClientRect();
        // Add boundary checks
        if (x + getOffsetX() < -width + 110) x = -width + 110 - getOffsetX();
        if (y < 0) {
            maximizeWindow('DRAG')
            window.removeEventListener('mousemove', onDrag, false);
            window.removeEventListener('mouseup', stopDrag, false);
            return;
        }
        if (x > window.innerWidth - 102) x = window.innerWidth - 102;
        if (y > window.innerHeight - 100) y = window.innerHeight - 100;
        const { width: finalWidth, height: finalHeight } = isMaximized ? prevWindowDimensions : currentWindowDimensions;
        setCurrentWindowDimensions({ x: x + getOffsetX(), y, width:finalWidth, height:finalHeight });
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
        if(actionOrigin === 'BUTTON') setPrevWindowDimensions(currentWindowDimensions);
        setCurrentWindowDimensions({
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight - 40,
        });
        setIsMaximized(true);
    }

    useEffect(() => {
        if(windowRef.current && contentRef.current && !currentWindowDimensions.height && !currentWindowDimensions.width) {
            const { width, height } = windowRef.current.getBoundingClientRect();
            const { maxWidth, maxHeight } = { maxWidth: Math.max(width, MIN_WIDTH), maxHeight: Math.max(height, MIN_HEIGHT) };
            setCurrentWindowDimensions({ x: currentWindowDimensions.x, y: currentWindowDimensions.y, width: maxWidth, height: maxHeight });
            setPrevWindowDimensions({ x: currentWindowDimensions.x, y: currentWindowDimensions.y, width: maxWidth, height: maxHeight })
        }
    }, [contentRef, windowRef, currentWindowDimensions]);

    return (
        <div
            className={`flex flex-col bg-retro-white absolute  divide-y-3 divide-retro-dark border-3 rounded-lg border-retro-dark 
                ${isMaximized ? 'border-b-0  shadow-window-maximized' : 'shadow-window'}`}
            style={{
                width: currentWindowDimensions.width || MIN_WIDTH,
                height: currentWindowDimensions.height || MIN_HEIGHT,
                top: currentWindowDimensions.y,
                left: currentWindowDimensions.x,
            }}
            ref={windowRef}
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
                            onClick={props.minimizeWindow}
                        >
                        </button>
                        <button
                            className="w-4 h-4 border-3 border-retro-dark rounded-full flex items-center justify-center hover:cursor-pointer bg-[#FEED5C]"
                            onClick={maximizeHandler}
                        >
                        </button>
                        <button
                            className="w-4 h-4 border-3 border-retro-dark rounded-full flex items-center justify-center bg-[#fd89c2]"
                            onClick={props.closeWindow}
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
        </div>
    );
}

export default Window;