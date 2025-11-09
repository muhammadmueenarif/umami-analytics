'use client';
import { useEffect } from 'react';
import { getItem } from '@/lib/storage';
import { COLOR_PALETTE_CONFIG, COLOR_PALETTES, THEME_COLORS } from '@/lib/constants';
import { hex2RGB } from '@/lib/colors';

export function ColorPaletteInitializer() {
  useEffect(() => {
    const savedPalette = getItem(COLOR_PALETTE_CONFIG);
    const root = document.documentElement;

    if (savedPalette && savedPalette !== 'default') {
      const palette = COLOR_PALETTES[savedPalette as keyof typeof COLOR_PALETTES];

      if (palette) {
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
        
        // Set RGB values for use in rgba() shadows
        const primaryRGB = hex2RGB(palette.primary);
        root.style.setProperty('--primary400-rgb', `${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}`);
        
        // Force a repaint to ensure CSS variables update
        root.style.setProperty('--shadow-update', Date.now().toString());
      }
    } else {
      // Initialize default RGB values
      const theme = getItem('umami.theme') || 'light';
      const defaultPrimary = THEME_COLORS[theme as 'light' | 'dark'].primary;
      const primaryRGB = hex2RGB(defaultPrimary);
      root.style.setProperty('--primary400-rgb', `${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}`);
      
      // Force a repaint to ensure CSS variables update
      root.style.setProperty('--shadow-update', Date.now().toString());
    }
  }, []);

  return null;
}

export default ColorPaletteInitializer;
