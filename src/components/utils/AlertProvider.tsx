import React from 'react';
import {DesktopContext} from "@/components/os/Desktop";
import Modal, {ModalProps} from "@/components/os/Modal";
import {IconName} from "@/assets/icons";

interface AlertTypes {
    success: string;
    error: string;
    warning: string;
    info: string;
}

interface AlertContextProps {
    alert: (title: string, message: string, type: keyof AlertTypes, confirmText?: string) => Promise<void>;
    confirm: (
        title: string,
        message: string,
        type: keyof AlertTypes,
        confirmText?: string,
        cancelText?: string
    ) => Promise<boolean>;
}

interface AlertProviderProps {
    children: React.ReactNode;

}

const AlertContext = React.createContext<AlertContextProps>({} as AlertContextProps);
export const ALERT_WIDTH = 560;

const AlertProvider = ({children}: AlertProviderProps) => {
    const desktopContext = React.useContext(DesktopContext);

    const mapTypeToColor = (type: keyof AlertTypes) => {
        switch (type) {
            case 'success':
                return 'green';
            case 'error':
                return 'red';
            case 'warning':
                return 'yellow';
            case 'info':
                return 'blue';
            default:
                return 'blue';
        }
    }

    const mapTypeToIcon = (type: keyof AlertTypes): IconName => {
        switch (type) { // TODO: Add icons
            case 'success':
                return 'success';
            case 'error':
                return 'error';
            case 'warning':
                return 'alert';
            case 'info':
                return 'alert';
            default:
                return 'start';
        }
    }

    const alert = (title: string, message: string, type: keyof AlertTypes, confirmText: string = "OK") => {
        return new Promise<void>((resolve) => {
            desktopContext.addModal({
                key: 'modal',
                name: title,
                width: ALERT_WIDTH,
                resizable: false,
                icon: mapTypeToIcon(type),
                titleBarColor: mapTypeToColor(type),
                component: Modal,
                props: {
                    title,
                    message,
                    icon: mapTypeToIcon(type),
                    onConfirm: () => {
                        desktopContext.removeModal();
                        resolve();
                    },
                    onCancel: () => {
                        desktopContext.removeModal();
                        resolve();
                    },
                    confirmText,
                } as ModalProps,
            });
        });
    }

    const confirm = (
        title: string,
        message: string,
        type: keyof AlertTypes,
        confirmText: string = "OK",
        cancelText: string = "Cancel"
    ) => {
        return new Promise<boolean>((resolve) => {
            desktopContext.addModal({
                key: 'modal',
                name: title,
                width: ALERT_WIDTH,
                icon: mapTypeToIcon(type),
                titleBarColor: mapTypeToColor(type),
                component: Modal,
                props: {
                    title,
                    message,
                    icon: mapTypeToIcon(type),
                    onConfirm: () => {
                        desktopContext.removeModal();
                        resolve(true);
                    },
                    confirmText,
                    onCancel: () => {
                        desktopContext.removeModal();
                        resolve(false);
                    },
                    cancelText,
                } as ModalProps,
            });
        });
    }

    return (
        <AlertContext.Provider value={{ alert, confirm }}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    return React.useContext(AlertContext);
}

export default AlertProvider;