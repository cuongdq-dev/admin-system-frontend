import {
  Box,
  Card,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { invokeRequest } from 'src/api-core';
import { LanguageKey } from 'src/constants';
import { useAPI } from 'src/hooks/use-api';
import { usePageStore } from 'src/store/store';
import { useShallow } from 'zustand/react/shallow';
import { TimeAgo } from '../label';
import { Scrollbar } from '../scrollbar';
import { TableActionComponent } from './table-action';
import { CommonTableCell } from './table-cell';
import { TableHeadComponent } from './table-head';
import { TableNoData } from './table-no-data';
import { TableComponentProps } from './type';

export const TableComponent = (props: TableComponentProps) => {
  const table = useTable();

  const { headLabel, url, indexCol, selectCol, withSearch = true, storeName, component } = props;
  const { refreshData, customCard, handleClickOpenForm } = props;
  const { actions = { deleteBtn: false, editBtn: false, popupEdit: false, refreshBtn: true } } =
    props;

  const { setList, addItem, editItem, deleteItem, setLoadingList, setFetchingList } =
    usePageStore.getState();

  const {
    data: datasource,
    meta: metaData,
    isLoading: loading = false,
    isFetching,
    refreshNumber,
    fetchOn,
  } = usePageStore(useShallow((state) => ({ ...state.dataStore![storeName]?.list })));

  useEffect(() => {
    Number(refreshNumber) > 0 && setLoadingList(storeName, true);
  }, [refreshNumber]);

  useEffect(() => {
    metaData && setFetchingList(storeName, true);
  }, [window.location.search]);

  useEffect(() => {
    if (isFetching) {
      invokeRequest({
        baseURL: url + '/list' + window.location.search,
        onSuccess: (res) => setList(storeName, { ...res, isFetching: false, isLoading: false }),
        onHandleError: () => {
          setLoadingList(storeName, false);
          setFetchingList(storeName, false);
        },
      });
    }
  }, [isFetching]);

  useAPI({
    clearRequest:
      !loading &&
      datasource &&
      fetchOn &&
      new Date().getTime() - new Date(fetchOn).getTime() < 5 * 60 * 1000,
    refreshNumber: refreshNumber,
    baseURL: url + '/list' + window.location.search,
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
        <Grid spacing={3}>
          {notFound && <TableNoData />}

          {datasource?.map((data: Record<string, any>, index: number) => (
            <Grid item marginBottom={5} key={`card_item_${data.id}_${index}`} xs={12} sm={6} md={3}>
              {customCard && customCard({ values: data })}
            </Grid>
          ))}
        </Grid>
        {metaData && Object.keys(metaData).length > 0 && (
          <TablePagination
            component="div"
            labelRowsPerPage={t(LanguageKey.table.paginationPerPage) + ':'}
            page={metaData?.currentPage - 1}
            count={metaData?.totalItems}
            rowsPerPage={metaData?.itemsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[10, 20, 30, 50, 100]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        )}
      </>
    );
  }
  return (
    <Box sx={{ position: 'relative' }}>
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            zIndex: 1,
          }}
        >
          <CircularProgress
            size={50}
            sx={{
              left: '50%',
              top: '50%',
              position: 'absolute',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </Box>
      )}
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
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHeadComponent
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

                    return (
                      <TableRow hover tabIndex={-1} role="checkbox">
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
                            value={index + 1}
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
                        <TableActionComponent
                          {...actions}
                          baseUrl={url}
                          row={row}
                          updateRowData={updateRowData}
                          refreshData={refreshData}
                          handleClickOpenForm={handleClickOpenForm}
                        />
                      </TableRow>
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
              rowsPerPageOptions={[10, 20, 30, 50, 100]}
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

  const onResetPage = useCallback(() => {
    setPage(0);
    updateUrl({});
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
    updateUrl({ page: (newPage + 1).toString() });
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
    onSort,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
