import React from 'react';
import Svg, { Circle, Path, Rect, Ellipse } from 'react-native-svg';

export default function ListIllustration({ width = 200, height = 200 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 200 200">
      {/* Sparkles */}
      <Path d="M28 50 L31 42 L34 50 L31 58 Z" fill="#B8D8BA" />
      <Path d="M170 40 L173 32 L176 40 L173 48 Z" fill="#F4A261" opacity="0.6" />
      <Path d="M22 130 L24 124 L26 130 L24 136 Z" fill="#FFB4A2" opacity="0.5" />
      {/* Floating pills */}
      <Rect x="160" y="110" width="18" height="8" rx="4" fill="#B8D8BA" opacity="0.4" transform="rotate(-20 169 114)" />
      <Rect x="18" y="95" width="16" height="7" rx="3.5" fill="#F4A261" opacity="0.35" transform="rotate(15 26 98)" />

      {/* Body */}
      <Ellipse cx="100" cy="160" rx="38" ry="24" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />

      {/* Cat Head */}
      <Circle cx="100" cy="80" r="50" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />
      {/* Ears */}
      <Path d="M60 48 L46 16 L78 38 Z" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />
      <Path d="M63 44 L53 22 L74 38 Z" fill="#FFB4A2" />
      <Path d="M140 48 L154 16 L122 38 Z" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />
      <Path d="M137 44 L147 22 L126 38 Z" fill="#FFB4A2" />

      {/* Glasses - cute round */}
      <Circle cx="82" cy="74" r="12" fill="none" stroke="#5C3D2E" strokeWidth="2" />
      <Circle cx="118" cy="74" r="12" fill="none" stroke="#5C3D2E" strokeWidth="2" />
      <Path d="M94 74 L106 74" stroke="#5C3D2E" strokeWidth="2" />
      <Path d="M70 72 L60 68" stroke="#5C3D2E" strokeWidth="2" strokeLinecap="round" />
      <Path d="M130 72 L140 68" stroke="#5C3D2E" strokeWidth="2" strokeLinecap="round" />
      {/* Eyes behind glasses */}
      <Circle cx="82" cy="74" r="4" fill="#5C3D2E" />
      <Circle cx="83" cy="72" r="1.5" fill="#FFFFFF" />
      <Circle cx="118" cy="74" r="4" fill="#5C3D2E" />
      <Circle cx="119" cy="72" r="1.5" fill="#FFFFFF" />

      {/* Kawaii blush */}
      <Ellipse cx="70" cy="88" rx="7" ry="4" fill="#FFB4A2" opacity="0.5" />
      <Ellipse cx="130" cy="88" rx="7" ry="4" fill="#FFB4A2" opacity="0.5" />

      {/* Mouth */}
      <Path d="M93 94 Q96 98 100 94 Q104 98 107 94" stroke="#5C3D2E" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Clipboard */}
      <Rect x="68" y="110" width="64" height="52" rx="6" fill="#FFF5E6" stroke="#5C3D2E" strokeWidth="2.5" />
      {/* Clipboard clip */}
      <Rect x="90" y="105" width="20" height="10" rx="3" fill="#E8D5C0" stroke="#5C3D2E" strokeWidth="2" />
      {/* Checklist items */}
      <Rect x="78" y="122" width="8" height="8" rx="2" fill="#B8D8BA" stroke="#5C3D2E" strokeWidth="1.5" />
      <Path d="M80 126 L82 128 L85 123" stroke="#5C3D2E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <Rect x="90" y="123" width="32" height="5" rx="2.5" fill="#E8D5C0" />
      <Rect x="78" y="136" width="8" height="8" rx="2" fill="#B8D8BA" stroke="#5C3D2E" strokeWidth="1.5" />
      <Path d="M80 140 L82 142 L85 137" stroke="#5C3D2E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <Rect x="90" y="137" width="28" height="5" rx="2.5" fill="#E8D5C0" />
      <Rect x="78" y="150" width="8" height="8" rx="2" fill="#FFF9F0" stroke="#E8D5C0" strokeWidth="1.5" />
      <Rect x="90" y="151" width="24" height="5" rx="2.5" fill="#E8D5C0" opacity="0.5" />

      {/* Paws holding clipboard */}
      <Ellipse cx="62" cy="130" rx="12" ry="10" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />
      <Ellipse cx="138" cy="130" rx="12" ry="10" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />
    </Svg>
  );
}
