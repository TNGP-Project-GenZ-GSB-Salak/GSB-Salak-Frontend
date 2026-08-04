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
  animation?: "spin" | "bounce" | "none" | "bob" | "party" | "celebrate" | "tap";
  /** The salakInfo hero's pig has a medal ribbon on its chest and a smile —
   * the Home/tracker pig doesn't. Transcribed from the same extraction pass. */
  medal?: boolean;
}

const WRAPPER_ANIMATION: Record<NonNullable<PigMascotProps["animation"]>, string | undefined> = {
  spin: "pigBannerSpin 2.6s ease-in-out infinite",
  bounce: "pigBannerBounce 2.8s ease-in-out infinite",
  none: undefined,
  bob: "pigBob 2.6s ease-in-out infinite",
  party: "pigParty 0.9s ease-in-out infinite",
  celebrate: "pigCelebrate 0.6s ease-in-out 3",
  tap: "pigTapBounce 0.5s ease-in-out 1",
};

// The tracker's hero pig wiggles its ears faster while the one-shot
// "celebrate" bounce plays (prompt/prototype-reference.html's `earAnim`).
const EAR_ANIMATION: Record<NonNullable<PigMascotProps["animation"]>, string> = {
  spin: "pigEarWiggle 2.6s ease-in-out infinite",
  bounce: "pigEarWiggle 2.6s ease-in-out infinite",
  none: "pigEarWiggle 2.6s ease-in-out infinite",
  bob: "pigEarWiggle 2.6s ease-in-out infinite",
  party: "pigEarWiggle 2.6s ease-in-out infinite",
  celebrate: "pigEarWiggle 0.5s ease-in-out infinite",
  tap: "pigEarWiggle 2.6s ease-in-out infinite",
};

export function PigMascot({ className, width = 70, height = 66, animation = "spin", medal = false }: PigMascotProps) {
  const earAnimation = EAR_ANIMATION[animation];
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
        <g style={{ transformBox: "fill-box", transformOrigin: "80% 90%", animation: earAnimation }}>
          <ellipse cx="112" cy="40" rx="16" ry="18" fill="#FFB6C8" stroke="#fff" strokeWidth={3} />
          <ellipse cx="112" cy="43" rx="8" ry="9" fill="#F98CA5" />
        </g>
        <g style={{ transformBox: "fill-box", transformOrigin: "20% 90%", animation: earAnimation }}>
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

// The tracker hero's "party mode" overlay once the goal is reached and the
// auto-purchase countdown is running (prompt/prototype-reference.html's
// `isPartyMode`): swaps the sky/grass scene for a starry disco backdrop.
export function PartyBackdrop() {
  return (
    <div className="kapook-party-backdrop">
      <span className="kapook-party-backdrop__star" style={{ top: 14, left: 26, width: 3, height: 3, animation: "starTwinkle 2.4s ease-in-out infinite" }} />
      <span className="kapook-party-backdrop__star" style={{ top: 30, left: 70, width: 2, height: 2, animation: "starTwinkle 1.8s ease-in-out infinite 0.4s" }} />
      <span className="kapook-party-backdrop__star" style={{ top: 20, right: 40, width: 3, height: 3, animation: "starTwinkle 2s ease-in-out infinite 0.8s" }} />
      <span className="kapook-party-backdrop__star" style={{ top: 48, right: 90, width: 2, height: 2, animation: "starTwinkle 2.6s ease-in-out infinite 1.2s" }} />
      <span className="kapook-party-backdrop__star" style={{ top: 60, left: 130, width: 2, height: 2, animation: "starTwinkle 2.2s ease-in-out infinite 0.6s" }} />
      <div className="kapook-party-backdrop__glow" />
      <div className="kapook-party-backdrop__ball-wrap">
        <div className="kapook-party-backdrop__string" />
        <div className="kapook-party-backdrop__ball" />
      </div>
    </div>
  );
}

export type CelebrateSticker = "coin" | "star" | "ribbon" | "heart";

export const CELEBRATE_STICKERS: CelebrateSticker[] = ["coin", "star", "ribbon", "heart"];

// One of four small stickers that pops up next to the pig right after a
// successful deposit, picked at random (prompt/prototype-reference.html's
// `celebrateStickers`).
export function CelebrateStickerIcon({ sticker }: { sticker: CelebrateSticker }) {
  return (
    <svg viewBox="0 0 40 40" width={40} height={40} className="kapook-celebrate-sticker">
      {sticker === "coin" && (
        <>
          <circle cx="20" cy="20" r="16" fill="#FFD86B" stroke="#F4B23F" strokeWidth={2} />
          <circle cx="20" cy="20" r="11" fill="none" stroke="#F4B23F" strokeWidth={1.6} />
          <text x="20" y="25" fontSize={13} fontWeight={700} fill="#F4B23F" textAnchor="middle" fontFamily="sans-serif">
            ฿
          </text>
        </>
      )}
      {sticker === "star" && (
        <path
          d="M20 4 L24.5 15.5 L37 16.5 L27.5 24.5 L30.5 37 L20 30 L9.5 37 L12.5 24.5 L3 16.5 L15.5 15.5 Z"
          fill="#76CFF5"
          stroke="#3FA8DE"
          strokeWidth={1.6}
        />
      )}
      {sticker === "ribbon" && (
        <>
          <circle cx="20" cy="15" r="10" fill="#FF9FB3" stroke="#D83152" strokeWidth={1.6} />
          <circle cx="20" cy="15" r="5" fill="#fff" opacity={0.8} />
          <path d="M14 22 L9 37 L18 32 Z" fill="#D83152" />
          <path d="M26 22 L31 37 L22 32 Z" fill="#D83152" />
        </>
      )}
      {sticker === "heart" && (
        <path
          d="M20 34 C6 24 4 15 11 10.5 C15 8 19 10 20 14 C21 10 25 8 29 10.5 C36 15 34 24 20 34 Z"
          fill="#FF9FB3"
          stroke="#D83152"
          strokeWidth={1.6}
        />
      )}
    </svg>
  );
}
