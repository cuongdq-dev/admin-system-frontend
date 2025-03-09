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

declare type TableBase = {
  id: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  created_by?: string;
  updated_by?: string;
  deleted_by?: string;
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
  customCard?: ({ values, index }: { values: Record<string, any>; index: number }) => JSX.Element;
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

declare type IBreadcrumb = {
  items?: { href?: string; title?: string }[];
};

// TRENDING

interface IMedia extends TableBase {
  id: string;
  filename?: string; //unique
  url?: string;
  slug?: string;
  data?: string;
  minetype?: string;
  starage_type?: 'LOCAL' | 'S3' | 'BASE64';
  size?: number;
}

interface IPostCategory extends TableBase {
  id?: string;
  name?: string;
  slug?: string; //unique
  description?: string;
  postCount?: number;
  posts?: IPost[];
  sites?: ISite[];
}

declare type IPostStatus = 'NEW' | 'DRAFT' | 'PUBLISHED' | 'DELETED';
interface IPost extends TableBase {
  id: string;
  is_published?: string;
  slug?: string;
  title?: string;
  content?: string;
  meta_description?: string;
  relatedQueries?: { query?: string; slug?: string }[];
  //
  categories?: IPostCategory[];
  sites?: ISite[];
  status?: IPostStatus;
  //
  thumbnail_id?: string;
  thumbnail?: IMedia;
  //
  article_id?: string;
  article?: ITrendingArticle;
}

interface ITrendingArticle extends TableBase {
  id?: string;
  title?: string;
  url?: string; //unique
  slug?: string;
  source?: string;
  meta_description?: string;
  relatedQueries?: { query?: string; slug?: string }[];

  thumbnail_id?: string;
  thumbnail?: IMedia;

  trending_id?: string;
  trending?: ITrending;

  posts?: IPost[];
}

interface ITrending extends TableBase {
  id: string;
  titleQuery?: string; //unique
  titleExploreLink?: string;

  trendDate?: string;

  formattedTraffic?: string;
  relatedQueries?: { query?: string; slug?: string }[];

  thumbnail_id?: string;
  thumbnail?: IMedia;

  articles?: ITrendingArticle[];
}

interface ISite extends TableBase {
  id?: string;
  description?: string;
  domain?: string;
  autoPost?: boolean;
  name?: string;
  posts?: IPost[];
  categories?: IPostCategory[];
  token?: string;
  teleToken?: string;
  teleBotName?: string;
  teleChatName?: string;
  teleChatId?: string;
}
