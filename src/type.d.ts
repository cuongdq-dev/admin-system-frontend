// TABLE DATA TYPE:

type ServiceInstalledEnum = 'installed' | 'installing' | 'uninstalled' | 'failed';

type IContainerDocker = {
  id: string;
  name: string;
  image: string;
  status: string;
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
