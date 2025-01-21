import type { CardProps } from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { fDate, formatStr } from 'src/utils/format-time';
import { varAlpha } from 'src/theme/styles';
import { Link } from '@mui/material';
import { SvgColor } from 'src/components/svg-color';
import { Iconify } from 'src/components/iconify';
// ----------------------------------------------------------------------

export function PostItem({
  sx,
  post,
  latestPost,
  latestPostLarge,
  ...other
}: CardProps & {
  post: IPost;
  latestPost: boolean;
  latestPostLarge: boolean;
}) {
  const renderAvatar = (
    <>
      {post.status == 'NEW' && (
        <Iconify
          sx={{
            color: 'secondary.main',
            left: 24,
            zIndex: 9,
            bottom: -24,
            position: 'absolute',
            ...((latestPostLarge || latestPost) && {
              top: 24,
            }),
          }}
          width={40}
          icon="lsicon:badge-new-outline"
        />
      )}
      {post.status == 'DRAFT' && (
        <Iconify
          sx={{
            color: 'warning.main',
            left: 24,
            zIndex: 9,
            bottom: -24,
            position: 'absolute',
            ...((latestPostLarge || latestPost) && {
              top: 24,
            }),
          }}
          width={40}
          icon="material-symbols:draft-orders"
        />
      )}
      {post.status == 'PUBLISHED' && (
        <Iconify
          sx={{
            color: 'primary.main',
            left: 24,
            zIndex: 9,
            bottom: -24,
            position: 'absolute',
            ...((latestPostLarge || latestPost) && {
              top: 24,
            }),
          }}
          width={40}
          icon="material-symbols:public"
        />
      )}
      {/* <Avatar
        alt={post.thumbnail?.data}
        src={post.thumbnail?.url}
        children={<></>}
        sx={{
          left: 24,
          zIndex: 9,
          bottom: -24,
          position: 'absolute',
          ...((latestPostLarge || latestPost) && {
            top: 24,
          }),
        }}
      /> */}
    </>
  );

  const renderTitle = (
    <Link
      href={'/blog/' + post.slug}
      color="inherit"
      variant="subtitle2"
      underline="hover"
      sx={{
        cursor: 'pointer',
        height: 44,
        overflow: 'hidden',
        WebkitLineClamp: 2,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        ...(latestPostLarge && { typography: 'h5', height: 60 }),
        ...((latestPostLarge || latestPost) && {
          color: 'common.white',
        }),
      }}
    >
      {post.title}
    </Link>
  );

  const renderDescription = (
    <Typography
      variant="caption"
      sx={(theme) => {
        return {
          height: 34,
          overflow: 'hidden',
          WebkitLineClamp: 2,
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          color: theme.vars.palette.grey[500],
        };
      }}
    >
      <span dangerouslySetInnerHTML={{ __html: post?.meta_description! }} />
    </Typography>
  );

  const renderCover = () => {
    return (
      <Box
        component="img"
        alt={post.title}
        src={`data:image/png;base64,${post.thumbnail?.data}`}
        sx={{ top: 0, width: 1, height: 1, objectFit: 'cover', position: 'absolute' }}
      />
    );
  };

  const renderDate = (
    <Typography
      variant="caption"
      component="div"
      sx={{
        mb: 1,
        color: 'text.disabled',
        ...((latestPostLarge || latestPost) && { opacity: 0.48, color: 'common.white' }),
      }}
    >
      {fDate(post.created_at, formatStr.dateTime)}
    </Typography>
  );

  const renderSource = (
    <Typography
      variant="caption"
      component="div"
      sx={{
        color: 'text.disabled',
        ...((latestPostLarge || latestPost) && { opacity: 0.48, color: 'common.white' }),
      }}
    >
      {post.article?.source}
    </Typography>
  );

  const renderShape = (
    <SvgColor
      width={88}
      height={36}
      src="/assets/icons/shape-avatar.svg"
      sx={{
        left: 0,
        zIndex: 9,
        bottom: -16,
        position: 'absolute',
        color: 'background.paper',
        ...((latestPostLarge || latestPost) && { display: 'none' }),
      }}
    />
  );

  return (
    <Card sx={sx} {...other}>
      <Box
        sx={(theme) => ({
          position: 'relative',
          pt: 'calc(100% * 3 / 4)',
          ...((latestPostLarge || latestPost) && {
            pt: 'calc(100% * 4 / 3)',
            '&:after': {
              top: 0,
              content: "''",
              width: '100%',
              height: '100%',
              position: 'absolute',
              bgcolor: varAlpha(theme.palette.grey['900Channel'], 0.72),
            },
          }),
          ...(latestPostLarge && {
            pt: {
              xs: 'calc(100% * 4 / 3)',
              sm: 'calc(100% * 3 / 4.66)',
            },
          }),
        })}
      >
        {renderShape}
        {renderAvatar}
        {renderCover()}
      </Box>

      <Box
        sx={(theme) => ({
          p: theme.spacing(6, 3, 3, 3),
          ...((latestPostLarge || latestPost) && {
            width: 1,
            bottom: 0,
            position: 'absolute',
          }),
        })}
      >
        {renderDate}
        {renderSource}
        {renderTitle}
        {renderDescription}
      </Box>
    </Card>
  );
}
