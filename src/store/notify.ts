import { OptionsWithExtraProps, SnackbarKey, SnackbarMessage } from 'notistack';
import { useId } from 'react';
import { create } from 'zustand';

type BaseVariant = 'default' | 'error' | 'success' | 'warning' | 'info';

export interface INotify {
  key?: SnackbarKey;
  title?: SnackbarMessage;
  options?: OptionsWithExtraProps<BaseVariant>;
  dismissAction?: boolean;
}

interface IStore {
  notify?: INotify;
  setNotify: (notify: INotify) => void;
  dismissNotify: () => void;
}

export const useNotifyStore = create<IStore>((set) => ({
  setNotify: (notify: INotify) =>
    set({
      notify: {
        dismissAction: true,
        key: crypto.randomUUID(),
        ...notify,
      },
    }),
  dismissNotify: () => set(() => ({ notify: undefined })),
}));
