import React from 'react';
import getIcon, {IconName} from "@/assets/icons";
import Image from "next/image";

interface IconProps {
    icon: IconName;
    size?: number;
    className?: string;

}

function Icon(props: IconProps) {


    return (
        <div className={"flex items-center justify-center"}
            style={
            {
                width: props.size,
                height: '100%'
            }}
        >
            <Image
                className={props.className}
                src={getIcon(props.icon)}
                alt={props.icon}
            />
        </div>
    );
}

export default Icon;