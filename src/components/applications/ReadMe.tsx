"use client";
import React, { forwardRef, useEffect, useState } from "react";
import Image from "next/image";

const texts = [
  "Software Engineer COOP @ Concordia University",
  "Passionate about Web Development & 3D Graphics",
  "Avid learner of new technologies",
  "Always open to new opportunities!",
];

const ReadMe = forwardRef<HTMLDivElement, {}>((props, ref) => {
  const [displayText, setDisplayText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [nameText, setNameText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  // Name typing animation
  useEffect(() => {
    const name = "Ismail Feham";
    let currentIndex = 0;
    let timer: NodeJS.Timeout;

    const typeWriter = () => {
      if (currentIndex <= name.length) {
        setNameText(name.slice(0, currentIndex));
        currentIndex++;
        timer = setTimeout(typeWriter, 100);
      } else {
        setTimeout(() => {
          currentIndex = 0;
          typeWriter();
        }, 6000);
      }
    };

    typeWriter();
    return () => clearTimeout(timer);
  }, []);

  // Cursor blinking animation
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Text rotation animation
  useEffect(() => {
    const text = texts[currentTextIndex];
    const typeSpeed = 50;
    const deleteSpeed = 30;
    const delayBeforeDelete = 3000;
    let timer: NodeJS.Timeout;

    const type = () => {
      if (!isDeleting && displayText.length < text.length) {
        setDisplayText(text.slice(0, displayText.length + 1));
        timer = setTimeout(type, typeSpeed);
      } else if (!isDeleting && displayText.length === text.length) {
        timer = setTimeout(() => setIsDeleting(true), delayBeforeDelete);
      } else if (isDeleting && displayText.length > 0) {
        setDisplayText(text.slice(0, displayText.length - 1));
        timer = setTimeout(type, deleteSpeed);
      } else if (isDeleting && displayText.length === 0) {
        setIsDeleting(false);
        setCurrentTextIndex((currentTextIndex + 1) % texts.length);
      }
    };

    timer = setTimeout(type, 50);
    return () => clearTimeout(timer);
  }, [displayText, currentTextIndex, isDeleting]);

  return (
    <div
      className="flex w-full h-full bg-retro-medium text-retro-dark"
      ref={ref}
    >
      <div className="w-64 flex-shrink-0 flex items-center justify-center">
        <Image
          src={"/videos/readme/dog.gif"}
          width={180}
          height={180}
          alt={"Computer"}
        />
      </div>

      <div className="flex-grow bg-retro-white border-x-retro-dark border-x-3">
        <div className="text-center py-8">
          <h5 className={"text-2xl"}>Hi there 👋</h5>
          <h6>Welcome to my profile! Feel free to explore around.</h6>
          <h1 className="text-4xl font-bold mb-4 font-mono mt-12">
            {nameText}
            <span
              className={`${showCursor ? "opacity-100" : "opacity-0"} text-retro-dark`}
            >
              |
            </span>
          </h1>
          <div className="h-8 text-2xl font-pixolde text-retro-dark">
            {displayText}
            <span className={`${showCursor ? "opacity-100" : "opacity-0"}`}>
              |
            </span>
          </div>
        </div>
      </div>

      <div className="w-64 flex-shrink-0 flex items-center justify-center">
        <Image
          src={"/videos/readme/computer.gif"}
          width={180}
          height={180}
          alt={"Computer"}
        />
      </div>
    </div>
  );
});

ReadMe.displayName = "ReadMe";

export default ReadMe;
