"use client";
import React from "react";
import Image from "next/image";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  layout?: "contain" | "cover";
}

const MediaImage = (props: ImageProps) => {
  return (
    <div
      className={`flex items-center justify-center rounded-xl ${props.className}`}
      style={{
        width: props.width ? `${props.width}px` : "100%",
        height: props.height ? `${props.height}px` : "auto",
      }}
    >
      <Image
        src={props.src}
        alt={props.alt}
        width={props.width || 0}
        height={props.height || 0}
        style={{
          objectFit: props.layout === "contain" ? "contain" : "cover",
          width: props.width ? "100%" : "100%",
          height: props.height ? "100%" : "auto",
        }}
        className={`rounded-md shadow-figure border-3 border-retro-dark`}
      />
    </div>
  );
};

export default MediaImage;
