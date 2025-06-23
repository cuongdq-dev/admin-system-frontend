import { ArrowBackIos, ArrowForwardIos, Close, MoreVert, Search } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  InputAdornment,
  Modal,
  Pagination as MuiPagination,
  Paper,
  TextField,
  Fade,
  Typography,
  useMediaQuery,
  useTheme,
  Chip,
  Tab,
  Tabs,
  CircularProgress,
} from '@mui/material';
import { t } from 'i18next';
import type React from 'react';
import { useEffect, useState } from 'react';
import { PATH_IMAGE_LIST } from 'src/api-core/path';
import { Scrollbar } from 'src/components/scrollbar';
import { LanguageKey, StoreName } from 'src/constants';
import { useAPI } from 'src/hooks/use-api';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { useShallow } from 'zustand/react/shallow';
import { DetailMedia } from '../components/detail';
import { useNavigate } from 'react-router';
import { NotFoundDataComponent } from 'src/components/no-found-data';

export function ListView({ imagesPerPage = 40 }: { imagesPerPage?: number }) {
  const storeName = StoreName.MEDIA;
  const navigate = useNavigate();

  const { setList, setLoadingList } = usePageStore();
  const { data, isLoading } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.list }))
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [searchTerm, setSearchTerm] = useState('');

  const [filteredImages, setFilteredImages] = useState<{ url: string; filename: string }[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    setLoadingList(storeName, true);
  }, []);
  useAPI({
    baseURL: PATH_IMAGE_LIST + window.location.search,
    onHandleError: () => {
      setLoadingList(storeName, false);
    },
    onSuccess: (res) => {
      setList(storeName, { data: res.data, isFetching: false, isLoading: false });
      setFilteredImages(res?.data || []);
      setLoadingList(storeName, false);
      setTotalPages(Math.ceil(res?.data?.length / imagesPerPage));
    },
  });

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = filteredImages?.slice(indexOfFirstImage, indexOfLastImage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenModal = (index: number) => {
    const actualIndex = indexOfFirstImage + index;

    setSelectedImageIndex(actualIndex);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
  };
  const currentImage = filteredImages ? filteredImages[selectedImageIndex || 0] : undefined;

  useEffect(() => {
    // setLoadingList(storeName, true);
    let result = data as { url: string; filename: string }[];
    if (searchTerm) {
      result = data?.filter((image?: { url: string; filename: string }) =>
        image?.filename?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredImages(result);
    setTotalPages(Math.ceil(result?.length / imagesPerPage));
    setCurrentPage(1);
  }, [searchTerm, imagesPerPage, data]);

  return (
    <DashboardContent
      breadcrumb={{ items: [{ href: '/media', title: t(LanguageKey.common.listTitle) }] }}
    >
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            bgcolor: '#f0f0f0',
            borderRadius: '24px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {/* <Tabs
        value={new URLSearchParams(window.location.search).get('storage_type') || 'URL'}
        onChange={(_, value) => {
          const queryParams = new URLSearchParams(window.location.search);
          queryParams.set('storage_type', value?.toString());
          navigate(`?${queryParams.toString()}`, { replace: true });
          setLoadingList(storeName, true);
        }}
        variant="fullWidth"
        sx={{
          mb: 1,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 'medium',
            fontSize: '0.9rem',
          },
        }}
      >
        <Tab label="LOCAL" value="LOCAL" />
        <Tab label="URL" value="URL" />
        <Tab label="BASE 64" value="BASE64" />
      </Tabs> */}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <>
          <Scrollbar>
            <Box
              sx={{
                columnCount: {
                  xs: 2,
                  sm: 3,
                  md: 4,
                  lg: 5,
                  xl: 6,
                },
                columnGap: '8px',
                mt: 1,
              }}
            >
              {currentImages?.map((image, index) => (
                <Box
                  key={image.filename}
                  sx={{
                    breakInside: 'avoid',
                    mb: 1,
                    opacity: 0,
                    animation: 'fadeIn 0.5s ease forwards',
                    animationDelay: `${index * 50}ms`,
                    '@keyframes fadeIn': {
                      '0%': {
                        opacity: 0,
                        transform: 'translateY(20px)',
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                  }}
                >
                  <Card
                    onClick={() => handleOpenModal(index)}
                    sx={{
                      display: 'block',
                      overflow: 'hidden',
                      borderRadius: 2,
                      mb: 1,
                      position: 'relative',
                      transition: 'transform 0.2s',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        '& .MuiCardContent-root': {
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={image.url}
                      alt={image.filename}
                      sx={{
                        display: 'block',
                        width: '100%',
                        height: 'auto',
                      }}
                    />
                    <CardContent
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        p: 1,
                        opacity: 0,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      <Typography variant="body2" noWrap>
                        {image.filename}
                      </Typography>
                    </CardContent>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                        },
                        width: 28,
                        height: 28,
                      }}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Card>
                </Box>
              ))}
            </Box>
            {currentImages?.length == 0 && <NotFoundDataComponent />}
          </Scrollbar>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
              <MuiPagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? 'small' : 'medium'}
                showFirstButton
                showLastButton
                siblingCount={isMobile ? 0 : 1}
              />
            </Box>
          )}

          {/* Image Detail Modal (Facebook-like) */}
          <Modal
            open={modalOpen && !!currentImage}
            onClose={handleCloseModal}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.9)',
            }}
          >
            <Box
              onClick={handleCloseModal}
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none',
              }}
            >
              {/* Close button */}
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  color: 'white',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 10,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <Close />
              </IconButton>

              {/* Image container */}
              <Box
                onClick={(e) => e.stopPropagation()}
                sx={{
                  position: 'relative',
                  width: isMobile ? '95%' : isTablet ? '90%' : '85%',
                  maxHeight: '85vh',
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  bgcolor: { xs: 'transparent', md: 'background.paper' },
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                {/* Image */}
                <Box
                  sx={{
                    flex: { xs: '1', md: '3' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'black',
                    position: 'relative',
                    height: { xs: 'auto', md: '85vh' },
                    maxHeight: { xs: '70vh', md: '85vh' },
                  }}
                >
                  {currentImage && (
                    <img
                      src={currentImage?.url}
                      alt={currentImage?.filename}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  )}

                  {/* Navigation arrows */}
                  <IconButton
                    onClick={handlePrevImage}
                    sx={{
                      position: 'absolute',
                      left: { xs: 8, md: 16 },
                      color: 'white',
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                      },
                    }}
                  >
                    <ArrowBackIos />
                  </IconButton>

                  <IconButton
                    onClick={handleNextImage}
                    sx={{
                      position: 'absolute',
                      right: { xs: 8, md: 16 },
                      color: 'white',
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                      },
                    }}
                  >
                    <ArrowForwardIos />
                  </IconButton>
                </Box>

                <Box
                  sx={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                  }}
                >
                  {currentImage && <DetailMedia image={currentImage!} />}
                </Box>
              </Box>
            </Box>
          </Modal>
        </>
      )}
    </DashboardContent>
  );
}
