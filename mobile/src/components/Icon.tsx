import { type ColorValue, Text } from 'react-native';

import glyphmap from '@/assets/fonts/glyphmap.json';

export type IconName = keyof typeof glyphmap;

type Props = { name: IconName; size?: number; color: ColorValue; filled?: boolean };

export function Icon({ name, size = 22, color, filled = false }: Props) {
  return (
    <Text
      style={{
        fontFamily: filled ? 'MaterialSymbolsFill' : 'MaterialSymbolsOutline',
        fontSize: size,
        lineHeight: size,
        color,
      }}
      aria-hidden>
      {String.fromCodePoint(glyphmap[name])}
    </Text>
  );
}
