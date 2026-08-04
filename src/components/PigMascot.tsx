import type { SVGProps } from "react";

// Transcribed 1:1 from the prototype's own DOM/CSS (extracted by driving
// designs/…V.4.html in a headless browser and reading computed styles +
// @keyframes — not re-drawn from memory): the cloud, ground, and pig mascot
// shared by the Home tip card and the Kapook tracker's hero illustration.
// Keyframe animations (cloudDrift/pigBannerSpin/pigLegSway/pigTailWiggle/
// pigEarWiggle/pigBlink) are defined in styles/index.css.
export function TipCloud(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 18" {...props}>
      <ellipse cx="12" cy="12" rx="10" ry="6" fill="#fff" />
      <ellipse cx="22" cy="9" rx="12" ry="8" fill="#fff" />
      <ellipse cx="31" cy="12" rx="8" ry="5.5" fill="#fff" />
    </svg>
  );
}

export function TipGround(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 300 60" preserveAspectRatio="none" {...props}>
      <path d="M0 28 Q60 10 150 22 Q230 30 300 12 L300 60 L0 60 Z" fill="#93DE93" />
      <path d="M0 38 Q70 22 150 34 Q225 42 300 26 L300 60 L0 60 Z" fill="#69C069" />
      <ellipse cx="40" cy="46" rx="4" ry="2.4" fill="#FFEE99" />
      <ellipse cx="260" cy="42" rx="4" ry="2.4" fill="#FFD86B" />
    </svg>
  );
}

interface PigMascotProps {
  className?: string;
  width?: number;
  height?: number;
  animation?: "spin" | "bounce" | "none";
  /** The salakInfo hero's pig has a medal ribbon on its chest and a smile —
   * the Home/tracker pig doesn't. Transcribed from the same extraction pass. */
  medal?: boolean;
}

const WRAPPER_ANIMATION: Record<NonNullable<PigMascotProps["animation"]>, string | undefined> = {
  spin: "pigBannerSpin 2.6s ease-in-out infinite",
  bounce: "pigBannerBounce 2.8s ease-in-out infinite",
  none: undefined,
};

export function PigMascot({ className, width = 70, height = 66, animation = "spin", medal = false }: PigMascotProps) {
  return (
    <div className={className} style={{ animation: WRAPPER_ANIMATION[animation] }}>
      <svg viewBox="0 0 160 160" width={width} height={height} style={{ overflow: "visible" }}>
        <ellipse cx="80" cy="150" rx="40" ry="6" fill="rgba(216,49,82,0.14)" />
        <g style={{ transformBox: "fill-box", transformOrigin: "50% 100%", animation: "pigLegSway 2.6s ease-in-out infinite" }}>
          <rect x="46" y="118" width="14" height="20" rx="6" fill="#FF9FB3" />
          <rect x="100" y="118" width="14" height="20" rx="6" fill="#FF9FB3" />
        </g>
        <path
          d="M132 70 q16 -6 12 10 q-4 12 -16 7 z"
          fill="#FFB6C8"
          stroke="#fff"
          strokeWidth={2}
          style={{ transformBox: "fill-box", transformOrigin: "20% 60%", animation: "pigTailWiggle 2.2s ease-in-out infinite" }}
        />
        <g style={{ transformBox: "fill-box", transformOrigin: "80% 90%", animation: "pigEarWiggle 2.6s ease-in-out infinite" }}>
          <ellipse cx="112" cy="40" rx="16" ry="18" fill="#FFB6C8" stroke="#fff" strokeWidth={3} />
          <ellipse cx="112" cy="43" rx="8" ry="9" fill="#F98CA5" />
        </g>
        <g style={{ transformBox: "fill-box", transformOrigin: "20% 90%", animation: "pigEarWiggle 2.6s ease-in-out infinite" }}>
          <ellipse cx="48" cy="40" rx="16" ry="18" fill="#FFB6C8" stroke="#fff" strokeWidth={3} />
          <ellipse cx="48" cy="43" rx="8" ry="9" fill="#F98CA5" />
        </g>
        <ellipse cx="80" cy="94" rx="54" ry="48" fill="#FFC2D1" stroke="#fff" strokeWidth={3} />
        <ellipse cx="52" cy="90" rx="10" ry="7" fill="#fff" opacity={0.35} />
        <g style={{ transformBox: "fill-box", transformOrigin: "50% 50%", animation: "pigBlink 4.2s ease-in-out infinite" }}>
          <path d="M56 82 q7 9 14 0" fill="none" stroke="#5b3a3a" strokeWidth={4} strokeLinecap="round" />
          <path d="M90 82 q7 9 14 0" fill="none" stroke="#5b3a3a" strokeWidth={4} strokeLinecap="round" />
        </g>
        {medal ? (
          <>
            <ellipse cx="80" cy="110" rx="22" ry="15" fill="#F98CA5" stroke="#fff" strokeWidth={3} />
            <ellipse cx="72" cy="111" rx="4.5" ry="5.5" fill="#B8546B" />
            <ellipse cx="88" cy="111" rx="4.5" ry="5.5" fill="#B8546B" />
            <path d="M62 122 q18 14 36 0" fill="none" stroke="#B8546B" strokeWidth={3.5} strokeLinecap="round" />
            <rect x="66" y="52" width="28" height="8" rx="4" fill="#D83152" opacity={0.85} />
          </>
        ) : (
          <>
            <ellipse cx="80" cy="112" rx="23" ry="16" fill="#F98CA5" stroke="#fff" strokeWidth={3} />
            <ellipse cx="72" cy="113" rx="5" ry="6" fill="#B8546B" />
            <ellipse cx="88" cy="113" rx="5" ry="6" fill="#B8546B" />
          </>
        )}
      </svg>
    </div>
  );
}
