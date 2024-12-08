import { IconButton } from '@mui/material';
import { Iconify, IconifyProps } from '../iconify';

const SpinAnimationStyles = {
  animation: 'spin 3s linear infinite',
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

export const SpinIconAnimation = (props: IconifyProps) => {
  return <Iconify sx={SpinAnimationStyles} {...props} />;
};

const BellShakeAnimationStyles = {
  animation: 'shake 0.5s ease-in-out infinite', // Lắc trong 0.5 giây, lặp vô hạn
  '@keyframes shake': {
    '0%': { transform: 'rotate(0deg)' },
    '25%': { transform: 'rotate(-15deg)' },
    '50%': { transform: 'rotate(15deg)' },
    '75%': { transform: 'rotate(-10deg)' },
    '100%': { transform: 'rotate(0deg)' },
  },
};

export const BellIconShakeAnimation = (props: IconifyProps) => {
  return <Iconify sx={BellShakeAnimationStyles} {...props} />;
};

export const RefreshIcon = (props: { icon?: string; loading?: boolean }) => {
  const { icon = 'mdi:refresh', loading } = props;
  return (
    <Iconify
      icon={icon}
      sx={
        loading
          ? {
              ...SpinAnimationStyles,
              animation: 'spin 1s linear infinite',
              color: 'primary.main',
            }
          : undefined
      }
    />
  );
};
