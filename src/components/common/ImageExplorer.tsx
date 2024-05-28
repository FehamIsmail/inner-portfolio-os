"use client"
import React from 'react';
import Image from "next/image";
import Icon from "@/components/common/Icon";

interface ImageExplorerProps {
    className?: string;
    images: string[];
}

const ImageExplorer = (props: ImageExplorerProps) => {
    const { images } = props;
    const [currentImage, setCurrentImage] = React.useState(0);

    const handleNext = () => {
        setCurrentImage((prev) => prev + 1);
    }

    const handlePrevious = () => {
        setCurrentImage((prev) => prev - 1);
    }


    return (
        <div className={`flex flex-col items-center ${props.className}`}>
            <div className="relative h-[500px] w-full">
                <Image
                    className={"rounded-md shadow-figure border-3 border-retro-dark"}
                    src={images[currentImage]}
                    alt={`Image ${currentImage}`}
                    layout="fill"
                    objectFit="contain"
                />
            </div>
            <div className="flex gap-4 mt-4">
                <button
                    onClick={handlePrevious}
                    disabled={currentImage === 0}
                    className="px-4 py-2 bg-retro-dark cursor-pointer text-white rounded-md"
                >
                    <Icon icon={"arrowLeft"} size={24} colorize={true} />
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentImage === images.length - 1}
                    className="px-4 py-2 bg-retro-dark cursor-pointer text-white rounded-md"
                >
                    <Icon icon={"arrowRight"} size={24} colorize={true} />
                </button>
            </div>
        </div>
    );
};

export default ImageExplorer;