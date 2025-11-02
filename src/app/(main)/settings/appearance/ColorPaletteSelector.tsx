'use client';
import { useState, useEffect } from 'react';
import { Button } from 'react-basics';
import { COLOR_PALETTES, COLOR_PALETTE_CONFIG } from '@/lib/constants';
import { getItem } from '@/lib/storage';
import { useColorPalette } from '@/components/hooks/useColorPalette';
import styles from './ColorPaletteSelector.module.css';

export default function ColorPaletteSelector() {
  const { selectedPalette, applyPalette, resetToDefault } = useColorPalette();
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const saved = getItem(COLOR_PALETTE_CONFIG);
    setHasChanges(!!saved && saved !== 'default');
  }, [selectedPalette]);

  const handlePaletteSelect = (paletteKey: string) => {
    const palette = COLOR_PALETTES[paletteKey as keyof typeof COLOR_PALETTES];
    if (palette) {
      applyPalette(paletteKey, palette);
      setHasChanges(paletteKey !== 'default');
    }
  };

  const handleReset = () => {
    resetToDefault();
    setHasChanges(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Quick Presets</h3>
        <p className={styles.sectionDescription}>Choose from pre-defined color palettes</p>
        <div className={styles.presets}>
          {Object.entries(COLOR_PALETTES).map(([key, palette]) => (
            <button
              key={key}
              className={`${styles.presetButton} ${
                selectedPalette === key ? styles.presetButtonActive : ''
              }`}
              onClick={() => handlePaletteSelect(key)}
              aria-label={`Select ${palette.name} palette`}
            >
              <div className={styles.colorCircles}>
                <div className={styles.colorCircle} style={{ backgroundColor: palette.primary }} />
                <div
                  className={styles.colorCircle}
                  style={{ backgroundColor: palette.secondary }}
                />
                <div className={styles.colorCircle} style={{ backgroundColor: palette.accent }} />
              </div>
              <span className={styles.presetLabel}>{palette.name}</span>
              {selectedPalette === key && <div className={styles.checkIcon}>✓</div>}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="quiet" onClick={handleReset} disabled={!hasChanges}>
          Reset to Default
        </Button>
        {hasChanges && <span className={styles.savedMessage}>✓ Colors saved automatically</span>}
      </div>
    </div>
  );
}
