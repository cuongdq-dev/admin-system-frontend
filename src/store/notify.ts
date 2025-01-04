import { OptionsWithExtraProps } from 'notistack';
import { create } from 'zustand';

export type INotifyStore = INotify & { options?: OptionsWithExtraProps<BaseVariant> };

interface IStore {
  notify?: INotifyStore;
  setNotify: (notify: INotifyStore) => void;
  dismissNotify: () => void;
}

export const useNotifyStore = create<IStore>((set) => ({
  setNotify: async (notify: INotifyStore) =>
    set({
      notify: {
        dismissAction: true,
        ...notify,
      },
    }),
  dismissNotify: () => set(() => ({ notify: undefined })),
}));
