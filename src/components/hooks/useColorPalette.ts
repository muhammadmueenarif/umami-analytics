import { useEffect, useState, useCallback } from 'react';
import { getItem, setItem } from '@/lib/storage';
import { COLOR_PALETTE_CONFIG, COLOR_PALETTES, THEME_COLORS } from '@/lib/constants';

export function useColorPalette() {
  const [selectedPalette, setSelectedPalette] = useState<string>('default');

  const applyPaletteToDocument = useCallback((paletteKey: string) => {
    if (paletteKey === 'default') {
      // Reset to default colors
      const root = document.documentElement;
      const theme = getItem('umami.theme') || 'light';
      const defaultPrimary = THEME_COLORS[theme as 'light' | 'dark'].primary;

      root.style.setProperty('--custom-primary', defaultPrimary);
      root.style.setProperty('--custom-secondary', '');
      root.style.setProperty('--custom-accent', '');
      return;
    }

    const palette = COLOR_PALETTES[paletteKey as keyof typeof COLOR_PALETTES];
    if (!palette) return;

    const root = document.documentElement;

    // Apply custom color variables
    root.style.setProperty('--custom-primary', palette.primary);
    root.style.setProperty('--custom-secondary', palette.secondary);
    root.style.setProperty('--custom-accent', palette.accent);

    // Update primary colors that are used throughout the UI
    root.style.setProperty('--primary400', palette.primary);
    root.style.setProperty('--primary500', palette.secondary || palette.primary);
    root.style.setProperty('--primary600', palette.accent || palette.secondary || palette.primary);
    root.style.setProperty('--primary700', palette.accent || palette.secondary || palette.primary);
  }, []);

  useEffect(() => {
    // Load saved palette on mount
    const saved = getItem(COLOR_PALETTE_CONFIG) || 'default';
    setSelectedPalette(saved);

    if (saved !== 'default') {
      applyPaletteToDocument(saved);
    }
  }, [applyPaletteToDocument]);

  const applyPalette = useCallback(
    (paletteKey: string, palette: any) => {
      setItem(COLOR_PALETTE_CONFIG, paletteKey);
      setSelectedPalette(paletteKey);
      applyPaletteToDocument(paletteKey);
    },
    [applyPaletteToDocument],
  );

  const resetToDefault = useCallback(() => {
    setItem(COLOR_PALETTE_CONFIG, 'default');
    setSelectedPalette('default');
    applyPaletteToDocument('default');
  }, [applyPaletteToDocument]);

  return {
    selectedPalette,
    applyPalette,
    resetToDefault,
  };
}

export default useColorPalette;
