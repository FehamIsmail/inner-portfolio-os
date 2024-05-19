import React from 'react';
import {motion} from 'framer-motion';
import Icon from "@/components/common/Icon";

interface ScrollBarProps {
    scrollWidth: number;
    scrollPosition: number;
    setScrollPosition: (position: number) => void;
}
function ScrollBar(props: ScrollBarProps) {
    const { scrollWidth, scrollPosition, setScrollPosition } = props;
    const scrollButtonSize = scrollWidth

    const animationStyle = {
        width: props.scrollWidth,
    }

    return (
        <div className={"ml-auto"}>
            <motion.div
                className={"flex flex-col justify-between h-full border-l-3 border-retro-dark"}
                style={animationStyle}
                initial={{width: 0}}
                animate={{width: scrollWidth}}
                exit={{width: 0}}
                transition={{duration: 0.1}}
            >
                <button className={"cursor-default mb-[1px] border-b-3 border-retro-dark active:bg-retro-background outline-none"}
                    style={{height: scrollButtonSize + 1}}
                >
                    <Icon icon={'arrowUp'} colorize={true} size={9} className={"pr-1"}/>
                </button>
                <div className={"thumb"}>

                </div>
                <button className={"cursor-default mt-[1px] border-t-3 border-retro-dark active:bg-retro-background outline-none"}
                    style={{height: scrollButtonSize + 1}}
                >
                    <Icon icon={'arrowDown'} colorize={true} size={9} className={"pr-1"}/>
                </button>
            </motion.div>
        </div>
    );
}

export default ScrollBar;