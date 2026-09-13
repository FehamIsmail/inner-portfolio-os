"use client";

import React, { useEffect } from "react";
import Image, { StaticImageData } from "next/image";

interface ImageCaptionProps {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  type: "image" | "video";
  width?: number;
  height?: number;
  layout?: "contain" | "cover";
  caption: string;
  count: number;
}

const MEDIA_SIZES = "(max-width: 1024px) 92vw, 720px";

let activeVideo: HTMLVideoElement | null = null;

const MediaCaption = (props: ImageCaptionProps) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (props.type !== "video") return;
    const media = videoRef.current;
    if (!media) return;

    media.playsInline = true;

    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          if (activeVideo && activeVideo !== media) activeVideo.pause();
          activeVideo = media;
          void media.play().catch(() => {});
        } else if (activeVideo === media) {
          media.pause();
          activeVideo = null;
        } else {
          media.pause();
        }
      },
      { threshold: [0, 0.4, 1] },
    );

    observer.observe(media);
    return () => {
      observer.disconnect();
      if (activeVideo === media) activeVideo = null;
      media.pause();
    };
  }, [props.src, props.type]);

  return (
    <div className="w-full min-w-0 max-w-full">
      <div
        className={`w-full min-w-0 flex flex-col items-center rounded-xl ${props.className || ""}`}
      >
        {props.type === "image" && (
          <Image
            src={props.src}
            alt={props.alt}
            width={props.width || 1200}
            height={props.height || 800}
            sizes={MEDIA_SIZES}
            quality={70}
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
            preload="none"
            disablePictureInPicture
            style={{ imageRendering: "crisp-edges" }}
          >
            <source
              src={typeof props.src === "string" ? props.src : props.src.src}
              type="video/mp4"
            />
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
