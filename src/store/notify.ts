import { OptionsWithExtraProps } from 'notistack';
import { create } from 'zustand';

export type INotifyStore = INotify & { options?: OptionsWithExtraProps<BaseVariant> };

interface IStore {
  notify?: INotifyStore;
  setNotify: (notify: INotifyStore) => void;
  dismissNotify: () => void;
}

export const useNotifyStore = create<IStore>((set) => ({
  setNotify: (notify: INotifyStore) =>
    set({
      notify: {
        dismissAction: true,
        key: crypto.randomUUID(),
        ...notify,
      },
    }),
  dismissNotify: () => set(() => ({ notify: undefined })),
}));
