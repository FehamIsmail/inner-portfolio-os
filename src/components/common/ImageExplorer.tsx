"use client";
import React from "react";
import Image from "next/image";
import Icon from "@/components/common/Icon";

interface ImageExplorerProps {
  className?: string;
  style?: React.CSSProperties;
  images: {
    name: string;
    src: string;
  }[];
  height?: number;
  width?: number;
}

const ImageExplorer = (props: ImageExplorerProps) => {
  const { images, height, width } = props;
  const [currentImage, setCurrentImage] = React.useState(0);

  const handleNext = () => {
    setCurrentImage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentImage((prev) => prev - 1);
  };

  const canGoNext = () => {
    return currentImage < images.length - 1;
  };

  const canGoPrevious = () => {
    return currentImage > 0;
  };

  return (
    <div
      className={`flex flex-col rounded-md  border-3 border-retro-dark w-fit divide-y-3 bg-white divide-retro-dark items-center ${props.className}`}
      style={props.style}
    >
      <div className={"title-bar bg-retro-medium text-center w-full"}>
        {images[currentImage].name}
      </div>
      <div
        className="relative h-fit w-fit"
        style={{
          height: height ? `${height}px` : "100%",
          width: width ? `${width}px` : "100%",
        }}
      >
        <Image
          src={images[currentImage].src}
          alt={`Image ${currentImage}`}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex gap-6 w-full py-1 flex-row bg-retro-medium justify-center">
        <button
          onClick={handlePrevious}
          disabled={currentImage === 0}
          className="px-1 py-1 cursor-pointer text-white rounded-md"
        >
          <Icon
            icon={"arrowLeft"}
            size={36}
            colorize={canGoPrevious() ? true : "var(--color-retro-semi-dark)"}
          />
        </button>
        <button
          onClick={handleNext}
          disabled={currentImage === images.length - 1}
          className="px-1 py-1 cursor-pointer text-white rounded-md"
        >
          <Icon
            icon={"arrowRight"}
            size={36}
            colorize={canGoNext() ? true : "var(--color-retro-semi-dark)"}
          />
        </button>
      </div>
    </div>
  );
};

export default ImageExplorer;
