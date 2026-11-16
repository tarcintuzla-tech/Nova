import React from 'react';
import { Text as RNText, TextProps, TextStyle } from 'react-native';
import { font, type Palette } from '../constants/theme';
import { useColors } from '../hooks/useColors';

const make = (build: (c: Palette) => TextStyle, header = false) =>
  function Txt(p: TextProps) {
    const c = useColors();
    return <RNText accessibilityRole={header ? 'header' : undefined} {...p} style={[build(c), p.style]} />;
  };

export const Title = make((c) => ({ fontSize: font.title, fontWeight: '700', color: c.accent }), true);
export const Heading = make((c) => ({ fontSize: font.heading, fontWeight: '600', color: c.text }), true);
export const Body = make((c) => ({ fontSize: font.body, lineHeight: 24, color: c.text }));
export const Muted = make((c) => ({ fontSize: font.small, lineHeight: 18, color: c.muted }));
