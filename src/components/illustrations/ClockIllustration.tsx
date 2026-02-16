import React from 'react';
import Svg, { Circle, Path, G, Rect, Ellipse } from 'react-native-svg';

export default function ClockIllustration({ width = 200, height = 200 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 200 200">
      {/* Sparkles */}
      <Path d="M30 35 L33 25 L36 35 L33 45 Z" fill="#B8D8BA" />
      <Path d="M165 30 L168 22 L171 30 L168 38 Z" fill="#FFB4A2" />
      <Path d="M25 140 L27 134 L29 140 L27 146 Z" fill="#F4A261" opacity="0.6" />
      <Path d="M175 125 L177 119 L179 125 L177 131 Z" fill="#B8D8BA" opacity="0.6" />
      {/* Tiny floating hearts */}
      <Path d="M155 55 Q160 48 165 55 Q160 65 155 58 Q150 65 145 55 Q150 48 155 55 Z" fill="#FFB4A2" opacity="0.5" />
      <Path d="M40 60 Q43 55 46 60 Q43 67 40 62 Q37 67 34 60 Q37 55 40 60 Z" fill="#FFB4A2" opacity="0.4" />

      {/* Body */}
      <Ellipse cx="100" cy="155" rx="35" ry="25" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />
      {/* Tail */}
      <Path d="M135 155 Q160 140 155 115" stroke="#5C3D2E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Path d="M135 155 Q158 138 153 117" stroke="#F4A261" strokeWidth="5" fill="none" strokeLinecap="round" />

      {/* Cat Head */}
      <Circle cx="100" cy="90" r="52" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />
      {/* Inner ear */}
      <Path d="M60 55 L48 25 L80 45 Z" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />
      <Path d="M63 50 L54 30 L75 44 Z" fill="#FFB4A2" />
      <Path d="M140 55 L152 25 L120 45 Z" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />
      <Path d="M137 50 L146 30 L125 44 Z" fill="#FFB4A2" />

      {/* Clock Face - held by cat */}
      <Circle cx="100" cy="105" r="28" fill="#FFF9F0" stroke="#5C3D2E" strokeWidth="2.5" />
      <Circle cx="100" cy="105" r="24" fill="#FFF9F0" stroke="#E8D5C0" strokeWidth="1" />
      {/* Clock numbers */}
      <Circle cx="100" cy="84" r="2" fill="#A67C52" />
      <Circle cx="121" cy="105" r="2" fill="#A67C52" />
      <Circle cx="100" cy="126" r="2" fill="#A67C52" />
      <Circle cx="79" cy="105" r="2" fill="#A67C52" />
      {/* Clock Hands */}
      <Path d="M100 105 L100 89" stroke="#5C3D2E" strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M100 105 L113 105" stroke="#F4A261" strokeWidth="2.5" strokeLinecap="round" />
      <Circle cx="100" cy="105" r="3" fill="#5C3D2E" />

      {/* Eyes - sparkle style */}
      <Circle cx="82" cy="78" r="5" fill="#5C3D2E" />
      <Circle cx="83" cy="76" r="2" fill="#FFFFFF" />
      <Circle cx="118" cy="78" r="5" fill="#5C3D2E" />
      <Circle cx="119" cy="76" r="2" fill="#FFFFFF" />

      {/* Kawaii blush */}
      <Ellipse cx="72" cy="87" rx="7" ry="4" fill="#FFB4A2" opacity="0.5" />
      <Ellipse cx="128" cy="87" rx="7" ry="4" fill="#FFB4A2" opacity="0.5" />

      {/* Mouth - cute 'w' shape */}
      <Path d="M93 90 Q96 94 100 90 Q104 94 107 90" stroke="#5C3D2E" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Paws holding clock */}
      <Ellipse cx="72" cy="115" rx="12" ry="10" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />
      <Path d="M64 112 L67 112 M70 112 L73 112 M76 112 L79 112" stroke="#5C3D2E" strokeWidth="1.2" strokeLinecap="round" />
      <Ellipse cx="128" cy="115" rx="12" ry="10" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />
      <Path d="M121 112 L124 112 M127 112 L130 112 M133 112 L136 112" stroke="#5C3D2E" strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
  );
}
