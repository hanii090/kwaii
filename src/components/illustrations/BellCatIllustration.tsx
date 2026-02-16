import React from 'react';
import Svg, { Circle, Path, Ellipse, Rect } from 'react-native-svg';

export default function BellCatIllustration({ width = 200, height = 200 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 200 200">
      {/* Sparkles */}
      <Path d="M25 50 L28 40 L31 50 L28 60 Z" fill="#B8D8BA" />
      <Path d="M172 42 L175 34 L178 42 L175 50 Z" fill="#FFB4A2" />
      <Path d="M35 135 L37 129 L39 135 L37 141 Z" fill="#F4A261" opacity="0.5" />
      <Path d="M168 130 L170 124 L172 130 L170 136 Z" fill="#B8D8BA" opacity="0.6" />

      {/* Floating notification icons */}
      <Circle cx="38" cy="75" r="8" fill="#B8D8BA" opacity="0.4" />
      <Rect x="35" y="72" width="6" height="4" rx="1" fill="#FFF9F0" opacity="0.8" />
      <Circle cx="162" cy="80" r="7" fill="#FFB4A2" opacity="0.35" />
      <Rect x="159" y="77" width="6" height="4" rx="1" fill="#FFF9F0" opacity="0.8" />

      {/* Small floating bells */}
      <Path d="M155 50 Q155 42 162 42 Q169 42 169 50 L170 52 L154 52 Z" fill="#F4A261" opacity="0.35" />
      <Circle cx="162" cy="53" r="2" fill="#F4A261" opacity="0.35" />
      <Path d="M30 100 Q30 94 35 94 Q40 94 40 100 L41 101 L29 101 Z" fill="#B8D8BA" opacity="0.35" />
      <Circle cx="35" cy="102" r="1.5" fill="#B8D8BA" opacity="0.35" />

      {/* Body */}
      <Ellipse cx="100" cy="158" rx="38" ry="26" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />
      {/* Tail */}
      <Path d="M138 158 Q165 140 160 112" stroke="#5C3D2E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Path d="M138 158 Q163 138 158 114" stroke="#F4A261" strokeWidth="5.5" fill="none" strokeLinecap="round" />

      {/* Cat Head */}
      <Circle cx="100" cy="85" r="52" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />
      {/* Ears */}
      <Path d="M58 53 L44 20 L78 42 Z" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />
      <Path d="M62 48 L52 26 L74 42 Z" fill="#FFB4A2" />
      <Path d="M142 53 L156 20 L122 42 Z" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />
      <Path d="M138 48 L148 26 L126 42 Z" fill="#FFB4A2" />

      {/* Big bell held by cat */}
      <Path d="M78 108 Q78 88 100 88 Q122 88 122 108 L126 112 L74 112 Z" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />
      <Rect x="74" y="112" width="52" height="6" rx="3" fill="#E8D5C0" stroke="#5C3D2E" strokeWidth="2" />
      <Circle cx="100" cy="121" r="5" fill="#5C3D2E" />
      {/* Bell shine */}
      <Path d="M86 96 Q86 92 90 92" stroke="#FFF9F0" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Sound waves from bell */}
      <Path d="M130 100 Q136 95 136 105" stroke="#E8D5C0" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d="M138 96 Q144 90 144 108" stroke="#E8D5C0" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <Path d="M70 100 Q64 95 64 105" stroke="#E8D5C0" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d="M62 96 Q56 90 56 108" stroke="#E8D5C0" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Eyes - happy closed (^_^) */}
      <Path d="M78 75 Q83 68 88 75" stroke="#5C3D2E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Path d="M112 75 Q117 68 122 75" stroke="#5C3D2E" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Kawaii blush */}
      <Ellipse cx="72" cy="82" rx="7" ry="4.5" fill="#FFB4A2" opacity="0.55" />
      <Ellipse cx="128" cy="82" rx="7" ry="4.5" fill="#FFB4A2" opacity="0.55" />

      {/* Happy mouth */}
      <Path d="M93 86 Q100 93 107 86" stroke="#5C3D2E" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Paws holding bell */}
      <Ellipse cx="72" cy="115" rx="11" ry="9" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />
      <Ellipse cx="128" cy="115" rx="11" ry="9" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2.5" />

      {/* Little feet */}
      <Ellipse cx="80" cy="180" rx="11" ry="6" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2" />
      <Ellipse cx="120" cy="180" rx="11" ry="6" fill="#F4A261" stroke="#5C3D2E" strokeWidth="2" />
    </Svg>
  );
}
