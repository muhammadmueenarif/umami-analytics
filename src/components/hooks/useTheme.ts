import { useEffect, useMemo, useState } from 'react';
import useStore, { setTheme } from '@/store/app';
import { getItem, setItem } from '@/lib/storage';
import { DEFAULT_THEME, THEME_COLORS, THEME_CONFIG } from '@/lib/constants';
import { colord } from 'colord';

const selector = (state: { theme: string }) => state.theme;

export function useTheme() {
  const theme = useStore(selector) || getItem(THEME_CONFIG) || DEFAULT_THEME;
  const [colorUpdate, setColorUpdate] = useState(0);
  
  // Get primary color from CSS variable (set by appearance settings) or fallback to theme default
  const getPrimaryColor = () => {
    if (typeof window !== 'undefined') {
      const customPrimary = getComputedStyle(document.documentElement)
        .getPropertyValue('--custom-primary')
        .trim();
      if (customPrimary) {
        return customPrimary;
      }
    }
    return THEME_COLORS[theme].primary;
  };

  // Listen for CSS variable changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setColorUpdate(prev => prev + 1);
    });
    
    if (typeof window !== 'undefined') {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style'],
      });
    }
    
    return () => observer.disconnect();
  }, []);

  const colors = useMemo(() => {
    const primary = getPrimaryColor();
    const primaryColorObj = colord(primary);
    
    return {
      theme: {
        ...THEME_COLORS[theme],
        primary, // Use the custom primary if set
      },
      chart: {
        text: THEME_COLORS[theme].gray700,
        line: THEME_COLORS[theme].gray200,
        views: {
          hoverBackgroundColor: primaryColorObj.alpha(0.7).toRgbString(),
          backgroundColor: primaryColorObj.alpha(0.4).toRgbString(),
          borderColor: primaryColorObj.alpha(0.7).toRgbString(),
          hoverBorderColor: primaryColorObj.toRgbString(),
          // Add solid color for direct use
          color: primary,
        },
        visitors: {
          hoverBackgroundColor: primaryColorObj.alpha(0.9).toRgbString(),
          backgroundColor: primaryColorObj.alpha(0.6).toRgbString(),
          borderColor: primaryColorObj.alpha(0.9).toRgbString(),
          hoverBorderColor: primaryColorObj.toRgbString(),
          // Add solid color for direct use
          color: primary,
        },
      },
      map: {
        baseColor: primary,
        fillColor: THEME_COLORS[theme].gray100,
        strokeColor: primary,
        hoverColor: primary,
      },
    };
  }, [theme, colorUpdate]);

  const saveTheme = (value: string) => {
    setItem(THEME_CONFIG, value);
    setTheme(value);
  };

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const url = new URL(window?.location?.href);
    const theme = url.searchParams.get('theme');

    if (['light', 'dark'].includes(theme)) {
      saveTheme(theme);
    }
  }, []);

  return { theme, saveTheme, colors };
}

export default useTheme;
