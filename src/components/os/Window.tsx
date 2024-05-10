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
    titleBarColor: string;
    titleBarIcon: IconName;
    onWidthChange: (width: number) => void;
    onHeightChange: (height: number) => void;
}
function Window(props: WindowProps) {
    const [isFocused, setIsFocused] = React.useState(false);
    const [isMaximized, setIsMaximized] = React.useState(false);

    const windowRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

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
        // check for a change in position
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
        if (x < -width + 102) x = -width + 102;
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
            height: window.innerHeight - 58,
        });
        setIsMaximized(true);
    }

    return (
        <div
            className={`flex flex-col bg-white absolute  divide-y-3 divide-black
                ${isMaximized ? 'rounded-none' : 'rounded-xl shadow-window border-3  border-black'}`}
            style={{
                width: currentWindowDimensions.width,
                height: currentWindowDimensions.height,
                top: currentWindowDimensions.y,
                left: currentWindowDimensions.x,
            }}
            ref={windowRef}
        >
            <div
                className="titleBar flex flex-row h-[36px] w-full justify-between rounded-t-[8px] px-4"
                style={{backgroundColor: props.titleBarColor}}
            >
                <div
                    className="left-titleBar text-lg text-black font-bold flex w-full flex-row items-center gap-2"
                    onMouseDown={startDrag}
                >
                    <Icon icon={props.titleBarIcon} size={24}/>
                    <span className={"select-none"}>{props.title}</span>
                </div>
                <div className="flex items-center right-titleBar">
                    <div className="flex gap-2 items-center">
                        <button
                            className="w-5 h-5 border-2 border-black rounded-full flex items-center justify-center bg-[#c5e351]"
                            onClick={props.minimizeWindow}
                        >
                        </button>
                        <button
                            className="w-5 h-5 border-2 border-black rounded-full flex items-center justify-center hover:cursor-pointer bg-[#FEED5C]"
                            onClick={maximizeHandler}
                        >
                        </button>
                        <button
                            className="w-5 h-5 border-2 border-black rounded-full flex items-center justify-center bg-[#fd89c2]"
                            onClick={props.closeWindow}
                        >
                        </button>
                    </div>
                </div>
            </div>
            <section>

            </section>
        </div>
    );
}

export default Window;