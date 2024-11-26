import type { TableRowProps as TableRowPropMUI } from '@mui/material/TableRow';

export type CellType = 'checkbox' | 'text' | 'avatar' | 'status' | 'icon' | 'action';
export type Align = 'left' | 'right' | 'center' | 'inherit' | 'justify';
export type HeadLabelProps = {
  id: string;
  label: string;
  sort?: boolean;
  type?: CellType;
  align?: Align;
  width?: string | number;
  minWidth?: string | number;
};

export type ActionProps = {
  row?: Record<string, any>;
  editBtn?: boolean;
  deleteBtn?: boolean;
  popupEdit?: boolean;
  handleClickOpenForm?: (row: Record<string, any>, action: HttpMethod) => void;
};
export type TableComponentProps = {
  tableKey: string;
  url: string;
  headLabel: HeadLabelProps[];
  indexCol?: boolean;
  selectCol?: boolean;
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
  numSelected: number;
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