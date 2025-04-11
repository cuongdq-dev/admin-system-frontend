import { Chip } from '@mui/material';
import { Iconify } from 'src/components/iconify';

export const IndexStatus = ({ status }: { status?: string }) => {
  switch (status) {
    case 'NEW':
      return (
        <Chip
          icon={<Iconify width={16} icon="hugeicons:folder-edit" />}
          sx={{ px: 0.5 }}
          size="small"
          variant="outlined"
          label={status}
          color="primary"
        />
      ); // Xanh dương - mới
    case 'INDEXING':
      return (
        <Chip
          icon={<Iconify width={16} icon="hugeicons:folder-edit" />}
          sx={{ px: 0.5 }}
          size="small"
          variant="outlined"
          label={status}
          color="info"
        />
      ); // Xanh nhạt - đang index
    case 'DELETED':
      return (
        <Chip
          icon={<Iconify width={16} icon="hugeicons:folder-edit" />}
          sx={{ px: 0.5 }}
          size="small"
          variant="outlined"
          label={status}
          color="default"
        />
      ); // Xám - đã xóa
    case 'PASS':
      return (
        <Chip
          icon={<Iconify width={16} icon="hugeicons:folder-edit" />}
          sx={{ px: 0.5 }}
          size="small"
          variant="outlined"
          label={status}
          color="success"
        />
      ); // Xanh lá - index thành công
    case 'FAIL':
      return (
        <Chip
          icon={<Iconify width={16} icon="hugeicons:folder-edit" />}
          sx={{ px: 0.5 }}
          size="small"
          variant="outlined"
          label={status}
          color="error"
        />
      ); // Đỏ - lỗi
    case 'PARTIAL':
      return (
        <Chip
          icon={<Iconify width={16} icon="hugeicons:folder-edit" />}
          sx={{ px: 0.5 }}
          size="small"
          variant="outlined"
          label={status}
          color="warning"
        />
      ); // Vàng - chưa hoàn chỉnh
    case 'NEUTRAL':
      return (
        <Chip
          icon={<Iconify width={16} icon="hugeicons:folder-edit" />}
          sx={{ px: 0.5 }}
          size="small"
          variant="outlined"
          label={status}
          color="secondary"
        />
      ); // Tím - bị loại trừ
    case 'VERDICT_UNSPECIFIED':
      return (
        <Chip
          icon={<Iconify width={16} icon="hugeicons:folder-edit" />}
          sx={{ px: 0.5 }}
          size="small"
          variant="outlined"
          label={status}
          color="default"
        />
      ); // Xám - không rõ trạng thái
    default:
      return (
        <Chip
          icon={<Iconify width={16} icon="hugeicons:folder-edit" />}
          sx={{ px: 0.5 }}
          size="small"
          variant="outlined"
          label={status}
          color="warning"
        />
      ); // Mặc định vàng - không xác định
  }
};
