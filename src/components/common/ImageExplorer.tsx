"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";
import Icon from "@/components/common/Icon";

type ImageSource = string | StaticImageData;

interface ImageExplorerProps {
  className?: string;
  style?: React.CSSProperties;
  images: {
    name: string;
    src?: string;
    image?: StaticImageData;
  }[];
  height?: number;
  width?: number;
}

const ImageExplorer = (props: ImageExplorerProps) => {
  const { images, height, width } = props;
  const [currentImage, setCurrentImage] = React.useState(0);

  const handleNext = () => setCurrentImage((prev) => prev + 1);
  const handlePrevious = () => setCurrentImage((prev) => prev - 1);
  const canGoNext = () => currentImage < images.length - 1;
  const canGoPrevious = () => currentImage > 0;

  const getImageSource = (image: (typeof images)[0]): ImageSource => {
    return image.image || image.src || "";
  };

  const isStaticImage = (src: ImageSource): src is StaticImageData => {
    return typeof src === "object" && src !== null && "src" in src;
  };

  const imageWidth = width || 500;
  const imageHeight = height || 300;

  return (
    <div
      className={`flex flex-col rounded-md border-3 border-retro-dark divide-y-3 bg-white divide-retro-dark items-center ${props.className}`}
      style={{
        maxWidth: imageWidth,
        width: "100%",
        ...props.style,
      }}
    >
      <div className="title-bar bg-retro-medium text-center w-full">
        {images[currentImage].name}
      </div>
      <div className="relative w-full">
        <Image
          src={getImageSource(images[currentImage])}
          alt={`Image ${currentImage}`}
          width={imageWidth}
          height={imageHeight}
          style={{
            width: "100%",
            height: "auto",
          }}
          priority={currentImage === 0}
        />
      </div>
      <div className="flex gap-6 w-full py-1 flex-row bg-retro-medium justify-center">
        <button
          onClick={handlePrevious}
          disabled={currentImage === 0}
          className="px-1 py-1 cursor-pointer text-white rounded-md"
        >
          <Icon
            icon="arrowLeft"
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
            icon="arrowRight"
            size={36}
            colorize={canGoNext() ? true : "var(--color-retro-semi-dark)"}
          />
        </button>
      </div>
    </div>
  );
};

export default ImageExplorer;
