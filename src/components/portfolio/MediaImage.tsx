"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";

interface ImageProps {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  layout?: "contain" | "cover";
}

const MediaImage = (props: ImageProps) => {
  return (
    <div
      className={`flex w-full max-w-full items-center justify-center rounded-xl ${props.className || ""}`}
      style={{
        maxWidth: props.width ? `${props.width}px` : "100%",
        aspectRatio:
          props.width && props.height
            ? `${props.width} / ${props.height}`
            : undefined,
      }}
    >
      <Image
        src={props.src}
        alt={props.alt}
        width={props.width || 600}
        height={props.height || 800}
        sizes="(max-width: 768px) 92vw, 300px"
        style={{
          objectFit: props.layout === "contain" ? "contain" : "cover",
          width: "100%",
          height: props.height ? "100%" : "auto",
        }}
        className={`rounded-md shadow-figure border-3 border-retro-dark`}
      />
    </div>
  );
};

export default MediaImage;
