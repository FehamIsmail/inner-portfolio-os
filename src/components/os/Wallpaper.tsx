"use client";

import React, { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * Newton-prism wallpaper
 * Flow: bottom-left white beam → centered glass prism → bottom-right ROYGBIV spectrum.
 * Prism is fully static; only light has subtle motion.
 */

type Pt = { x: number; y: number };

const lerp = (a: Pt, b: Pt, t: number): Pt => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

/** Tapered ray polygon: thin at start, thicker at end (Newton dispersion look). */
const taperedRay = (
  from: Pt,
  to: Pt,
  startWidth: number,
  endWidth: number,
): string => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const sw = startWidth / 2;
  const ew = endWidth / 2;
  return [
    `${from.x + nx * sw},${from.y + ny * sw}`,
    `${to.x + nx * ew},${to.y + ny * ew}`,
    `${to.x - nx * ew},${to.y - ny * ew}`,
    `${from.x - nx * sw},${from.y - ny * sw}`,
  ].join(" ");
};

const pts = (points: Pt[]) =>
  points.map((p) => `${p.x},${p.y}`).join(" ");

const polarAt = (origin: Pt, r: number, deg: number): Pt => {
  const rad = (deg * Math.PI) / 180;
  return {
    x: origin.x + Math.cos(rad) * r,
    y: origin.y + Math.sin(rad) * r,
  };
};

const INNER_R = 228;
const MID_R = 308;
const OUTER_R = 398;
const SCALE_TICKS = Array.from({ length: 24 }, (_, i) => i * 15);
const BRACKET_DEGS = [45, 135, 225, 315];

const SPECTRUM: { color: string; angle: number }[] = [
  { color: "var(--wallpaper-line-1)", angle: 12 },
  { color: "var(--wallpaper-line-2)", angle: 15.5 },
  { color: "var(--wallpaper-line-3)", angle: 19 },
  { color: "var(--wallpaper-line-4)", angle: 22.5 },
  { color: "var(--wallpaper-line-5)", angle: 26.5 },
  { color: "var(--wallpaper-line-6)", angle: 30.5 },
  { color: "var(--wallpaper-line-7)", angle: 35 },
];

const MOTES = [
  { t: 0.48, r: 1.1, delay: "0s" },
  { t: 0.56, r: 0.7, delay: "-2.4s" },
  { t: 0.63, r: 1.4, delay: "-1.1s" },
  { t: 0.7, r: 0.8, delay: "-4.2s" },
  { t: 0.77, r: 1.2, delay: "-3s" },
  { t: 0.84, r: 0.9, delay: "-5.6s" },
  { t: 0.9, r: 1.5, delay: "-0.8s" },
];

const StaticWallpaper = () => (
  <div className="os-wallpaper" aria-hidden="true" />
);

const AnimatedWallpaper = () => {
  const apex: Pt = { x: 600, y: 268 };
  const baseL: Pt = { x: 468, y: 498 };
  const baseR: Pt = { x: 732, y: 498 };

  const entry = lerp(apex, baseL, 0.58);
  const exit = lerp(apex, baseR, 0.5);
  const centroid: Pt = {
    x: (apex.x + baseL.x + baseR.x) / 3,
    y: (apex.y + baseL.y + baseR.y) / 3,
  };

  const beamStart: Pt = { x: -520, y: 920 };
  const spectrumLen = 980;
  const prismPoints = pts([apex, baseL, baseR]);

  const leftSheen = pts([
    lerp(apex, baseL, 0.1),
    lerp(apex, baseL, 0.62),
    lerp(lerp(apex, baseL, 0.36), centroid, 0.42),
  ]);

  return (
    <div className="os-wallpaper newton-wallpaper">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="whiteBeamGrad"
            gradientUnits="userSpaceOnUse"
            x1={beamStart.x}
            y1={beamStart.y}
            x2={entry.x}
            y2={entry.y}
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="75%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>

          <linearGradient
            id="internalWash"
            gradientUnits="userSpaceOnUse"
            x1={entry.x}
            y1={entry.y}
            x2={exit.x}
            y2={exit.y}
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop
              offset="55%"
              stopColor="var(--wallpaper-paper)"
              stopOpacity="0.08"
            />
            <stop
              offset="100%"
              stopColor="var(--wallpaper-line-4)"
              stopOpacity="0.16"
            />
          </linearGradient>

          <linearGradient id="glassFill" x1="0.18" y1="0" x2="0.9" y2="1">
            <stop
              offset="0%"
              stopColor="var(--wallpaper-paper)"
              stopOpacity="0.26"
            />
            <stop offset="38%" stopColor="#ffffff" stopOpacity="0.14" />
            <stop
              offset="72%"
              stopColor="var(--wallpaper-muted)"
              stopOpacity="0.1"
            />
            <stop
              offset="100%"
              stopColor="var(--wallpaper-paper)"
              stopOpacity="0.06"
            />
          </linearGradient>

          <linearGradient id="glassEdge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.82" />
            <stop
              offset="48%"
              stopColor="var(--wallpaper-paper)"
              stopOpacity="0.42"
            />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.24" />
          </linearGradient>

          <radialGradient id="entryGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="42%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="exitGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.78" />
            <stop
              offset="28%"
              stopColor="var(--wallpaper-line-3)"
              stopOpacity="0.34"
            />
            <stop
              offset="58%"
              stopColor="var(--wallpaper-line-5)"
              stopOpacity="0.14"
            />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="prismBloom" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="floorCaustic" cx="30%" cy="40%" r="70%">
            <stop
              offset="0%"
              stopColor="var(--wallpaper-line-3)"
              stopOpacity="0.18"
            />
            <stop
              offset="45%"
              stopColor="var(--wallpaper-line-5)"
              stopOpacity="0.08"
            />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="wideGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="prismClip">
            <polygon points={prismPoints} />
          </clipPath>
        </defs>

        {/* Atmosphere: scaled goniometer rings */}
        <g className="surroundings" opacity="0.3">
          <g className="optic-spin">
            <circle
              cx={centroid.x}
              cy={centroid.y}
              r={INNER_R}
              fill="none"
              stroke="var(--wallpaper-paper)"
              strokeWidth="1.15"
            />
            <circle
              cx={centroid.x}
              cy={centroid.y}
              r={OUTER_R}
              fill="none"
              stroke="var(--wallpaper-muted)"
              strokeOpacity="0.55"
              strokeWidth="0.95"
            />
            {SCALE_TICKS.map((deg) => {
              const cardinal = deg % 90 === 0;
              const major = deg % 45 === 0;
              const from = cardinal
                ? INNER_R - 16
                : major
                  ? INNER_R - 10
                  : INNER_R - 5;
              const to = cardinal
                ? INNER_R + 5
                : major
                  ? INNER_R + 3
                  : INNER_R + 2;
              const a = polarAt(centroid, from, deg);
              const b = polarAt(centroid, to, deg);
              return (
                <line
                  key={`tick-${deg}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="var(--wallpaper-paper)"
                  strokeWidth={cardinal ? 1.55 : major ? 1.3 : 0.9}
                  strokeLinecap="round"
                />
              );
            })}
            {BRACKET_DEGS.map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const rx = Math.cos(rad);
              const ry = Math.sin(rad);
              const tx = -ry;
              const ty = rx;
              const p = polarAt(centroid, INNER_R + 10, deg);
              const arm = 14;
              return (
                <g key={`bracket-${deg}`}>
                  <line
                    x1={p.x}
                    y1={p.y}
                    x2={p.x + rx * arm}
                    y2={p.y + ry * arm}
                    stroke="var(--wallpaper-paper)"
                    strokeWidth="1.35"
                    strokeLinecap="round"
                  />
                  <line
                    x1={p.x + tx * arm * 0.7}
                    y1={p.y + ty * arm * 0.7}
                    x2={p.x - tx * arm * 0.7}
                    y2={p.y - ty * arm * 0.7}
                    stroke="var(--wallpaper-paper)"
                    strokeWidth="1.35"
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
          </g>
          {/* Two white index triangles — opposite paths, very slow */}
          {([-90, 90] as const).map((deg, i) => {
            const tip = polarAt(centroid, INNER_R - 12, deg);
            const left = polarAt(centroid, INNER_R - 30, deg - 2.1);
            const right = polarAt(centroid, INNER_R - 30, deg + 2.1);
            const to = i === 0 ? 360 : -360;
            return (
              <g key={`index-${deg}`}>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`0 ${centroid.x} ${centroid.y}`}
                  to={`${to} ${centroid.x} ${centroid.y}`}
                  dur="720s"
                  repeatCount="indefinite"
                />
                <polygon
                  points={`${tip.x},${tip.y} ${left.x},${left.y} ${right.x},${right.y}`}
                  fill="#ffffff"
                  fillOpacity="0.55"
                />
              </g>
            );
          })}
          <circle
            className="optic-dashed"
            cx={centroid.x}
            cy={centroid.y}
            r={MID_R}
            fill="none"
            stroke="var(--wallpaper-paper)"
            strokeOpacity="0.7"
            strokeWidth="1.05"
            strokeDasharray="4 12"
          />
        </g>

        <ellipse
          cx={centroid.x + 8}
          cy={baseL.y + 18}
          rx="128"
          ry="16"
          fill="url(#floorShadow)"
        />
        <ellipse
          className="floor-caustic"
          cx={exit.x + 90}
          cy={baseR.y + 28}
          rx="150"
          ry="22"
          fill="url(#floorCaustic)"
        />

        <g className="light-layer">
          <line
            className="white-beam"
            x1={beamStart.x}
            y1={beamStart.y}
            x2={entry.x}
            y2={entry.y}
            stroke="url(#whiteBeamGrad)"
            strokeWidth="2.8"
            strokeLinecap="round"
            filter="url(#softGlow)"
          />

          {MOTES.map((mote) => {
            const p = lerp(beamStart, entry, mote.t);
            return (
              <circle
                key={`${mote.t}-${mote.delay}`}
                className="dust-mote"
                style={{ animationDelay: mote.delay }}
                cx={p.x}
                cy={p.y}
                r={mote.r}
                fill="#ffffff"
                fillOpacity="0.55"
              />
            );
          })}

          <g clipPath="url(#prismClip)">
            <polygon
              points={taperedRay(entry, exit, 7, 11)}
              fill="url(#internalWash)"
            />
            <line
              className="internal-ray"
              x1={entry.x}
              y1={entry.y}
              x2={exit.x}
              y2={exit.y}
              stroke="#ffffff"
              strokeOpacity="0.38"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          <g className="spectrum" filter="url(#softGlow)">
            {SPECTRUM.map(({ color, angle }, i) => {
              const rad = (angle * Math.PI) / 180;
              const tip: Pt = {
                x: exit.x + Math.cos(rad) * spectrumLen,
                y: exit.y + Math.sin(rad) * spectrumLen,
              };
              return (
                <polygon
                  key={color}
                  className="spectrum-ray"
                  style={{ animationDelay: `${-i * 0.4}s` }}
                  points={taperedRay(exit, tip, 1.7, 18)}
                  fill={color}
                  fillOpacity={0.9}
                />
              );
            })}
          </g>

          <circle
            className="surface-glow"
            cx={entry.x}
            cy={entry.y}
            r={16}
            fill="url(#entryGlow)"
            opacity={0.78}
          />
          <circle
            className="surface-glow exit-halo"
            cx={exit.x}
            cy={exit.y}
            r={24}
            fill="url(#exitGlow)"
            opacity={0.82}
          />
          <circle
            cx={entry.x}
            cy={entry.y}
            r={3.4}
            fill="#ffffff"
            fillOpacity="0.7"
          />
          <circle
            cx={exit.x}
            cy={exit.y}
            r={3.6}
            fill="#ffffff"
            fillOpacity="0.7"
          />
        </g>

        <g className="prism">
          <polygon
            points={prismPoints}
            fill="url(#prismBloom)"
            opacity="0.9"
            filter="url(#wideGlow)"
          />
          <polygon
            points={prismPoints}
            fill="url(#glassFill)"
            stroke="url(#glassEdge)"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          <g clipPath="url(#prismClip)">
            <polygon points={leftSheen} fill="#ffffff" fillOpacity="0.16" />
            <ellipse
              cx={apex.x - 6}
              cy={apex.y + 38}
              rx="18"
              ry="9"
              fill="#ffffff"
              fillOpacity="0.18"
              transform={`rotate(-18 ${apex.x - 6} ${apex.y + 38})`}
            />
            <circle
              cx={lerp(baseL, baseR, 0.72).x}
              cy={baseR.y - 18}
              r="3"
              fill="#ffffff"
              fillOpacity="0.22"
            />
          </g>
          <circle
            cx={apex.x}
            cy={apex.y}
            r="2.2"
            fill="#ffffff"
            fillOpacity="0.7"
          />
          <circle
            cx={baseL.x}
            cy={baseL.y}
            r="1.6"
            fill="#ffffff"
            fillOpacity="0.35"
          />
          <circle
            cx={baseR.x}
            cy={baseR.y}
            r="1.6"
            fill="#ffffff"
            fillOpacity="0.35"
          />
        </g>
      </svg>

      <style jsx>{`
        .newton-wallpaper {
          background: linear-gradient(
            152deg,
            color-mix(in srgb, var(--color-retro-background) 72%, black 28%) 0%,
            color-mix(in srgb, var(--color-retro-background) 88%, black 12%) 42%,
            color-mix(in srgb, var(--color-retro-background) 55%, black 45%) 100%
          );
        }

        .newton-wallpaper::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.18;
          background-image:
            radial-gradient(circle at 18% 72%, rgba(255, 255, 255, 0.08) 0 1px, transparent 1.6px),
            radial-gradient(circle at 74% 28%, rgba(255, 255, 255, 0.05) 0 1px, transparent 1.6px),
            radial-gradient(circle at 42% 18%, rgba(255, 255, 255, 0.04) 0 1px, transparent 1.5px);
          background-size: 220px 180px, 280px 220px, 160px 140px;
        }

        .newton-wallpaper::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            ellipse at 50% 48%,
            transparent 28%,
            color-mix(in srgb, var(--color-retro-dark) 50%, transparent) 100%
          );
          opacity: 0.48;
        }

        .white-beam,
        .internal-ray {
          animation: beam-pulse 8.5s ease-in-out infinite;
        }

        .internal-ray {
          animation-delay: -2.2s;
        }

        .spectrum-ray {
          animation: spectrum-shimmer 9.5s ease-in-out infinite;
        }

        .surface-glow {
          animation: glow-breathe 7s ease-in-out infinite;
        }

        .exit-halo {
          animation-delay: -1.6s;
        }

        .dust-mote {
          animation: mote-drift 11s ease-in-out infinite;
        }

        .floor-caustic {
          animation: glow-breathe 10s ease-in-out infinite;
        }

        .optic-spin,
        .optic-dashed {
          transform-box: fill-box;
          transform-origin: center;
        }

        .optic-spin {
          animation: ring-spin 375s linear infinite;
        }

        .optic-dashed {
          animation:
            ring-spin-rev 300s linear infinite,
            ring-dash 130s linear infinite;
        }

        @keyframes beam-pulse {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes spectrum-shimmer {
          0%,
          100% {
            opacity: 0.75;
          }
          50% {
            opacity: 0.98;
          }
        }

        @keyframes glow-breathe {
          0%,
          100% {
            opacity: 0.55;
          }
          50% {
            opacity: 0.9;
          }
        }

        @keyframes mote-drift {
          0%,
          100% {
            opacity: 0.2;
            transform: translate(0, 0);
          }
          50% {
            opacity: 0.7;
            transform: translate(1.5px, -2px);
          }
        }

        @keyframes ring-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes ring-spin-rev {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes ring-dash {
          to {
            stroke-dashoffset: -160;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .white-beam,
          .internal-ray,
          .spectrum-ray,
          .surface-glow,
          .dust-mote,
          .floor-caustic,
          .optic-spin,
          .optic-dashed {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

const Wallpaper = () => {
  const isMobile = useIsMobile();
  const [allowFx, setAllowFx] = useState(false);

  useEffect(() => {
    setAllowFx(!isMobile);
  }, [isMobile]);

  if (!allowFx) return <StaticWallpaper />;
  return <AnimatedWallpaper />;
};

export default React.memo(Wallpaper);
