// TABLE DATA TYPE:
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
