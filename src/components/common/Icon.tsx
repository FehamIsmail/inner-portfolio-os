import React from 'react';
import getIcon, {IconName} from "@/assets/icons";
import Image from "next/image";

interface IconProps {
    icon: IconName;
    size?: number;
    className?: string;
    colorize?: boolean;
}

function Icon(props: IconProps) {

    const iconStyle = {
        color: props.colorize ? 'var(--color-retro-dark)' : 'inherit',
    };

    // it is a svg if getIcon(iconName) returns a StaticImageData type object
    const IconComponent = getIcon(props.icon); // Retrieve the icon component using the icon name

    const isSvg = typeof IconComponent === 'function'; // Check if it's an SVG component

    return (
        <div className={"flex items-center justify-center"} style={iconStyle}>
            { isSvg ? (
                <IconComponent width={props.size} height={"100%"}  />
            ) : (
                <div className={props.className + " h-fit w-fit"}>
                    <Image
                        className={" select-none"}
                        style={iconStyle}
                        src={IconComponent}
                        alt={props.icon}
                        width={props.size}
                        draggable={false}
                    />
                </div>
            )}
        </div>
    );

}

export default Icon;