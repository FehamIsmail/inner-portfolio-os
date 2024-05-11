"use client"
import React, {useRef} from 'react';
import {IconName} from "@/assets/icons";
import Icon from "@/components/common/Icon";

interface WindowProps {
    closeWindow: () => void;
    minimizeWindow: () => void;
    // onInteract: () => void;
    width: number;
    height: number;
    top: number;
    left: number;
    title: string;
    titleBarColor: 'red' | 'green' | 'blue' | 'yellow';
    titleBarIcon: IconName;
    onWidthChange: (width: number) => void;
    onHeightChange: (height: number) => void;
}

const titleBarColors = {
    red: 'bg-retro-red',
    green: 'bg-retro-green',
    blue: 'bg-retro-blue',
    yellow: 'bg-retro-yellow',
}

export const MAX_WIDTH = 520;
export const MAX_HEIGHT = 220;

function Window(props: WindowProps) {
    const [isFocused, setIsFocused] = React.useState(false);
    const [isMaximized, setIsMaximized] = React.useState(false);

    const windowRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const titleBarColor = titleBarColors[props.titleBarColor];

    const [currentWindowDimensions, setCurrentWindowDimensions] = React.useState({
        x: props.left,
        y: props.top,
        width: props.width,
        height: props.height,
    });

    const [prevWindowDimensions, setPrevWindowDimensions] = React.useState({
        x: props.left,
        y: props.top,
        width: props.width,
        height: props.height,
    });

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
        if (currentWidth >= MAX_WIDTH) currentWindowDimensions.width = currentWidth;
        if (currentHeight >= MAX_HEIGHT) currentWindowDimensions.height = currentHeight;
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

    return (
        <div
            className={`flex flex-col bg-retro-white absolute  divide-y-3 divide-retro-dark border-3 rounded-lg border-retro-dark 
                ${isMaximized ? 'border-b-0  shadow-window-maximized' : 'shadow-window'}`}
            style={{
                width: currentWindowDimensions.width,
                height: currentWindowDimensions.height,
                top: currentWindowDimensions.y,
                left: currentWindowDimensions.x,
            }}
            ref={windowRef}
        >
            <div
                className={`titleBar flex flex-row max-h-[34px] w-full justify-between px-3 rounded-t-[4px] ` + titleBarColor}
            >
                <div
                    className="left-titleBar text-md text-retro-dark font-bold flex w-full flex-row items-center gap-3"
                    onMouseDown={startDrag}
                >
                    <Icon className={""} icon={props.titleBarIcon} size={22}/>
                    <span className={"select-none"}>{props.title}</span>
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

            </section>
            {!isMaximized &&
                <div className={"h-[19px] select-none flex flex-row-reverse rounded-b-lg p-[2px]"}>
                    <button
                        className={"flex flex-row-reverse cursor-se-resize"}
                        onMouseDown={startResize}
                    >
                        <Icon icon={'resize'} size={12}/>
                    </button>
                </div>
            }
        </div>
    );
}

export default Window;