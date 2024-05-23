import React from 'react';
import Image from 'next/image';
interface ImageCaptionProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    layout?: 'contain' | 'cover'
    caption: string;
    count: number;
}

const ImageCaption = (props: ImageCaptionProps) => {

    return (
        <div>
            <div
                className={`w-full h-full flex flex-col items-center rounded-xl ${props.className}`}
            >
                <Image
                    src={props.src}
                    alt={props.alt}
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '100%', height: 'auto' }} // optional
                    className={`rounded-md shadow-figure border-3 border-retro-dark ${props.layout === 'contain' ? 'object-contain' : 'object-cover'}`}
                />
            </div>
            <p className="mt-2 text-sm text-center overflow-hidden whitespace-normal text-ellipsis line-clamp-1 ">
                <b>Figure {props.count}: </b>{props.caption}
            </p>
        </div>
    )
        ;
};

export default ImageCaption;