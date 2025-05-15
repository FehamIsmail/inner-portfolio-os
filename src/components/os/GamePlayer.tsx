import React, { forwardRef, useRef, useState, useEffect } from "react";
import { WindowAnimationState } from "@/constants/enums";

interface GameProps {
  gameSrc: string;
  animationState?: WindowAnimationState;
}

const GamePlayer = forwardRef<HTMLDivElement, GameProps>((props, ref) => {
  const { gameSrc, animationState } = props;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  useEffect(() => {
    setIsDragging(
      animationState === WindowAnimationState.DRAGGING || 
      animationState === WindowAnimationState.RESIZING
    );
  }, [animationState]);

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", position: "relative" }}>
      {isDragging && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          cursor: "grabbing"
        }} />
      )}
      <iframe
        ref={iframeRef}
        src={gameSrc}
        width="100%"
        height="100%"
        style={{ 
          border: "none",
          pointerEvents: isDragging ? "none" : "auto"
        }}
      />
    </div>
  );
});

GamePlayer.displayName = "GamePlayer";

export default GamePlayer;
