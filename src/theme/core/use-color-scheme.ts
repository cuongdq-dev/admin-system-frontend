import { useEffect, useState } from 'react';
import COLORS_JSON from './colors.json';

function getScheme(scheme: string) {
  return COLORS_JSON[scheme as keyof typeof COLORS_JSON];
}

export function useColorScheme(defaultScheme: string = 'color_1') {
  const [colorScheme, setColorScheme] = useState<string>(
    localStorage.getItem('color-scheme') || defaultScheme
  );
  const [colors, setColors] = useState(getScheme(colorScheme));

  useEffect(() => {
    const handleStorageChange = () => {
      const newScheme = localStorage.getItem('color-scheme') || defaultScheme;
      setColorScheme(newScheme);
      setColors(getScheme(newScheme));
    };

    // Lắng nghe sự kiện `storage` từ các tab khác
    window.addEventListener('storage', handleStorageChange);

    // Lắng nghe thay đổi trong cùng tab
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      originalSetItem.call(this, key, value);
      if (key === 'color-scheme') {
        window.dispatchEvent(new Event('storage'));
      }
    };

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, [defaultScheme]);

  return colors;
}
