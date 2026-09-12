"use client";

import React, { useEffect } from "react";
import Image from "next/image";

interface ImageCaptionProps {
  src: string;
  alt: string;
  className?: string;
  type: "image" | "video";
  width?: number;
  height?: number;
  layout?: "contain" | "cover";
  caption: string;
  count: number;
}

const MediaCaption = (props: ImageCaptionProps) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const media = videoRef.current;
    if (!media) return;

    const playInline = () => {
      media.playsInline = true;
      void media.play().catch(() => {
        // Autoplay can still be blocked; leave the video muted/ready.
      });
    };

    if (media.readyState >= 2) {
      playInline();
      return;
    }

    media.addEventListener("loadeddata", playInline);
    return () => media.removeEventListener("loadeddata", playInline);
  }, [props.src]);

  return (
    <div className="w-full min-w-0 max-w-full">
      <div
        className={`w-full min-w-0 flex flex-col items-center rounded-xl ${props.className || ""}`}
      >
        {props.type === "image" && (
          <Image
            src={props.src}
            alt={props.alt}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            className={`w-full max-w-full h-auto rounded-md shadow-figure border-3 border-retro-dark ${props.layout === "contain" ? "object-contain" : "object-cover"}`}
          />
        )}
        {props.type === "video" && (
          <video
            ref={videoRef}
            width={props.width}
            height={props.height}
            className={`w-full max-w-full h-auto rounded-md shadow-figure border-3 border-retro-dark ${props.layout === "contain" ? "object-contain" : "object-cover"}`}
            loop
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            style={{ imageRendering: "crisp-edges" }}
          >
            <source src={props.src} type="video/mp4" />
          </video>
        )}
      </div>
      <p className="mt-2 text-center whitespace-normal break-words leading-snug">
        <b>Figure {props.count}: </b>
        {props.caption}
      </p>
    </div>
  );
};

export default MediaCaption;
