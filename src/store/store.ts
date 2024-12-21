import { TableMetaData } from 'src/components/table/type';
import { create } from 'zustand';

interface IList {
  fetchOn?: Date;
  isFetching?: boolean;
  refreshNumber?: number;
  isLoading?: boolean;
  data?: Record<string, any>;
  meta?: TableMetaData;
}
interface IDetail {
  refreshNumber?: number;
  isFetching?: boolean;
  isLoading?: boolean;
  data?: Record<string, any>;
  fetchOn?: Date;
}

interface IStore {
  dataStore?: Record<string, { detail?: IDetail; list?: IList }>;
  setLoadingList: (key: string, isLoading: boolean) => void;
  setRefreshList: (key: string, refreshNumber: number) => void;
  setFetchingList: (key: string, isFetching: boolean) => void;

  setRefreshDetail: (key: string, refreshNumber: number) => void;
  setLoadingDetail: (key: string, isLoading: boolean) => void;
  setFetchingDetail: (key: string, isFetching: boolean) => void;

  setList: (key: string, list: IList) => void;
  setDetail: (key: string, detail: IDetail) => void;

  addItem: (key: string, data: Record<string, any>) => void;
  editItem: (key: string, data: Record<string, any>, index?: number) => void;
  deleteItem: (key: string, id?: string | number, index?: number) => void;

  removeStore: (key: string) => void;
}

export const usePageStore = create<IStore>((set) => ({
  dataStore: {},

  removeStore: (key: string) => {
    set((state) => {
      const newDataStore = { ...state.dataStore };

      // Remove the item corresponding to the specified key
      delete newDataStore[key];

      // Return the updated state
      return { dataStore: newDataStore };
    });
  },

  setRefreshList: (key: string, refreshNumber: number) =>
    set((state) => ({
      dataStore: {
        ...state.dataStore,
        [key]: {
          ...state?.dataStore![key],
          list: {
            ...state?.dataStore![key]?.list,
            refreshNumber: refreshNumber,
          },
        },
      },
    })),

  setRefreshDetail: (key: string, refreshNumber: number) =>
    set((state) => ({
      dataStore: {
        ...state.dataStore,
        [key]: {
          ...state?.dataStore![key],
          detail: {
            ...state?.dataStore![key]?.detail,
            refreshNumber: refreshNumber,
          },
        },
      },
    })),

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

  addItem: (key: string, item: Record<string, any>) =>
    set((state) => {
      const existingList = state?.dataStore![key]?.list?.data || [];
      existingList.unshift(item);
      return {
        dataStore: {
          ...state.dataStore,
          [key]: {
            ...state?.dataStore![key],
            list: { ...state?.dataStore![key]?.list, data: existingList },
          },
        },
      };
    }),

  editItem: (key: string, item: Record<string, any>, index?: number) =>
    set((state) => {
      const existingList = state.dataStore![key]?.list?.data || [];
      const findIndex =
        index || existingList.findIndex((row: Record<string, any>) => row?.id == item?.id);

      const updatedList = existingList.map((currentItem: Record<string, any>, i: number) =>
        i === findIndex ? { ...currentItem, ...item } : currentItem
      );

      return {
        dataStore: {
          ...state.dataStore!,
          [key]: {
            ...state?.dataStore![key],
            list: {
              ...state?.dataStore![key]?.list,
              data: updatedList,
            },
          },
        },
      };
    }),

  deleteItem: (key: string, id?: string | number, index?: number) =>
    set((state) => {
      const existingList = state.dataStore![key]?.list?.data || [];
      const findIndex =
        index || existingList.findIndex((row: Record<string, any>) => row?.id == id);

      const updatedList = existingList.filter(
        (_: Record<string, any>, i: number) => i !== findIndex
      );
      return {
        dataStore: {
          ...state.dataStore,
          [key]: {
            ...state?.dataStore![key],
            list: {
              ...state?.dataStore![key]?.list,
              data: updatedList,
            },
          },
        },
      };
    }),

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
