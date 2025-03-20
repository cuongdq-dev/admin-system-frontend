import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  IconButtonProps,
  styled,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { HttpMethod } from 'src/api-core';
import { ButtonDelete } from 'src/components/button';
import { Iconify } from 'src/components/iconify';
import { fRelativeTime } from 'src/utils/format-time';

type Props = {
  values: ISite;
  index: number;
  storeName: string;
  handleClickOpenForm: (row: ITransition, action: HttpMethod) => void;
};
export const SiteItem = (props: Props) => {
  const { values, handleClickOpenForm } = props;

  const navigate = useNavigate();

  return (
    <Card sx={{ width: '100%' }}>
      <CardHeader
        avatar={<Avatar aria-label="recipe">{values.name?.slice(0, 1)}</Avatar>}
        action={
          <Box display={'flex'}>
            <IconButton
              size="small"
              onClick={() => window.open(`/indexing?site_id=${values.id}`)}
              aria-label="settings"
            >
              <Iconify icon={'solar:to-pip-linear'} />
            </IconButton>
            <IconButton size="small" onClick={() => handleClickOpenForm(values, HttpMethod.PATCH)}>
              <Iconify icon="material-symbols:edit-outline" />
            </IconButton>

            <ButtonDelete size="small" withLoading={false} handleDelete={() => {}} />
          </Box>
        }
        title={<Typography onClick={() => navigate(values.id!)}>{values.name}</Typography>}
        subheader={fRelativeTime(values.created_at)}
      />

      <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box>
          <Typography variant="body2">{values.domain}</Typography>
        </Box>
        <Box>
          <Typography variant="body2">{values.description || 'No description provided'}</Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ textWrap: 'wrap' }}>
            Category:{' '}
            {values.categories?.map((cat) => cat.name).join(', ') || 'No description provided'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));
