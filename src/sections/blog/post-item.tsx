import {
  Autocomplete,
  AutocompleteProps,
  Checkbox,
  Chip,
  Divider,
  dividerClasses,
  Link,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_BLOG } from 'src/api-core/path';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { LanguageKey } from 'src/constants';
import { varAlpha } from 'src/theme/styles';
import { fRelativeTime } from 'src/utils/format-time';
export function PostItem(
  props: CardProps & {
    siteId?: string;
    post: IPost;
    latestPost: boolean;
    latestPostLarge: boolean;
    categories?: IPostCategory[];
  }
) {
  const { siteId, sx, post, latestPost, latestPostLarge, ...other } = props;
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

  const renderCover = (
    <Box
      component="img"
      alt={post.title}
      src={`${post.thumbnail?.url}`}
      sx={{ top: 0, width: 1, height: 1, objectFit: 'cover', position: 'absolute' }}
    />
  );

  const renderDate = (
    <Typography
      variant="caption"
      component="div"
      sx={{
        color: 'text.disabled',
        ...((latestPostLarge || latestPost) && { opacity: 0.48, color: 'common.white' }),
      }}
    >
      {fRelativeTime(post.created_at)}
    </Typography>
  );

  const renderCategories = (
    <Typography
      variant="caption"
      component="div"
      sx={{
        color: 'text.disabled',
        ...((latestPostLarge || latestPost) && { opacity: 0.48, color: 'common.white' }),
      }}
    >
      {post?.categories?.map((cate) => cate?.name).join(', ') || 'No category provided'}
    </Typography>
  );
  const renderCategoriesInput = () => {
    return (
      <AddNewCategory
        postId={post.id}
        siteId={siteId!}
        options={[]}
        defaultValue={post?.categories?.map((category: IPostCategory) => {
          return { id: category?.id, title: category.name };
        })}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              variant="standard"
              margin="dense"
              label={t(LanguageKey.site.categoriesItem)}
            />
          );
        }}
      />
    );
  };

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
        {renderCover}
      </Box>

      <Box
        sx={(theme) => ({
          p: theme.spacing(4, 3, 3, 3),
          ...((latestPostLarge || latestPost) && {
            width: 1,
            bottom: 0,
            position: 'absolute',
          }),
        })}
      >
        {siteId && renderCategoriesInput()}

        {!siteId && renderCategories}

        {renderTitle}
        {renderDescription}

        <Box
          display="flex"
          sx={{
            mt: 0.5,
            '& svg': { m: 1 },
            [`& .${dividerClasses.root}`]: { mx: 1 },
          }}
        >
          {renderDate}
          <Divider orientation="vertical" flexItem variant="fullWidth" />
          {renderSource}
        </Box>
      </Box>
    </Card>
  );
}

interface AddNewCategoryProps extends AutocompleteProps<any, boolean, boolean, boolean> {
  siteId: string;
  postId: string;
}

export const AddNewCategory = ({ siteId, postId, ...other }: AddNewCategoryProps) => {
  const [options, setOptions] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>(other?.defaultValue);

  const [loadingCategories, setLoadingCategories] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedCategories(other?.defaultValue);
  }, [other.defaultValue]);

  const handleCategorySelect = async (category: any) => {
    if (loadingCategories.includes(category.id)) return;
    setLoadingCategories((prev) => [...prev, category.id]);

    const checkExist = selectedCategories.find((cate) => cate.id === category.id);
    const newCategories = checkExist
      ? selectedCategories.filter((cate) => category.id !== cate.id)
      : [...selectedCategories, category];

    setSelectedCategories(newCategories);

    invokeRequest({
      baseURL: `${PATH_BLOG}/${postId}`,
      method: HttpMethod.PATCH,
      params: {
        categories: newCategories.map((cate) => ({ id: cate.id })),
      },
      onSuccess: () => {
        setLoadingCategories((prev) => prev.filter((id) => id !== category.id));
      },
      onHandleError: () => {
        setSelectedCategories(selectedCategories);
        setLoadingCategories((prev) => prev.filter((id) => id !== category.id));
      },
    });
  };

  return (
    <Autocomplete
      className="post-item-select-categories"
      sx={{ width: '100%', border: 'none', boxShadow: 'none', flexWrap: 'nowrap' }}
      multiple
      disableClearable
      disableCloseOnSelect
      loading={isLoading}
      onFocus={() => {
        setLoading(true);
        if (!options.length) {
          invokeRequest({
            baseURL: '/dropdown/categories/' + siteId,
            method: HttpMethod.GET,
            onSuccess: (res) => {
              setOptions(res);
              setLoading(false);
            },
            onHandleError: () => {
              setLoading(false);
            },
          });
        }
      }}
      onChange={(_, newValue) => {
        const newCategory = newValue.find(
          (cat: IPostCategory) => !selectedCategories.some((selected) => selected.id === cat.id)
        );
        if (newCategory) handleCategorySelect(newCategory);
      }}
      getOptionLabel={(option) => option.title}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderTags={(value) => {
        return (
          <>
            {selectedCategories.length > 0 && (
              <Chip size="small" label={selectedCategories[0]?.title} deleteIcon={<></>} />
            )}
            {selectedCategories.length > 1 && (
              <Chip size="small" label={`+${selectedCategories.length - 1}`} deleteIcon={<></>} />
            )}
          </>
        );
      }}
      renderOption={(props, option) => {
        const isLoading = loadingCategories.includes(option.id);
        const isSelected = selectedCategories.some((cat) => cat.id === option.id);

        return (
          <li
            {...props}
            key={option.id}
            aria-selected={isSelected}
            style={{ opacity: isLoading ? 0.5 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}
            onClick={() => !isLoading && handleCategorySelect(option)}
          >
            <Checkbox
              icon={<Iconify icon="bx:checkbox" />}
              checkedIcon={<Iconify icon="mingcute:checkbox-fill" />}
              style={{ marginRight: 8 }}
              checked={isSelected}
              disabled={isLoading} // Disable nếu đang gọi API
            />
            <Typography width={'100%'} variant="body2">
              {option.title}
            </Typography>
            <Box>{isLoading && <Iconify icon="eos-icons:loading" />}</Box>
          </li>
        );
      }}
      // {...other}
      renderInput={other.renderInput}
      value={selectedCategories}
      options={options}
    />
  );
};
