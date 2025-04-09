import {
  Backdrop,
  Box,
  Card,
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import queryString from 'query-string';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageKey } from 'src/constants';
import { useAPI } from 'src/hooks/use-api';
import { usePageStore } from 'src/store/page';
import { useShallow } from 'zustand/react/shallow';
import { Iconify } from '../iconify';
import { TimeAgo } from '../label';
import { PageLoading } from '../loading';
import { Scrollbar } from '../scrollbar';
import { TableActionComponent } from './table-action';
import { CommonTableCell } from './table-cell';
import { TableHeadComponent } from './table-head';
import { TableNoData } from './table-no-data';
import { varAlpha } from 'src/theme/styles';

export const TableComponent = (props: TableComponentProps) => {
  const table = useTable();

  const { headLabel, url, indexCol, selectCol, storeName, component, children } = props;
  const { refreshData, customCard, handleClickOpenForm } = props;
  const { actions = { deleteBtn: false, editBtn: false, popupEdit: false, refreshBtn: true } } =
    props;

  const { setList, addItem, editItem, deleteItem, setLoadingList, setFetchingList } =
    usePageStore.getState();

  const {
    data: datasource,
    meta: metaData,
    isLoading: loading = true,
    isFetching,
    refreshNumber,
    fetchOn,
  } = usePageStore(useShallow((state) => ({ ...state.dataStore![storeName]?.list })));

  useEffect(() => {
    Number(refreshNumber) > 0 && setLoadingList(storeName, true);
  }, [refreshNumber]);

  useEffect(() => {
    setFetchingList(storeName, true);
  }, [window.location.search]);

  useAPI({
    refreshNumber: refreshNumber,
    baseURL: url + '/list',
    params: queryString.parse(window.location.search),
    onSuccess: (res) => setList(storeName, { ...res, isFetching: false, isLoading: false }),
    onHandleError: () => {
      setLoadingList(storeName, false);
      setFetchingList(storeName, false);
    },
  });

  const notFound = !loading && (!datasource || Number(datasource?.length) == 0);

  const getSortBy = () => {
    if (Number(metaData?.sortBy?.length) > 0)
      return {
        orderBy: metaData?.sortBy![0][0],
        order: metaData?.sortBy![0][1].toLocaleLowerCase(),
      };
  };

  const updateRowData = (
    id: string,
    updatedData: Record<string, any>,
    action: 'ADD' | 'UPDATE' | 'REMOVE'
  ) => {
    const findIndex =
      Number(datasource?.length) > 0 &&
      datasource?.findIndex((row: Record<string, any>) => row.id === id);

    switch (action) {
      case 'ADD':
        addItem(storeName, updatedData);
        break;

      case 'UPDATE':
        editItem(storeName, updatedData, findIndex);
        break;

      case 'REMOVE':
        deleteItem(storeName, id, findIndex);
        break;

      default:
        break;
    }
  };

  if (component == 'CARD') {
    return (
      <>
        <PageLoading isLoading={loading} />

        <Grid container>
          {datasource?.map((data: Record<string, any>, index: number) => {
            return customCard && customCard({ values: data, index: index });
          })}
        </Grid>
        {metaData?.totalItems == 0 && (
          <Box sx={{ py: 2, width: '100%', textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Not found
            </Typography>

            <Typography variant="body2">
              <br /> Try checking for typos or using complete words.
            </Typography>
          </Box>
        )}
        {metaData && metaData.totalItems > 0 && (
          <Pagination
            page={metaData?.currentPage}
            count={metaData?.totalPages}
            onChange={(event, page) => {
              table.onChangePage(event, page - 1);
            }}
            color="primary"
            sx={{ mt: 8, mx: 'auto' }}
          />
        )}
      </>
    );
  }
  return (
    <Box sx={{ position: 'relative' }}>
      <PageLoading isLoading={loading} />
      <Card
        sx={{
          opacity: loading ? 0.1 : 1,
          pointerEvents: loading ? 'none' : 'auto',
          animation: loading ? 'none' : 'fadeIn 1s ease-in-out', // Apply fadeIn animation when not loading

          '@keyframes fadeIn': {
            '0%': {
              opacity: 0,
              transform: 'translateY(-15px)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
        }}
      >
        <Backdrop
          sx={(theme) => ({ position: 'absolute', zIndex: theme.zIndex.drawer + 1 })}
          open={isFetching!}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHeadComponent
                tableChildren={children}
                order={getSortBy()?.order as 'asc' | 'desc'}
                orderBy={getSortBy()?.orderBy}
                rowCount={datasource?.length}
                numSelected={table.selected.length}
                indexCol={indexCol}
                selectCol={selectCol}
                actionCol={actions?.deleteBtn || actions?.editBtn || actions.popupEdit}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    datasource?.map((row: Record<string, any>) => row?.id)
                  )
                }
                headLabel={headLabel}
              />
              {notFound ? (
                <TableBody>
                  <TableNoData colSpan={headLabel.length + 2} />
                </TableBody>
              ) : (
                <TableBody>
                  {datasource?.map((row: Record<string, any>, index: number) => {
                    const keys = Object.keys(row);
                    const collapsed =
                      children?.name && row[children.name] && table.collapsed == row?.id;
                    return (
                      <>
                        <TableRow
                          key={'table_row_' + index + '_' + row?.id}
                          hover
                          tabIndex={-1}
                          role="checkbox"
                          sx={{
                            cursor: children?.name && row[children.name] && 'pointer',
                          }}
                        >
                          {children?.name && row[children.name] && (
                            <TableCell width={'5%'}>
                              <IconButton
                                onClick={() => {
                                  table.onCollapseRow(!collapsed ? row?.id : undefined);
                                }}
                                size="small"
                              >
                                <Iconify
                                  sx={{ fontSize: '10px' }}
                                  icon={
                                    collapsed
                                      ? 'icon-park-solid:up-one'
                                      : 'icon-park-solid:down-one'
                                  }
                                />
                              </IconButton>
                            </TableCell>
                          )}
                          {selectCol && (
                            <CommonTableCell
                              type="checkbox"
                              checked={table.selected.includes(row.id)}
                              onChange={() => table.onSelectRow(row.id)}
                              width={20}
                              minWidth={20}
                            />
                          )}
                          {indexCol && (
                            <CommonTableCell
                              align="center"
                              width={60}
                              minWidth={60}
                              value={
                                index +
                                1 +
                                (Number(metaData?.currentPage) - 1) * Number(metaData?.itemsPerPage)
                              }
                              type={'text'}
                              key={'_index' + '_' + index}
                            />
                          )}
                          {headLabel.map((column) => {
                            if (column.type == 'custom' && !!column?.render) {
                              return (
                                <TableCell
                                  key={column.id + '_head_label'}
                                  align={column.align}
                                  width={column.width}
                                  sx={{ minWidth: column.width }}
                                >
                                  {column?.render &&
                                    column?.render({ row, refreshData, updateRowData })}
                                </TableCell>
                              );
                            }
                            if (keys.includes(column.id)) {
                              return (
                                <CommonTableCell
                                  value={row[column.id]}
                                  type={column.type!}
                                  key={column.id}
                                  align={column.align}
                                  minWidth={column.minWidth}
                                  width={column.width}
                                />
                              );
                            }
                            return null;
                          })}
                          {(actions?.deleteBtn || actions?.editBtn || actions?.popupEdit) && (
                            <TableCell align="right">
                              <TableActionComponent
                                {...actions}
                                baseUrl={url}
                                row={row}
                                updateRowData={updateRowData}
                                refreshData={refreshData}
                                handleClickOpenForm={handleClickOpenForm}
                              />
                            </TableCell>
                          )}
                        </TableRow>
                        {children?.name && row[children.name] && (
                          <TableChildren
                            index={0}
                            parent={children}
                            data={row[children.name]}
                            open={table.collapsed == row?.id}
                          />
                        )}
                      </>
                    );
                  })}

                  {notFound && <TableNoData />}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>
        {metaData && Object.keys(metaData).length > 0 && (
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography marginLeft={2} variant="caption" color="grey">
              <TimeAgo isFetching={isFetching} timestamp={fetchOn!} />
            </Typography>

            <TablePagination
              component="div"
              labelRowsPerPage={t(LanguageKey.table.paginationPerPage) + ':'}
              page={metaData?.currentPage - 1}
              count={metaData?.totalItems}
              rowsPerPage={metaData?.itemsPerPage}
              onPageChange={table.onChangePage}
              rowsPerPageOptions={[10, 20, 30, 50, 100, 200, 500]}
              onRowsPerPageChange={table.onChangeRowsPerPage}
            />
          </Box>
        )}
      </Card>
    </Box>
  );
};

// ----------------------------------------------------------------------

export function useTable() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<string | undefined>();
  const [order, setOrder] = useState<'asc' | 'desc' | undefined>();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pageFromUrl = queryParams.get('page') ? parseInt(queryParams.get('page')!, 10) - 1 : 0;
    const rowsPerPageFromUrl = queryParams.get('limit')
      ? parseInt(queryParams.get('limit')!, 10)
      : 10;

    setPage(pageFromUrl);
    setRowsPerPage(rowsPerPageFromUrl);

    const sortByFromUrl = queryParams.get('sortBy') || '';
    const [field, order] = sortByFromUrl?.split(':');
    setOrderBy(field);
    setOrder(order?.toLocaleLowerCase() as 'asc' | 'desc');
  }, [location.search]);

  const updateUrl = useCallback(
    (newParams: Record<string, string | undefined>) => {
      const queryParams = new URLSearchParams(location.search);

      Object.entries(newParams).forEach(([key, value]) => {
        if (value) queryParams.set(key, value);
        else queryParams.delete(key);
      });
      navigate(`?${queryParams.toString()}`, { replace: true });
    },
    [location.search, navigate]
  );

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
      updateUrl({ sortBy: `${id}:${isAsc ? 'DESC' : 'ASC'}` });
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onCollapseRow = useCallback(
    (inputValue: string | null) => {
      setCollapsed(inputValue);
    },
    [collapsed]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
    updateUrl({});
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
    updateUrl({ page: (newPage + 1).toString() });
    window.scrollTo({ top: 0 });
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const perPage = parseInt(event.target.value, 10);
      setRowsPerPage(perPage);
      updateUrl({ limit: perPage.toString(), page: undefined });
    },
    [onResetPage]
  );

  return {
    page,
    order,
    orderBy,
    selected,
    collapsed,
    onSort,
    rowsPerPage,
    onSelectRow,
    onCollapseRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}

const TableChildren = ({
  index = 0,
  data,
  parent,
  open = true,
}: {
  open?: boolean;
  index?: number;
  parent: ChildrenColumn;
  data: Record<string, any>;
}) => {
  const { columns, children } = parent;
  return (
    <TableRow
      sx={(theme) => {
        return {
          backgroundColor:
            index % 2 == 0
              ? theme.vars.palette.background.default
              : theme.vars.palette.background.paper,
        };
      }}
    >
      <TableCell
        sx={(theme) => {
          return {
            borderBottom: open ? `1px solid ${theme.vars.palette.divider}` : 'none',
            p: open ? 4 : 0,
            pl: open ? 8 : 0,
            transition: 'padding 0.3s ease',
          };
        }}
        colSpan={12}
      >
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box
            sx={(theme) => {
              return {
                border: `1px solid ${theme.vars.palette.divider}`,
                borderRadius: 1,
              };
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    width={50}
                    align="center"
                    sx={(theme) => {
                      return {
                        backgroundColor:
                          index % 2 == 0
                            ? varAlpha(theme.vars.palette.info.mainChannel, 0.1)
                            : varAlpha(theme.vars.palette.info.mainChannel, 0.05),
                      };
                    }}
                  >
                    STT
                  </TableCell>
                  {columns.map((headCell) => {
                    return (
                      <>
                        <TableCell
                          key={headCell.id}
                          align={headCell.align || 'left'}
                          sx={(theme) => {
                            return {
                              width: headCell.width,
                              minWidth: headCell.minWidth,
                              backgroundColor:
                                index % 2 == 0
                                  ? varAlpha(theme.vars.palette.info.mainChannel, 0.1)
                                  : varAlpha(theme.vars.palette.info.mainChannel, 0.05),
                            };
                          }}
                        >
                          {headCell.label}
                        </TableCell>
                      </>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row: Record<string, any>, index: number) => {
                  const keys = Object.keys(row);

                  return (
                    <>
                      <TableRow
                        key={'table_children_row_' + index + '_' + row?.id}
                        tabIndex={-1}
                        role="checkbox"
                        sx={(theme) => {
                          return {
                            backgroundColor:
                              index % 2 == 0
                                ? theme.vars.palette.background.paper
                                : theme.vars.palette.background.neutral,
                          };
                        }}
                      >
                        <CommonTableCell
                          align="center"
                          width={60}
                          minWidth={60}
                          value={index + 1}
                          type={'text'}
                          key={'_index' + '_' + index}
                        />
                        {columns.map((column) => {
                          if (column.type == 'custom' && !!column?.render) {
                            return (
                              <TableCell
                                key={column.id + '_head_label'}
                                align={column.align}
                                width={column.width}
                                sx={{ minWidth: column.width }}
                              >
                                {column?.render && column?.render({ row })}
                              </TableCell>
                            );
                          }
                          if (keys.includes(column.id)) {
                            return (
                              <CommonTableCell
                                value={row[column.id]}
                                type={column.type!}
                                key={column.id}
                                align={column.align}
                                minWidth={column.minWidth}
                                width={column.width}
                              />
                            );
                          }
                          return null;
                        })}
                      </TableRow>
                      {children?.name && row[children.name] && (
                        <TableChildren
                          data={row[children.name]}
                          parent={children}
                          index={index + 1}
                        />
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};
