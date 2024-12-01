import { Chip, ChipProps } from '@mui/material';

const lightenColor = (hex: string, amount: number): string => {
  const sanitizedHex = hex.replace('#', '');
  const bigint = parseInt(sanitizedHex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  // Làm sáng mỗi kênh màu
  r = Math.min(255, Math.floor(r + (255 - r) * (amount / 100)));
  g = Math.min(255, Math.floor(g + (255 - g) * (amount / 100)));
  b = Math.min(255, Math.floor(b + (255 - b) * (amount / 100)));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};
export const CustomChip = (props: { customColor?: string } & ChipProps) => {
  const { customColor = '#f0f0f0', ...rest } = props;
  const backgroundColor = lightenColor(customColor, 80); // Làm sáng 20%

  return (
    <Chip
      style={{ color: customColor, backgroundColor: backgroundColor, fontWeight: 700 }}
      {...rest}
    />
  );
};
