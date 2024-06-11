import React, {forwardRef, useRef} from "react";

interface GameProps {
    gameSrc: string;
}

const GamePlayer = forwardRef<HTMLDivElement, GameProps>((props, ref) => {
    const { gameSrc } = props;
    const iframeRef = useRef<HTMLIFrameElement>(null);

    return (
        <div ref={ref} style={{ width: '100%', height: '100%'}}>
            <iframe ref={iframeRef} src={gameSrc} width="100%" height="100%" style={{ border: 'none' }} />
        </div>
    );
});

GamePlayer.displayName = "GamePlayer";

export default GamePlayer;
