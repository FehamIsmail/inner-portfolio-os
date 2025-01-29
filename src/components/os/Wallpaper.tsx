import React from "react";

const Wallpaper = () => {
  return (
    <div className="fixed inset-0 z-[-1000] bg-retro-background brightness-[160%] overflow-hidden">
      {/* Animated Background Gradient */}
      <div
        className="absolute inset-0 rounded-full h-3/4 aspect-square m-auto animate-pulse"
        style={{
          background: `linear-gradient(to bottom, var(--color-retro-background) 12%,var(--color-retro-semi-dark) 49.8%, var(--color-retro-dark) 50%, var(--color-retro-semi-dark) 84%, transparent 99%)`,
          animation: "gradientMove 15s ease-in-out infinite",
        }}
      />

      {/* Animated Vignette */}
      <div
        className="absolute inset-0 bg-gradient-radial from-transparent to-retro-dark animate-breathe"
        style={{
          mixBlendMode: "multiply",
          opacity: "0.9",
          animation: "breathe 8s ease-in-out infinite",
        }}
      />

      {/* Animated Sun */}
      <SunSVG />

      <style jsx>{`
        @keyframes gradientMove {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.05) rotate(1deg);
          }
        }

        @keyframes breathe {
          0%,
          100% {
            opacity: 0.9;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

const SunSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      className="absolute transform -translate-x-1/2 -translate-y-1/2 brightness-[80%]"
      style={{
        left: "50%",
        top: "50%",
        width: "300px",
        height: "300px",
        animation: "float 10s ease-in-out infinite",
      }}
    >
      <defs>
        <radialGradient
          id="sunGradient"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop offset="30%" stopColor="rgba(255, 255, 255, 0.8)">
            <animate
              attributeName="offset"
              values="0.3;0.35;0.3"
              dur="5s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="70%" stopColor="rgba(255, 255, 255, 0)">
            <animate
              attributeName="offset"
              values="0.7;0.75;0.7"
              dur="5s"
              repeatCount="indefinite"
            />
          </stop>
        </radialGradient>

        <mask id="sunMask">
          <rect x="0" y="0" width="200" height="200" fill="white" />
          {Array.from({ length: 7 }).map((_, i) => (
            <rect
              key={i}
              x="0"
              y={100 + i * 10}
              width="200"
              height={2 + i * 0.8}
              fill="black"
              className="animate-pulse"
            >
              <animate
                attributeName="y"
                values={`${100 + i * 10};${102 + i * 10};${100 + i * 10}`}
                dur={`${3 + i * 0.5}s`}
                repeatCount="indefinite"
              />
            </rect>
          ))}
        </mask>
      </defs>

      <circle
        cx="100"
        cy="100"
        r="100"
        fill="url(#sunGradient)"
        mask="url(#sunMask)"
      />
    </svg>
  );
};

export default Wallpaper;
