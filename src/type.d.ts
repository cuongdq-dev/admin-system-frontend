// SOCKET TYPE
declare type ISocketMessage = {
  type: 'MESSAGE';
  notify: INotify;
  message: Record<string, any>;
};

declare type ISocketNotify = {
  type: 'NOTIFY';
  notify: INotify;
  notification: NotificationItem;
};
declare type ISocketStore = {
  type: 'STORE';
  notify: INotify;
  storeName: string;
  detail?: IStoreDetail;
  list?: IStoreList;
};

declare type ISocket = ISocketNotify | ISocketMessage | ISocketStore;

// NOTIFY
declare type SnackbarKey = string | number;
declare type SnackbarMessage = string | React.ReactNode;
declare type BaseVariant = 'default' | 'error' | 'success' | 'warning' | 'info';

declare type INotify = {
  key?: SnackbarKey;
  title?: SnackbarMessage;
  dismissAction?: boolean;
  options?: any; //TODO UPDATE
};

//  TYPE PAGE
declare type IDetail = {
  defaultData?: Record<string, any>;
  loading?: boolean;
  handleUpdate?: (setError: UseFormSetError<FieldValues>, values?: Record<string, any>) => void;
};

// TYPE ENTITY REPOSITORY

declare type ContainerState =
  | 'created'
  | 'running'
  | 'paused'
  | 'restarting'
  | 'exited'
  | 'dead'
  | '';

declare type IContainerDocker = {
  id: string;
  name: string;
  image: string;
  ports: string;
  state: ContainerState;
  status: string;
  running_for: string;
  created_at: string;
};
declare type IImageDocker = {
  container_id?: string;
  container_name?: string;
  created?: string;
  id?: string;
  name?: string;
  server_path?: string;
  size?: string;
  status?: string;
  tag?: string;
  repository?: IRepository;
  service?: {
    serviceName?: string;
    buildContext?: string;
    envFile?: string;
    environment?: { variable?: string; value?: string }[];
    volumes: { hostPath?: string; containerPath?: string }[];
    ports?: string;
  };
};

declare type ServiceInstalledEnum = 'installed' | 'installing' | 'uninstalled' | 'failed';
declare type IService = {
  id?: string;
  name?: string;
  description?: string;
  installed?: ServiceInstalledEnum;
  icon?: string;
  is_installed?: boolean;
  is_active?: boolean;
  port?: string;
  memory_usage?: string;
  service_docker?: Record<string, any>;
};

declare type IRepository = {
  id?: string;
  name?: string;
  github_url?: string;
  fine_grained_token?: string;
  username?: string;
  email?: string;
  server_id?: string;
  with_env?: boolean;
  with_docker_compose?: boolean;
  services?: {
    serviceName?: string;
    buildContext?: string;
    envFile?: string;
    environment?: { variable?: string; value?: string }[];
    volumes: { hostPath?: string; containerPath?: string }[];
    ports?: string;
  }[];
  repo_env?: string;
};

declare type IServer = {
  id?: string;
  host?: string;
  name?: string;
  port?: string;
  password?: string;
  user?: string;
  is_active?: boolean;
  is_connected?: boolean;
  created_at?: Datetime;
  connectionId?: string;
  server_services?: IService[];
  repositories?: IRepository[];
};

declare type ITransition = {
  id?: string;
  lang?: ILang;
  code?: string;
  content?: string;
};

declare type ILang = {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
};

declare type Ilanguage = {
  code: string;
  name: string;
  description: string;
  content: Record<string, string>;
};

type TypeEnum =
  | 'MESSAGE'
  | 'SYSTEM'
  | 'COMMENT'
  | 'ORDER'
  | 'DELIVERY'
  | 'PROMOTION' // Sales or discount notifications
  | 'PAYMENT' // Payment-related updates
  | 'REFUND' // Refund processing notifications
  | 'FEEDBACK' // Feedback requests or updates
  | 'REMINDER' // Scheduled reminders
  | 'ACCOUNT'; // Account-related notifications

type StatusEnum =
  | 'NEW' // Just created
  | 'RECEIVED' // Acknowledged by the system
  | 'READED' // Marked as read by the user
  | 'PENDING' // Queued but not yet delivered
  | 'FAILED' // Delivery failed
  | 'ARCHIVED'; // Archived for reference

declare type NotificationItem = {
  id?: string;
  created_at: Date;
  updated_at: Date;
  title?: string;
  message?: string;
  status: StatusEnum;
  type?: TypeEnum;
  meta_data: string;
  user_id: string;
  user?: Record<string, any>;
};

// STORE TYPE
declare type IStoreList = {
  fetchOn?: Date;
  isFetching?: boolean;
  refreshNumber?: number;
  isLoading?: boolean;
  data?: Record<string, any>;
  meta?: TableMetaData;
};
declare type IStoreDetail = {
  refreshNumber?: number;
  isFetching?: boolean;
  isLoading?: boolean;
  data?: Record<string, any>;
  fetchOn?: Date;
};

// TABLE TYPE
declare type CellType =
  | 'checkbox'
  | 'text'
  | 'avatar'
  | 'status'
  | 'icon'
  | 'action'
  | 'datetime'
  | 'string-array'
  | 'custom';
declare type Align = 'left' | 'right' | 'center' | 'inherit' | 'justify';
declare type HeadLabelProps = {
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

declare type ActionProps = {
  row?: Record<string, any>;
  editBtn?: boolean;
  deleteBtn?: boolean;
  popupEdit?: boolean;
  refreshBtn?: boolean;
};

declare type TableActionComponentProps = {
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
declare type TableComponentProps = {
  component?: 'CARD' | 'TABLE';
  customCard?: ({ values }: { values: Record<string, any> }) => JSX.Element;
  url: string;
  storeName: string;
  headLabel: HeadLabelProps[];
  indexCol?: boolean;
  refreshData?: () => void;
  selectCol?: boolean;
  withSearch?: boolean;
  actions?: ActionProps;
  handleClickOpenForm?: (row: Record<string, any>, action: HttpMethod) => void;
};

declare type TableHeadProps = {
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

declare type TableToolbarProps = {
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

declare type TableRowProps = {
  row: Record<string, any>;
  selected: boolean;
  onSelectRow: () => void;
};

declare type TableNoDataProps = TableRowPropMUI & { searchQuery?: string; colSpan?: number };

declare type TableEmptyRowsProps = TableRowPropMUI & {
  emptyRows: number;
  height?: number;
};

declare type TableMetaData = {
  filter?: Record<string, any>;
  sortBy?: [string, 'ASC' | 'DESC'][];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};
