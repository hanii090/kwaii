import React from 'react';
import Svg, { Path, Circle, Ellipse, Rect, G, Line } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Kawaii Streak Flame — warm orange/brown palette
export function StreakFlameIcon({ size = 20, color = '#F4A261' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C12 2 5 9 5 14.5C5 18.64 8.13 22 12 22C15.87 22 19 18.64 19 14.5C19 9 12 2 12 2Z"
        fill={color}
        opacity={0.85}
      />
      <Path
        d="M12 6C12 6 8 11 8 14.5C8 17.26 9.79 19.5 12 19.5C14.21 19.5 16 17.26 16 14.5C16 11 12 6 12 6Z"
        fill="#E8915A"
      />
      <Path
        d="M12 10C12 10 10 13 10 15C10 16.66 10.9 18 12 18C13.1 18 14 16.66 14 15C14 13 12 10 12 10Z"
        fill="#FFD4A8"
      />
      <Ellipse cx="12" cy="16" rx="1.5" ry="1" fill="#FFF5E6" opacity={0.7} />
    </Svg>
  );
}

// Kawaii Notification Bell — soft green accent
export function NotifBellIcon({ size = 20, color = '#B8D8BA' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3C8.69 3 6 5.69 6 9V14L4 17H20L18 14V9C18 5.69 15.31 3 12 3Z"
        fill={color}
        stroke="#8B5E3C"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 17V18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18V17"
        stroke="#8B5E3C"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      <Circle cx="12" cy="10" r="1" fill="#8B5E3C" opacity={0.3} />
      <Path d="M9 3.5C9 3.5 10.5 2 12 2C13.5 2 15 3.5 15 3.5" stroke="#F4A261" strokeWidth={1} strokeLinecap="round" />
    </Svg>
  );
}

// Kawaii Pill / Medication — warm capsule
export function MedPillIcon({ size = 20, color = '#F4A261' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="6"
        y="3"
        width="12"
        height="18"
        rx="6"
        fill={color}
        stroke="#8B5E3C"
        strokeWidth={1.2}
      />
      <Rect x="6" y="12" width="12" height="9" rx="6" fill="#FFF5E6" stroke="#8B5E3C" strokeWidth={1.2} />
      <Path d="M6 12H18" stroke="#8B5E3C" strokeWidth={1.2} />
      <Circle cx="10" cy="8" r="0.8" fill="#FFF5E6" opacity={0.6} />
      <Circle cx="12.5" cy="7" r="0.5" fill="#FFF5E6" opacity={0.4} />
    </Svg>
  );
}

// Kawaii Celebration / Confetti — warm party hat
export function CelebrationIcon({ size = 20, color = '#F4A261' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L8 20H16L12 2Z"
        fill={color}
        stroke="#8B5E3C"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <Path d="M9.5 11L14.5 11" stroke="#FFF5E6" strokeWidth={1} strokeLinecap="round" />
      <Path d="M10 14L14 14" stroke="#FFF5E6" strokeWidth={1} strokeLinecap="round" />
      <Circle cx="12" cy="2.5" r="1.5" fill="#B8D8BA" stroke="#8B5E3C" strokeWidth={0.8} />
      {/* Confetti bits */}
      <Circle cx="5" cy="8" r="1.2" fill="#B8D8BA" opacity={0.7} />
      <Circle cx="19" cy="6" r="1" fill="#E8D5C0" opacity={0.7} />
      <Circle cx="4" cy="14" r="0.8" fill="#F4A261" opacity={0.5} />
      <Circle cx="20" cy="12" r="1" fill="#B8D8BA" opacity={0.5} />
      <Path d="M6 5L7 3" stroke="#F4A261" strokeWidth={1} strokeLinecap="round" />
      <Path d="M18 4L19 6" stroke="#B8D8BA" strokeWidth={1} strokeLinecap="round" />
    </Svg>
  );
}

// Kawaii Cat Face (sad/encouragement) — soft brown cat
export function SadCatIcon({ size = 20, color = '#F4A261' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Head */}
      <Circle cx="12" cy="13" r="9" fill={color} stroke="#8B5E3C" strokeWidth={1.2} />
      {/* Ears */}
      <Path d="M5 7L3 1L9 5Z" fill={color} stroke="#8B5E3C" strokeWidth={1} />
      <Path d="M19 7L21 1L15 5Z" fill={color} stroke="#8B5E3C" strokeWidth={1} />
      <Path d="M6 6L4.5 2.5L8.5 5Z" fill="#FFD4A8" />
      <Path d="M18 6L19.5 2.5L15.5 5Z" fill="#FFD4A8" />
      {/* Eyes — sad droopy */}
      <Ellipse cx="9" cy="12" rx="1.5" ry="1.8" fill="#5C3D2E" />
      <Circle cx="9.5" cy="11.5" r="0.6" fill="#FFFFFF" />
      <Ellipse cx="15" cy="12" rx="1.5" ry="1.8" fill="#5C3D2E" />
      <Circle cx="15.5" cy="11.5" r="0.6" fill="#FFFFFF" />
      {/* Sad eyebrows */}
      <Path d="M7 9.5L10 10.5" stroke="#8B5E3C" strokeWidth={0.8} strokeLinecap="round" />
      <Path d="M17 9.5L14 10.5" stroke="#8B5E3C" strokeWidth={0.8} strokeLinecap="round" />
      {/* Mouth — frown */}
      <Path d="M10 16Q12 14.5 14 16" stroke="#5C3D2E" strokeWidth={1} strokeLinecap="round" fill="none" />
      {/* Blush */}
      <Ellipse cx="7" cy="14.5" rx="1.5" ry="1" fill="#FFB4A2" opacity={0.4} />
      <Ellipse cx="17" cy="14.5" rx="1.5" ry="1" fill="#FFB4A2" opacity={0.4} />
      {/* Tear */}
      <Path d="M16.5 14C16.5 14 17.5 16 17 17C16.7 17.5 16 17.3 16 16.8C16 16 16.5 14 16.5 14Z" fill="#A8DBE0" opacity={0.7} />
    </Svg>
  );
}

// Kawaii Chart / Daily Summary — soft bar chart
export function ChartIcon({ size = 20, color = '#B8D8BA' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Base line */}
      <Path d="M3 20H21" stroke="#8B5E3C" strokeWidth={1.2} strokeLinecap="round" />
      {/* Bars */}
      <Rect x="5" y="12" width="4" height="8" rx="2" fill={color} stroke="#8B5E3C" strokeWidth={0.8} />
      <Rect x="10" y="6" width="4" height="14" rx="2" fill="#F4A261" stroke="#8B5E3C" strokeWidth={0.8} />
      <Rect x="15" y="9" width="4" height="11" rx="2" fill="#E8D5C0" stroke="#8B5E3C" strokeWidth={0.8} />
      {/* Sparkle on tallest bar */}
      <Path d="M12 4L12.5 2.5L13 4L12.5 5.5Z" fill="#F4A261" opacity={0.6} />
    </Svg>
  );
}

// Kawaii Crown / Premium — golden warm
export function CrownIcon({ size = 20, color = '#F4A261' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 17L2 7L7 11L12 4L17 11L22 7L20 17H4Z"
        fill={color}
        stroke="#8B5E3C"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <Rect x="4" y="17" width="16" height="3" rx="1.5" fill="#E8915A" stroke="#8B5E3C" strokeWidth={1} />
      <Circle cx="8" cy="14" r="1" fill="#FFF5E6" opacity={0.6} />
      <Circle cx="12" cy="13" r="1.2" fill="#FFF5E6" opacity={0.7} />
      <Circle cx="16" cy="14" r="1" fill="#FFF5E6" opacity={0.6} />
    </Svg>
  );
}

// Kawaii Restore / Sync arrows
export function RestoreIcon({ size = 20, color = '#B8D8BA' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 12C4 7.58 7.58 4 12 4C14.76 4 17.2 5.37 18.7 7.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path d="M16 7.5H19V4.5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M20 12C20 16.42 16.42 20 12 20C9.24 20 6.8 18.63 5.3 16.5"
        stroke="#F4A261"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path d="M8 16.5H5V19.5" stroke="#F4A261" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// Kawaii Coin — warm gold
export function CoinIcon({ size = 20, color = '#F4A261' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill={color} stroke="#8B5E3C" strokeWidth={1.2} />
      <Circle cx="12" cy="12" r="7" fill="#FFD4A8" stroke="#E8915A" strokeWidth={0.8} />
      <Path d="M12 7V17" stroke="#E8915A" strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M9.5 9.5C9.5 9.5 10.5 8.5 12 8.5C13.5 8.5 14.5 9.5 14.5 10.5C14.5 11.5 13.5 12 12 12C10.5 12 9.5 12.5 9.5 13.5C9.5 14.5 10.5 15.5 12 15.5C13.5 15.5 14.5 14.5 14.5 14.5" stroke="#E8915A" strokeWidth={1} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

// Kawaii Star
export function StarIcon({ size = 20, color = '#F4A261' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L14.9 8.6L22 9.5L17 14.3L18.2 21.3L12 17.8L5.8 21.3L7 14.3L2 9.5L9.1 8.6L12 2Z"
        fill={color}
        stroke="#8B5E3C"
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <Circle cx="10" cy="10" r="1" fill="#FFF5E6" opacity={0.5} />
    </Svg>
  );
}

// Kawaii Sparkle
export function SparkleIcon({ size = 20, color = '#F4A261' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L13.5 9L20 12L13.5 15L12 22L10.5 15L4 12L10.5 9L12 2Z" fill={color} stroke="#8B5E3C" strokeWidth={0.8} />
      <Circle cx="12" cy="12" r="1.5" fill="#FFF5E6" opacity={0.6} />
    </Svg>
  );
}

// Kawaii Clipboard / Manage
export function ClipboardIcon({ size = 20, color = '#E8D5C0' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="4" width="14" height="18" rx="3" fill={color} stroke="#8B5E3C" strokeWidth={1.2} />
      <Rect x="8" y="2" width="8" height="4" rx="2" fill="#F4A261" stroke="#8B5E3C" strokeWidth={1} />
      <Path d="M8 11H16" stroke="#8B5E3C" strokeWidth={1} strokeLinecap="round" />
      <Path d="M8 14H14" stroke="#8B5E3C" strokeWidth={1} strokeLinecap="round" />
      <Path d="M8 17H12" stroke="#8B5E3C" strokeWidth={1} strokeLinecap="round" />
    </Svg>
  );
}

// Kawaii Sunrise / Morning
export function SunriseIcon({ size = 20, color = '#F4A261' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 18H21" stroke="#E8D5C0" strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx="12" cy="14" r="5" fill={color} stroke="#8B5E3C" strokeWidth={1} />
      <Circle cx="12" cy="14" r="3" fill="#FFD4A8" />
      <Path d="M12 6V8" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M6 10L7.5 11.5" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M18 10L16.5 11.5" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Rect x="2" y="18" width="20" height="4" rx="2" fill="#B8D8BA" opacity={0.3} />
    </Svg>
  );
}

// Kawaii Sun / Afternoon
export function SunIcon({ size = 20, color = '#F4A261' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="5" fill={color} stroke="#8B5E3C" strokeWidth={1} />
      <Circle cx="12" cy="12" r="3" fill="#FFD4A8" />
      <Path d="M12 3V5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M12 19V21" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M5 5L6.5 6.5" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M17.5 17.5L19 19" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M3 12H5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M19 12H21" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M5 19L6.5 17.5" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M17.5 6.5L19 5" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}

// Kawaii Sunset / Evening
export function SunsetIcon({ size = 20, color = '#F4A261' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 18H21" stroke="#E8D5C0" strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx="12" cy="16" r="5" fill={color} stroke="#8B5E3C" strokeWidth={1} />
      <Circle cx="12" cy="16" r="3" fill="#FFD4A8" />
      <Path d="M12 8V10" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M6.5 12L8 13.5" stroke={color} strokeWidth={1} strokeLinecap="round" />
      <Path d="M17.5 12L16 13.5" stroke={color} strokeWidth={1} strokeLinecap="round" />
      <Rect x="2" y="18" width="20" height="4" rx="2" fill="#A67C52" opacity={0.2} />
    </Svg>
  );
}

// Kawaii Checkmark / Done
export function CheckIcon({ size = 20, color = '#B8D8BA' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill={color} stroke="#8B5E3C" strokeWidth={1} />
      <Path d="M7 12.5L10.5 16L17 9" stroke="#5C3D2E" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// Kawaii Paw Print
export function PawIcon({ size = 20, color = '#E8D5C0' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Ellipse cx="12" cy="16" rx="5" ry="4" fill={color} stroke="#8B5E3C" strokeWidth={1} />
      <Circle cx="7" cy="10" r="2.5" fill={color} stroke="#8B5E3C" strokeWidth={0.8} />
      <Circle cx="17" cy="10" r="2.5" fill={color} stroke="#8B5E3C" strokeWidth={0.8} />
      <Circle cx="10" cy="6" r="2" fill={color} stroke="#8B5E3C" strokeWidth={0.8} />
      <Circle cx="14" cy="6" r="2" fill={color} stroke="#8B5E3C" strokeWidth={0.8} />
    </Svg>
  );
}

// Kawaii Heart
export function HeartIcon({ size = 20, color = '#FFB4A2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21C12 21 3 14 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 12 5C12.09 3.81 13.76 3 15.5 3C18.58 3 21 5.42 21 8.5C21 14 12 21 12 21Z"
        fill={color}
        stroke="#8B5E3C"
        strokeWidth={1}
      />
      <Circle cx="9" cy="9" r="1.5" fill="#FFFFFF" opacity={0.4} />
    </Svg>
  );
}

// Kawaii Moon / Quiet Hours — soft crescent
export function MoonIcon({ size = 20, color = '#F4A261' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 14.5C20 18.64 16.42 22 12 22C7.58 22 4 18.64 4 14.5C4 10.36 7.58 7 12 7C12.34 7 12.68 7.02 13 7.05C11.22 8.52 10 10.87 10 13.5C10 16.13 11.22 18.48 13 19.95C16.94 19.56 20 17.37 20 14.5Z"
        fill={color}
        stroke="#8B5E3C"
        strokeWidth={1.2}
      />
      {/* Stars */}
      <Circle cx="17" cy="6" r="1" fill="#E8D5C0" />
      <Circle cx="20" cy="9" r="0.7" fill="#E8D5C0" opacity={0.6} />
      <Circle cx="15" cy="4" r="0.5" fill="#E8D5C0" opacity={0.5} />
      {/* Kawaii face on moon */}
      <Circle cx="8.5" cy="14" r="0.6" fill="#5C3D2E" />
      <Circle cx="11" cy="14" r="0.6" fill="#5C3D2E" />
      <Path d="M9 16Q9.75 17 10.5 16" stroke="#5C3D2E" strokeWidth={0.6} strokeLinecap="round" fill="none" />
      <Ellipse cx="7.5" cy="15.5" rx="1" ry="0.6" fill="#FFB4A2" opacity={0.35} />
      <Ellipse cx="12" cy="15.5" rx="1" ry="0.6" fill="#FFB4A2" opacity={0.35} />
    </Svg>
  );
}

// Kawaii Cat Face — generic happy cat
export function CatFaceIcon({ size = 20, color = '#F4A261' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="14" r="9" fill={color} stroke="#8B5E3C" strokeWidth={1} />
      <Path d="M5 8L3 2L9 6Z" fill={color} stroke="#8B5E3C" strokeWidth={0.8} />
      <Path d="M19 8L21 2L15 6Z" fill={color} stroke="#8B5E3C" strokeWidth={0.8} />
      <Path d="M6 7L4.5 3.5L8.5 6Z" fill="#FFD4A8" />
      <Path d="M18 7L19.5 3.5L15.5 6Z" fill="#FFD4A8" />
      <Circle cx="9" cy="12.5" r="1.5" fill="#5C3D2E" />
      <Circle cx="9.5" cy="12" r="0.5" fill="#FFFFFF" />
      <Circle cx="15" cy="12.5" r="1.5" fill="#5C3D2E" />
      <Circle cx="15.5" cy="12" r="0.5" fill="#FFFFFF" />
      <Path d="M10.5 16Q12 17.5 13.5 16" stroke="#5C3D2E" strokeWidth={0.8} strokeLinecap="round" fill="none" />
      <Ellipse cx="7" cy="15" rx="1.5" ry="0.8" fill="#FFB4A2" opacity={0.4} />
      <Ellipse cx="17" cy="15" rx="1.5" ry="0.8" fill="#FFB4A2" opacity={0.4} />
    </Svg>
  );
}

// Happy cat mood — big smile, sparkle eyes
export function HappyCatMoodIcon({ size = 20, color = '#F4A261' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="14" r="9" fill={color} />
      <Path d="M5 8L3 2L9 6Z" fill={color} />
      <Path d="M19 8L21 2L15 6Z" fill={color} />
      <Circle cx="9" cy="12" r="1.5" fill="#5C3D2E" />
      <Circle cx="9.5" cy="11.5" r="0.6" fill="#FFFFFF" />
      <Circle cx="15" cy="12" r="1.5" fill="#5C3D2E" />
      <Circle cx="15.5" cy="11.5" r="0.6" fill="#FFFFFF" />
      <Path d="M9.5 16Q12 18.5 14.5 16" stroke="#5C3D2E" strokeWidth={1} strokeLinecap="round" fill="none" />
      <Ellipse cx="7" cy="14.5" rx="1.5" ry="0.8" fill="#FFB4A2" opacity={0.5} />
      <Ellipse cx="17" cy="14.5" rx="1.5" ry="0.8" fill="#FFB4A2" opacity={0.5} />
    </Svg>
  );
}

// Neutral cat mood — calm expression
export function NeutralCatMoodIcon({ size = 20, color = '#F4A261' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="14" r="9" fill={color} />
      <Path d="M5 8L3 2L9 6Z" fill={color} />
      <Path d="M19 8L21 2L15 6Z" fill={color} />
      <Circle cx="9" cy="12.5" r="1.3" fill="#5C3D2E" />
      <Circle cx="9.4" cy="12" r="0.5" fill="#FFFFFF" />
      <Circle cx="15" cy="12.5" r="1.3" fill="#5C3D2E" />
      <Circle cx="15.4" cy="12" r="0.5" fill="#FFFFFF" />
      <Path d="M10.5 16H13.5" stroke="#5C3D2E" strokeWidth={0.8} strokeLinecap="round" />
      <Ellipse cx="7" cy="14.5" rx="1.2" ry="0.7" fill="#FFB4A2" opacity={0.35} />
      <Ellipse cx="17" cy="14.5" rx="1.2" ry="0.7" fill="#FFB4A2" opacity={0.35} />
    </Svg>
  );
}

// Sleepy cat mood — closed eyes, zzz
export function SleepyCatMoodIcon({ size = 20, color = '#F4A261' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="14" r="9" fill={color} />
      <Path d="M5 8L3 2L9 6Z" fill={color} />
      <Path d="M19 8L21 2L15 6Z" fill={color} />
      <Path d="M7.5 12.5Q9 11 10.5 12.5" stroke="#5C3D2E" strokeWidth={1} strokeLinecap="round" fill="none" />
      <Path d="M13.5 12.5Q15 11 16.5 12.5" stroke="#5C3D2E" strokeWidth={1} strokeLinecap="round" fill="none" />
      <Path d="M10.5 16Q12 17 13.5 16" stroke="#5C3D2E" strokeWidth={0.7} strokeLinecap="round" fill="none" />
      <Ellipse cx="7" cy="14.5" rx="1.2" ry="0.7" fill="#FFB4A2" opacity={0.35} />
      <Ellipse cx="17" cy="14.5" rx="1.2" ry="0.7" fill="#FFB4A2" opacity={0.35} />
      <Path d="M19 6L21 5" stroke="#8B5E3C" strokeWidth={0.8} strokeLinecap="round" />
      <Path d="M20 4L22 3.5" stroke="#8B5E3C" strokeWidth={0.6} strokeLinecap="round" />
    </Svg>
  );
}

// Excited cat mood — star eyes, open mouth
export function ExcitedCatMoodIcon({ size = 20, color = '#F4A261' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="14" r="9" fill={color} />
      <Path d="M5 8L3 2L9 6Z" fill={color} />
      <Path d="M19 8L21 2L15 6Z" fill={color} />
      <Path d="M9 12L9.5 10.5L10 12L9.5 13.5Z" fill="#5C3D2E" />
      <Path d="M15 12L15.5 10.5L16 12L15.5 13.5Z" fill="#5C3D2E" />
      <Circle cx="9.5" cy="11.5" r="0.4" fill="#FFFFFF" />
      <Circle cx="15.5" cy="11.5" r="0.4" fill="#FFFFFF" />
      <Ellipse cx="12" cy="17" rx="2" ry="1.5" fill="#5C3D2E" />
      <Ellipse cx="12" cy="16.5" rx="1.2" ry="0.5" fill="#FFB4A2" />
      <Ellipse cx="7" cy="14.5" rx="1.5" ry="0.8" fill="#FFB4A2" opacity={0.5} />
      <Ellipse cx="17" cy="14.5" rx="1.5" ry="0.8" fill="#FFB4A2" opacity={0.5} />
    </Svg>
  );
}

// Kawaii Hat / Top Hat
export function HatIcon({ size = 20, color = '#8B5E3C' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="6" y="8" width="12" height="10" rx="2" fill={color} stroke="#5C3D2E" strokeWidth={1} />
      <Rect x="3" y="18" width="18" height="3" rx="1.5" fill={color} stroke="#5C3D2E" strokeWidth={1} />
      <Rect x="8" y="14" width="8" height="2" rx="1" fill="#F4A261" />
    </Svg>
  );
}

// Kawaii Sleep / Zzz
export function SleepIcon({ size = 20, color = '#B8D8BA' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14 4H20L14 10H20" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 12H12L8 16H12" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
      <Path d="M4 18H7L4 21H7" stroke={color} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
    </Svg>
  );
}

// Kawaii Calendar
export function CalendarIcon({ size = 20, color = '#F4A261' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="5" width="18" height="16" rx="3" fill="#FFF5E6" stroke="#8B5E3C" strokeWidth={1.2} />
      <Rect x="3" y="5" width="18" height="6" rx="3" fill={color} stroke="#8B5E3C" strokeWidth={1.2} />
      <Line x1="8" y1="3" x2="8" y2="7" stroke="#8B5E3C" strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="16" y1="3" x2="16" y2="7" stroke="#8B5E3C" strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx="8" cy="15" r="1" fill="#8B5E3C" />
      <Circle cx="12" cy="15" r="1" fill="#8B5E3C" />
      <Circle cx="16" cy="15" r="1" fill="#8B5E3C" />
      <Circle cx="8" cy="18.5" r="1" fill="#8B5E3C" opacity={0.4} />
      <Circle cx="12" cy="18.5" r="1" fill="#8B5E3C" opacity={0.4} />
    </Svg>
  );
}

// Kawaii Beaker / Test
export function BeakerIcon({ size = 20, color = '#B8D8BA' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 3H15V9L19 19C19.5 20.5 18.5 22 17 22H7C5.5 22 4.5 20.5 5 19L9 9V3Z" fill="#FFF5E6" stroke="#8B5E3C" strokeWidth={1.2} />
      <Path d="M9 12L5 19C4.5 20.5 5.5 22 7 22H17C18.5 22 19.5 20.5 19 19L15 12H9Z" fill={color} opacity={0.5} />
      <Line x1="7" y1="3" x2="17" y2="3" stroke="#8B5E3C" strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx="11" cy="16" r="1" fill="#F4A261" opacity={0.7} />
      <Circle cx="14" cy="18" r="0.8" fill="#F4A261" opacity={0.5} />
    </Svg>
  );
}
