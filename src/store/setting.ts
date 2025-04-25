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

  user?: IUser;
  notifyNew?: number;
  notifications?: INotifications;
  breadcrumb?: IBreadcrumb;

  dropdown?: { sites?: IDropdown[]; posts?: IDropdown[]; categories?: IDropdown[] };
}

export interface IDropdown {
  id?: string;
  title?: string;
  slug?: string;
}
export interface IDropdowns {
  sites?: IDropdown[];
  posts?: IDropdown[];
  categories?: IDropdown[];
}
interface ISettingStore {
  lang?: { code: string; name: string }[];
  user?: IUser;
  notifyNew?: number;
  notifications?: INotifications;
  breadcrumb?: IBreadcrumb;
  dropdown?: { sites?: IDropdown[]; posts?: IDropdown[]; categories?: IDropdown[] };

  setSetting: (values: ISetting) => void;
  setDropdown: (values: IDropdowns) => void;
  setBreadcrumb: (breadcrumb?: IBreadcrumb) => void;
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
  setDropdown: (dropdown: IDropdowns) =>
    set((state) => ({ ...state, dropdown: { ...state.dropdown, ...dropdown } })),

  setSetting: (settings: ISetting) => set((state) => ({ ...state, ...settings })),
  setBreadcrumb: (breadcrumb?: IBreadcrumb) =>
    set((state) => ({ ...state, breadcrumb: breadcrumb })),

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
