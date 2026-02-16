import React from 'react';
import Svg, { Circle, Path, Ellipse, Rect } from 'react-native-svg';

export default function PetIllustration({ width = 200, height = 200 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 200 200">
      {/* Sparkles */}
      <Path d="M25 45 L28 35 L31 45 L28 55 Z" fill="#B8D8BA" />
      <Path d="M170 35 L173 27 L176 35 L173 43 Z" fill="#FFB4A2" />
      <Path d="M160 140 L162 134 L164 140 L162 146 Z" fill="#B8D8BA" opacity="0.6" />
      <Path d="M30 120 L32 114 L34 120 L32 126 Z" fill="#F4A261" opacity="0.5" />

      {/* Floating hearts */}
      <Path d="M40 60 Q45 52 50 60 Q45 70 40 63 Q35 70 30 60 Q35 52 40 60 Z" fill="#FFB4A2" opacity="0.5" />
      <Path d="M165 60 Q168 55 171 60 Q168 67 165 62 Q162 67 159 60 Q162 55 165 60 Z" fill="#FFB4A2" opacity="0.4" />
      <Path d="M150 25 Q154 18 158 25 Q154 34 150 27 Q146 34 142 25 Q146 18 150 25 Z" fill="#FF9999" opacity="0.6" />

      {/* Body */}
      <Ellipse cx="100" cy="155" rx="40" ry="28" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />
      {/* Tail - curled up happily */}
      <Path d="M140 155 Q170 135 165 105 Q162 90 150 95" stroke="#5C3D2E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Path d="M140 155 Q168 133 163 107 Q161 93 151 97" stroke="#F4A261" strokeWidth="6" fill="none" strokeLinecap="round" />

      {/* Cat Head */}
      <Circle cx="100" cy="82" r="52" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />
      {/* Ears */}
      <Path d="M58 50 L44 18 L78 40 Z" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />
      <Path d="M62 46 L52 24 L74 40 Z" fill="#FFB4A2" />
      <Path d="M142 50 L156 18 L122 40 Z" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />
      <Path d="M138 46 L148 24 L126 40 Z" fill="#FFB4A2" />

      {/* Eyes - big sparkle eyes (excited!) */}
      <Circle cx="80" cy="74" r="8" fill="#5C3D2E" />
      <Circle cx="82" cy="71" r="3" fill="#FFFFFF" />
      <Circle cx="78" cy="76" r="1.5" fill="#FFFFFF" />
      <Circle cx="120" cy="74" r="8" fill="#5C3D2E" />
      <Circle cx="122" cy="71" r="3" fill="#FFFFFF" />
      <Circle cx="118" cy="76" r="1.5" fill="#FFFFFF" />

      {/* Kawaii blush */}
      <Ellipse cx="68" cy="88" rx="8" ry="5" fill="#FFB4A2" opacity="0.55" />
      <Ellipse cx="132" cy="88" rx="8" ry="5" fill="#FFB4A2" opacity="0.55" />

      {/* Big smile */}
      <Path d="M88 94 Q94 102 100 94 Q106 102 112 94" stroke="#5C3D2E" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Waving paw (right) */}
      <Ellipse cx="148" cy="110" rx="12" ry="10" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" transform="rotate(-20 148 110)" />
      <Path d="M142 107 L144 105 M147 106 L149 104 M152 107 L154 105" stroke="#5C3D2E" strokeWidth="1.2" strokeLinecap="round" />

      {/* Left paw (resting) */}
      <Ellipse cx="60" cy="130" rx="12" ry="10" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />

      {/* Little feet */}
      <Ellipse cx="78" cy="178" rx="12" ry="7" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2" />
      <Ellipse cx="122" cy="178" rx="12" ry="7" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2" />

      {/* Motion lines from waving */}
      <Path d="M160 95 L168 92" stroke="#E8D5C0" strokeWidth="2" strokeLinecap="round" />
      <Path d="M162 105 L170 104" stroke="#E8D5C0" strokeWidth="2" strokeLinecap="round" />
      <Path d="M158 115 L166 116" stroke="#E8D5C0" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}
