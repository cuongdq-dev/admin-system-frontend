import { forwardRef, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { labelClasses } from './classes';
import { StyledLabel } from './styles';

import { LinearProgress, Typography, TypographyProps } from '@mui/material';
import { Iconify, IconifyProps } from '../iconify';
import type { LabelProps } from './types';

// ----------------------------------------------------------------------

export const Label = forwardRef<HTMLSpanElement, LabelProps>(
  (
    { children, color = 'default', variant = 'soft', startIcon, endIcon, sx, className, ...other },
    ref
  ) => {
    const theme = useTheme();

    const iconStyles = {
      width: 16,
      height: 16,
      '& svg, img': {
        width: 1,
        height: 1,
        objectFit: 'cover',
      },
    };

    return (
      <StyledLabel
        ref={ref}
        component="span"
        className={labelClasses.root.concat(className ? ` ${className}` : '')}
        ownerState={{ color, variant }}
        sx={{ ...(startIcon && { pl: 0.75 }), ...(endIcon && { pr: 0.75 }), ...sx }}
        theme={theme}
        {...other}
      >
        {startIcon && (
          <Box component="span" className={labelClasses.icon} sx={{ mr: 0.75, ...iconStyles }}>
            {startIcon}
          </Box>
        )}

        {typeof children === 'string' ? sentenceCase(children) : children}

        {endIcon && (
          <Box component="span" className={labelClasses.icon} sx={{ ml: 0.75, ...iconStyles }}>
            {endIcon}
          </Box>
        )}
      </StyledLabel>
    );
  }
);

// ----------------------------------------------------------------------

function sentenceCase(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const TimeAgo = ({
  timestamp,
  isFetching,
  icon = { width: 15, icon: 'mingcute:time-fill', color: 'grey' },
  ...props
}: {
  timestamp: string | number | Date;
  icon?: IconifyProps;
  isFetching?: boolean;
} & TypographyProps) => {
  if (!timestamp) return <></>;

  if (isFetching) return <LinearProgress sx={{ height: 2, marginTop: 2 }} />;
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const timeDiff = now.getTime() - new Date(timestamp).getTime();
      const seconds = Math.floor(timeDiff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (seconds < 60) {
        if (seconds < 5) {
          setTimeAgo(`Update just now.`);
        } else {
          setTimeAgo(`Update ${seconds} seconds ago.`);
        }
      } else if (minutes < 60) {
        setTimeAgo(`Update ${minutes} minutes ago.`);
      } else if (hours < 24) {
        setTimeAgo(`Update ${hours} hours ago.`);
      } else {
        setTimeAgo(`Update ${days} days ago.`);
      }
    };

    updateTimeAgo();
    const intervalId = setInterval(updateTimeAgo, 10000);
    return () => clearInterval(intervalId);
  }, [timestamp]);

  return (
    <Typography
      variant="subtitle2"
      color="grey"
      fontWeight={200}
      fontStyle={'italic'}
      display={'flex'}
      alignItems={'center'}
      gap={1}
      {...props}
    >
      <Iconify {...icon} />
      {timeAgo}
    </Typography>
  );
};
