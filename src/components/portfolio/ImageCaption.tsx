import React from 'react';
import Image from 'next/image';
interface ImageCaptionProps {
    src: string;
    alt: string;
    caption: string;
}

const ImageCaption = (props: ImageCaptionProps) => {

    return (
        <div className="flex flex-col items-center">
            <Image src={props.src} alt={props.alt} fill={true} />
            <p className="text-sm text-center">{props.caption}</p>
        </div>
    );
};

export default ImageCaption;