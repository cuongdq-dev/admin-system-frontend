import CameraAltRounded from '@mui/icons-material/CameraAltRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import type { FormControlLabelProps } from '@mui/material';
import { Box, ButtonBase, CircularProgress, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: 200,
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

// ----------------------------------------------------------------------

interface RHFUploadProps {
  name: string;
}

export const RHFUpload = ({ name, defaultValue }: RHFUploadProps & FormControlLabelProps) => {
  const { control, setValue } = useFormContext();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = React.useState(false);

  const handleClickUpload = () => {
    if (!isUploading) inputRef.current?.click();
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setIsUploading(true);

      // Giả lập upload bằng setTimeout
      setTimeout(() => {
        setValue(name, selectedFile, { shouldDirty: true });
        setIsUploading(false);
      }, 1500); // Hoặc gọi API thực tế tại đây
    }
  };
  const handleRemove = () => {
    setValue(name, defaultValue, { shouldDirty: true });
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value: file } }) => {
        const fileUrl = file instanceof File ? URL.createObjectURL(file) : file;

        return (
          <Box>
            <input ref={inputRef} type="file" hidden onChange={handleUpload} accept="image/*" />

            <ImageButton onClick={handleClickUpload}>
              <ImageSrc
                style={{ backgroundImage: `url(${fileUrl || '/static/placeholder.jpg'})` }}
              />
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

              {file != defaultValue && (
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

            {file && (
              <Box mt={1}>
                <Typography
                  sx={{
                    width: '100%',
                    textWrap: 'wrap',
                    wordBreak: 'break-all', // tự động xuống dòng khi dài quá
                    whiteSpace: 'normal',
                  }}
                  variant="caption"
                  color="text.secondary"
                >
                  {(file as File).name}
                </Typography>
              </Box>
            )}
          </Box>
        );
      }}
    />
  );
};
