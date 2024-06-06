import React from 'react';
import getIcon, { IconName } from "@/assets/icons";
import Image from "next/image";

interface IconProps {
    icon: IconName;
    size?: number;
    className?: string;
    colorize?: boolean | string;
}

function Icon(props: IconProps) {
    const { icon, size, className, colorize } = props;

    // Determine the icon color based on the `colorize` prop
    const iconColor = typeof colorize === 'boolean'
        ? (colorize ?  'var(--color-retro-dark)' : 'none')
        : (colorize || 'none');

    // Retrieve the icon component using the icon name
    const IconComponent = getIcon(icon);

    // Check if it's an SVG component
    const isSvg = typeof IconComponent === 'function';

    return (
        <div className={`flex items-center justify-center ${className}`} style={{color: iconColor}} >
            {isSvg ? (
                <IconComponent width={size} height="100%" />
            ) : (
                <div className="h-fit w-fit">
                    <Image
                        className="select-none"
                        src={IconComponent}
                        alt={icon}
                        width={size}
                        draggable={false}
                    />
                </div>
            )}
        </div>
    );
}

export default Icon;
