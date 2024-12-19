import { TableMetaData } from 'src/components/table/type';
import { create } from 'zustand';

interface IList {
  fetchOn?: Date;
  isFetching?: boolean;
  isLoading?: boolean;
  data?: Record<string, any>;
  meta?: TableMetaData;
}
interface IDetail {
  isFetching?: boolean;
  isLoading?: boolean;
  data?: Record<string, any>;
  fetchOn?: Date;
}

interface IStore {
  dataStore?: Record<string, { detail?: IDetail; list?: IList }>;
  setLoadingList: (key: string, isLoading: boolean) => void;
  setFetchingList: (key: string, isFetching: boolean) => void;

  setLoadingDetail: (key: string, isLoading: boolean) => void;
  setFetchingDetail: (key: string, isFetching: boolean) => void;

  setList: (key: string, list: IList) => void;
  setDetail: (key: string, detail: IDetail) => void;
}

export const usePageStore = create<IStore>((set) => ({
  dataStore: {},

  setLoadingList: (key: string, isLoading: boolean) =>
    set((state) => ({
      dataStore: {
        ...state.dataStore,
        [key]: {
          ...state?.dataStore![key],
          list: { ...state?.dataStore![key]?.list, isLoading: isLoading },
        },
      },
    })),

  setFetchingList: (key: string, isFetching: boolean) =>
    set((state) => ({
      dataStore: {
        ...state.dataStore,
        [key]: {
          ...state?.dataStore![key],
          list: { ...state?.dataStore![key]?.list, isFetching: isFetching },
        },
      },
    })),

  setFetchingDetail: (key: string, isFetching: boolean) =>
    set((state) => ({
      dataStore: {
        ...state.dataStore,
        [key]: {
          ...state?.dataStore![key],
          detail: { ...state?.dataStore![key]?.detail, isFetching: isFetching },
        },
      },
    })),

  setLoadingDetail: (key: string, isLoading: boolean) =>
    set((state) => ({
      dataStore: {
        ...state.dataStore,
        [key]: {
          ...state?.dataStore![key],
          detail: { ...state?.dataStore![key]?.detail, isLoading: isLoading },
        },
      },
    })),

  setList: (key: string, list: IList) =>
    set((state) => ({
      dataStore: {
        ...state.dataStore,
        [key]: {
          ...state?.dataStore![key],
          list: { ...list, fetchOn: new Date() },
        },
      },
    })),

  setDetail: (key: string, detail: IDetail) =>
    set((state) => ({
      dataStore: {
        ...state.dataStore,
        [key]: {
          ...state?.dataStore![key],
          detail: { ...detail, fetchOn: new Date() },
        },
      },
    })),
}));
