import {
  Autocomplete,
  AutocompleteProps,
  AutocompleteRenderOptionState,
  Box,
  Checkbox,
  Chip,
  TextField,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_SITE } from 'src/api-core/path';
import { Iconify } from 'src/components/iconify';
import { FetchingComponent } from 'src/components/progress';
import { LanguageKey, StoreName } from 'src/constants';
import { usePageStore } from 'src/store/page';
import { useShallow } from 'zustand/react/shallow';

type Props = {
  selected: IPostCategory;
  handleClick: (category: IPostCategory) => void;
};
export const Categories = ({ selected, handleClick }: Props) => {
  const { id: siteId } = useParams();
  const { setList, setLoadingDetail } = usePageStore();

  const storeName = StoreName.SITE_CATEGORIES;
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm')); // Check if screen size is small

  const { data, isLoading: loading = true } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.list }))
  );

  const fetchListCategories = () => {
    invokeRequest({
      method: HttpMethod.GET,
      baseURL: `${PATH_SITE}/${siteId}/categories/list`,
      onSuccess: (res) => {
        setList(storeName, { data: res, isFetching: false, isLoading: false });
      },
      onHandleError: (error) => {
        setLoadingDetail(storeName, false);
      },
    });
  };

  useEffect(() => {
    siteId && fetchListCategories();
  }, []);

  if (loading && !data) return <FetchingComponent />;

  return (
    <Box
      sx={(theme) => {
        return {
          p: theme.spacing(1, 2, 2, 2),
          maxHeight: isSmallScreen ? 'none' : 'calc(100vh - 280px)',
          overflow: isSmallScreen ? 'visible' : 'auto',
        };
      }}
    >
      {data?.map((category: IPostCategory, index: number) => {
        return (
          <Box
            onClick={() => Number(category.postCount) > 0 && handleClick(category!)}
            key={`${category?.id}-${category.slug}-${category.name}`}
            sx={(theme) => {
              return {
                p: theme.spacing(2, 0, 2, 0),
                borderTop: index != 0 ? `1px solid ${theme.vars.palette.divider}` : 'unset',
                display: 'flex',
                justifyContent: 'space-between',
                opacity: category.postCount == 0 ? 0.3 : 1,
                cursor: Number(category.postCount) > 0 ? 'pointer' : 'unset',
              };
            }}
          >
            <Box>
              <Typography
                sx={{ textDecoration: selected.slug == category.slug ? 'underline' : '' }}
                variant="subtitle1"
              >
                {category.name}
              </Typography>
            </Box>
            <Typography variant="subtitle2">{category.postCount}</Typography>
          </Box>
        );
      })}

      <Box>
        <AddNewCategory
          siteId={siteId!}
          options={[]}
          defaultValue={data?.map((category: IPostCategory) => {
            return { id: category?.id, title: category.name };
          })}
          renderInput={(params) => {
            return (
              <TextField {...params} margin="normal" label={t(LanguageKey.site.categoriesItem)} />
            );
          }}
        />
      </Box>
    </Box>
  );
};

interface AddNewCategoryProps extends AutocompleteProps<any, boolean, boolean, boolean> {
  siteId: string;
}

export const AddNewCategory = ({ siteId, ...other }: AddNewCategoryProps) => {
  const [options, setOptions] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>(
    other?.defaultValue.filter((cate: any) => cate.id != 'uncategorized')
  );
  const [loadingCategories, setLoadingCategories] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const { setList } = usePageStore();
  const storeName = StoreName.SITE_CATEGORIES;

  useEffect(() => {
    setSelectedCategories(other?.defaultValue.filter((cate: any) => cate.id != 'uncategorized'));
  }, [other.defaultValue]);

  const handleCategorySelect = async (category: any) => {
    if (loadingCategories.includes(category.id)) return;
    setLoadingCategories((prev) => [...prev, category.id]);
    const checkExist = selectedCategories.find((cate) => cate.id == category.id);

    const newCategories = checkExist
      ? selectedCategories.filter((cate) => category.id != cate.id)
      : [...selectedCategories, category];
    setTimeout(() => {
      invokeRequest({
        baseURL: `${PATH_SITE}/update/${siteId}`,
        method: HttpMethod.PATCH,
        params: {
          categories: newCategories.map((cate) => {
            return { id: cate?.id };
          }),
        },
        onSuccess: (res: ISite) => {
          setList(storeName, { data: res.categories });
        },
        onHandleError: () => {},
      });
      setLoadingCategories((prev) => prev.filter((id) => id !== category.id));
    }, 1000);
  };

  return (
    <Autocomplete
      sx={{ width: '100%', border: 'none', boxShadow: 'none' }}
      multiple
      disableClearable
      disableCloseOnSelect
      loading={isLoading}
      onFocus={() => {
        setLoading(true);
        if (!options.length) {
          invokeRequest({
            baseURL: '/dropdown/categories',
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
      renderTags={(_, getTagProps) => {
        const displayedOptions = showAll ? selectedCategories : selectedCategories?.slice(0, 3);
        return (
          <>
            {displayedOptions.map((option, index) => (
              <Chip
                size="small"
                label={option.title}
                {...getTagProps({ index })}
                key={option + '_' + index}
                deleteIcon={<></>}
              />
            ))}

            {selectedCategories?.length > 3 && !showAll && (
              <Chip
                size="small"
                label={'+' + Number(selectedCategories.length - 3)}
                deleteIcon={<></>}
                onClick={() => setShowAll(true)}
              />
            )}
            {selectedCategories?.length > 3 && showAll && (
              <Chip
                size="small"
                label={'- Collapse'}
                deleteIcon={<></>}
                onClick={() => setShowAll(false)}
              />
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
      {...other}
      options={options}
    />
  );
};
