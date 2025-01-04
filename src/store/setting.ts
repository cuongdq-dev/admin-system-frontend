import { create } from 'zustand';

export interface IListNotification {
  data?: NotificationItem[];
  meta?: TableMetaData;
  links?: { current?: string; last?: string; next?: string };
}
export interface INotifications {
  new?: IListNotification;
  archived?: IListNotification;
  all?: IListNotification;
}
export interface ISetting {
  lang?: { code: string; name: string }[];
  user?: Record<string, any>;
  notifyNew?: number;
  notifications?: INotifications;
}

interface ISettingStore {
  lang?: { code: string; name: string }[];
  user?: Record<string, any>;
  notifyNew?: number;
  notifications?: INotifications;
  setSetting: (values: ISetting) => void;
  setNotifyNew: (value: number) => void;
  setNotifications: (notifications: INotifications) => void;

  setNotificationsNew: (notifications: IListNotification) => void;
  setNotificationsAll: (notifications: IListNotification) => void;
  setNotificationsArchived: (notifications: {
    data?: NotificationItem[];
    meta?: TableMetaData;
  }) => void;
}

export const useSettingStore = create<ISettingStore>((set) => ({
  notifyNew: 0,
  setSetting: (settings: ISetting) => set((state) => ({ ...state, ...settings })),

  setNotifications: (notifications: INotifications) =>
    set((state) => ({ ...state, notifications: notifications })),

  setNotificationsNew: (notifications: IListNotification) =>
    set((state) => ({ ...state, notifications: { ...state.notifications, new: notifications } })),

  setNotificationsAll: (notifications: IListNotification) =>
    set((state) => ({ ...state, notifications: { ...state.notifications, all: notifications } })),

  setNotificationsArchived: (notifications: IListNotification) =>
    set((state) => ({
      ...state,
      notifications: { ...state.notifications, archived: notifications },
    })),

  setNotifyNew: (value: number) => set((state) => ({ notifyNew: value })),
}));
