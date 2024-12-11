import type { TableRowProps as TableRowPropMUI } from '@mui/material/TableRow';

export type CellType =
  | 'checkbox'
  | 'text'
  | 'avatar'
  | 'status'
  | 'icon'
  | 'action'
  | 'datetime'
  | 'custom';
export type Align = 'left' | 'right' | 'center' | 'inherit' | 'justify';
export type HeadLabelProps = {
  id: string;
  label: string;
  sort?: boolean;
  type?: CellType;
  align?: Align;
  width?: string | number;
  minWidth?: string | number;
  render?: ({
    row,
    refreshData,
    refreshData,
  }: {
    row: Record<string, any>;
    refreshData?: () => void;
    updateRowData?: (
      rowId: string,
      values: Record<string, any>,
      action: 'ADD' | 'REMOVE' | 'UPDATE'
    ) => void;
  }) => JSX.Element;
};

export type ActionProps = {
  row?: Record<string, any>;
  editBtn?: boolean;
  deleteBtn?: boolean;
  popupEdit?: boolean;
  refreshBtn?: boolean;
};

export type TableActionComponentProps = {
  baseUrl: string;
  row?: Record<string, any>;
  editBtn?: boolean;
  deleteBtn?: boolean;
  popupEdit?: boolean;
  refreshData?: () => void;

  updateRowData?: (
    id: string,
    updatedData: Record<string, any>,
    action: 'ADD' | 'UPDATE' | 'REMOVE'
  ) => void;

  handleClickOpenForm?: (row: Record<string, any>, action: HttpMethod) => void;
};
export type TableComponentProps = {
  component?: 'CARD' | 'TABLE';
  customCard?: ({ values }: { values: Record<string, any> }) => JSX.Element;
  tableKey: string;
  url: string;
  headLabel: HeadLabelProps[];
  indexCol?: boolean;
  refreshNumber?: number;
  refreshData?: () => void;
  selectCol?: boolean;
  withSearch?: boolean;
  actions?: ActionProps;
  handleClickOpenForm?: (row: Record<string, any>, action: HttpMethod) => void;
};

export type TableHeadProps = {
  rowCount: number;
  numSelected: number;
  indexCol?: boolean;
  selectCol?: boolean;
  actionCol?: boolean;
  orderBy?: string;
  order?: 'asc' | 'desc';
  onSort: (id: string) => void;
  headLabel: HeadLabelProps[];
  onSelectAllRows: (checked: boolean) => void;
};

export type TableToolbarProps = {
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export type TableRowProps = {
  row: Record<string, any>;
  selected: boolean;
  onSelectRow: () => void;
};

export type TableNoDataProps = TableRowPropMUI & { searchQuery: string };

export type TableEmptyRowsProps = TableRowPropMUI & {
  emptyRows: number;
  height?: number;
};

export type TableMetaData = {
  filter?: Record<string, any>;
  sortBy?: [string, 'ASC' | 'DESC'][];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};
