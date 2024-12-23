// TABLE DATA TYPE:

type ServiceInstalledEnum = 'installed' | 'installing' | 'uninstalled' | 'failed';
type ContainerState = 'created' | 'running' | 'paused' | 'restarting' | 'exited' | 'dead' | '';

type IContainerDocker = {
  id: string;
  name: string;
  image: string;
  ports: string;
  state: ContainerState;
  status: string;
  running_for: string;
  created_at: string;
};
type IImageDocker = {
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

type IService = {
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

type IRepository = {
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

type IServer = {
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

type ITransition = {
  id?: string;
  lang?: ILang;
  code?: string;
  content?: string;
};

type ILang = {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
};

interface IRoute {
  name?: string;
  index?: boolean;
}

interface IDetail {
  defaultData?: Record<string, any>;
  loading?: boolean;
  handleUpdate?: (setError: UseFormSetError<FieldValues>, values?: Record<string, any>) => void;
}

interface Ilanguage {
  code: string;
  name: string;
  description: string;
  content: Record<string, string>;
}

interface NotificationItem {
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
}
