import { useEffect, useState } from 'react';
export function useContrast() {
  const [contrast, setContrast] = useState<boolean>(localStorage.getItem('contrast') === 'true');

  useEffect(() => {
    const handleStorageChange = () => {
      const newContrast = localStorage.getItem('contrast') === 'true';
      setContrast(newContrast);
    };

    // Lắng nghe sự kiện `storage` từ các tab khác
    window.addEventListener('storage', handleStorageChange);

    // Lắng nghe thay đổi trong cùng tab
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      originalSetItem.call(this, key, value);
      if (key === 'contrast') {
        window.dispatchEvent(new Event('storage'));
      }
    };

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  return contrast;
}
