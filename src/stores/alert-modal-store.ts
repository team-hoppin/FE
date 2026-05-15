import { create } from "zustand";
import { ReactNode } from "react";

interface OpenState {
  isOpen: true;
  type: "alert" | "confirm";
  variant: "warning" | "danger" | "mail-success" | "auth-error";

  message: ReactNode;
  description?: ReactNode;
  onAction?: () => void;
  onCancel?: () => void;
}

interface CloseState {
  isOpen: false;
}

type AlertModalStore = (OpenState | CloseState) & {
  actions: {
    open: (params: Omit<OpenState, "isOpen">) => void;
    close: () => void;
  };
};

const useAlertModalStore = create<AlertModalStore>((set) => ({
  isOpen: false,
  actions: {
    open: (params) => {
      set({ ...params, isOpen: true });
    },
    close: () => {
      set({ isOpen: false });
    },
  },
}));

export const useAlertModal = () => {
  return useAlertModalStore();
};

export const useOpenAlertModal = () => {
  return useAlertModalStore((store) => store.actions.open);
};

export const openAlertModal = (params: Omit<OpenState, "isOpen">) => {
  useAlertModalStore.getState().actions.open(params);
};
