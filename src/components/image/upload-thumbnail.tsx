import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CameraAltRounded from '@mui/icons-material/CameraAltRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, ButtonBase, CircularProgress, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import Button from '@mui/material/Button';
import { varAlpha } from 'src/theme/styles';

// Styled components
const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: '100%',
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  '&:hover .MuiImageBackdrop-root': {
    opacity: 0.15,
  },
}));

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create('opacity'),
}));

const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
}));

const RemoveButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  '&:hover': {
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
  },
}));

// Props
interface ImageUploadProps {
  value?: File | string;
  defaultValue?: File | string;
  onChange?: (file?: File | string) => void;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  defaultValue,
  disabled,
  onChange,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const fileUrl = value instanceof File ? URL.createObjectURL(value) : value;

  const handleClickUpload = () => {
    if (!isUploading) inputRef.current?.click();
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setIsUploading(true);

      setTimeout(() => {
        onChange && onChange(selectedFile);
        setIsUploading(false);
      }, 1500);
    }
  };

  const handleRemove = () => {
    onChange && onChange(defaultValue);
  };

  return (
    <Box width="100%" height="100%">
      <input
        disabled={disabled}
        ref={inputRef}
        type="file"
        hidden
        onChange={handleUpload}
        accept="image/*"
      />
      <ImageButton disabled={disabled} onClick={handleClickUpload}>
        <ImageSrc style={{ backgroundImage: `url(${fileUrl || '/static/placeholder.jpg'})` }} />
        <ImageBackdrop className="MuiImageBackdrop-root" />
        <Image>
          {isUploading ? (
            <CircularProgress size={32} color="inherit" />
          ) : (
            <Typography
              component="span"
              variant="subtitle1"
              color="inherit"
              sx={(theme) => ({ position: 'relative', p: 2, borderRadius: 1 })}
            >
              <CameraAltRounded />
            </Typography>
          )}
        </Image>
        {!!value && value !== defaultValue && (
          <RemoveButton
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
          >
            <DeleteIcon fontSize="small" />
          </RemoveButton>
        )}
      </ImageButton>

      {value && (
        <Box mt={1}>
          <Typography
            sx={{
              width: '100%',
              textWrap: 'wrap',
              wordBreak: 'break-all',
              whiteSpace: 'normal',
            }}
            variant="caption"
            color="text.secondary"
          >
            {(value as File)?.name}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export const ButtonUpload: React.FC<{
  title?: JSX.Element | string;
  upload?: (file?: File) => void;
}> = ({ title, upload }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleClickUpload = () => {
    if (!isUploading) inputRef.current?.click();
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setIsUploading(true);

      setTimeout(() => {
        upload && upload(selectedFile);
        setIsUploading(false);
      }, 1500);
    }
  };

  return (
    <>
      <input ref={inputRef} type="file" hidden onChange={handleUpload} accept="image/*" />
      <Button
        disabled={isUploading}
        variant="contained"
        onClick={handleClickUpload}
        sx={(theme) => {
          return {
            '.MuiButton-startIcon': { margin: { xs: 'unset' } },

            backgroundColor: varAlpha(theme.palette.dividerChannel),
          };
        }}
        startIcon={isUploading ? <CircularProgress size={32} color="inherit" /> : <CameraAltIcon />}
      >
        {title || 'Edit Cover'}
      </Button>
    </>
  );
};
