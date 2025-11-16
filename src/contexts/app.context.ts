import { getAccessTokenFromLS } from "@/utils/auth";
import { create } from "zustand";

export interface NotificationItem {
    id: number;
    type: "success" | "error" | "info" | "warning";
    message?: string;
    duration?: number;
    showIcon?: boolean;
}



export interface AppState {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;



    loading: boolean;
    setLoading: (value: boolean) => void;

    notifications: NotificationItem[];
    addNotification: (notif: Omit<NotificationItem, "id">) => void;
    removeNotification: (id: number) => void;
    clearNotifications: () => void;


    reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({

    isAuthenticated: Boolean(getAccessTokenFromLS()),
    setIsAuthenticated: (value) => set({ isAuthenticated: value }),



    wallets: [],


    loading: false,
    setLoading: (value) => set({ loading: value }),


    notifications: [],
    addNotification: (notif) => {
        const id = Math.random();
        set({ notifications: [...get().notifications, { id, ...notif }] });

        if (notif.duration) {
            setTimeout(() => get().removeNotification(id), notif.duration);
        }
    },
    removeNotification: (id) =>
        set({ notifications: get().notifications.filter((n) => n.id !== id) }),

    clearNotifications: () => set({ notifications: [] }),


    reset: () =>
        set({
            isAuthenticated: false,
            notifications: [],
            loading: false,
        }),
}));
