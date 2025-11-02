'use client';
import { useEffect } from 'react';
import { getItem } from '@/lib/storage';
import { COLOR_PALETTE_CONFIG, COLOR_PALETTES } from '@/lib/constants';

export function ColorPaletteInitializer() {
  useEffect(() => {
    const savedPalette = getItem(COLOR_PALETTE_CONFIG);

    if (savedPalette && savedPalette !== 'default') {
      const palette = COLOR_PALETTES[savedPalette as keyof typeof COLOR_PALETTES];

      if (palette) {
        const root = document.documentElement;
        root.style.setProperty('--custom-primary', palette.primary);
        root.style.setProperty('--custom-secondary', palette.secondary);
        root.style.setProperty('--custom-accent', palette.accent);

        // Update primary colors
        root.style.setProperty('--primary400', palette.primary);
        root.style.setProperty('--primary500', palette.secondary || palette.primary);
        root.style.setProperty(
          '--primary600',
          palette.accent || palette.secondary || palette.primary,
        );
        root.style.setProperty(
          '--primary700',
          palette.accent || palette.secondary || palette.primary,
        );
      }
    }
  }, []);

  return null;
}

export default ColorPaletteInitializer;
