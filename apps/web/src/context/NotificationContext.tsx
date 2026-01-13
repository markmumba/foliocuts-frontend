import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from "react";
import { toast as sonnerToast } from "sonner";


export type ToastVariant = "success" | "error" | "info";

export type ToastMessage = {
    id: string;
    title?: string;
    message: string;
    variant: ToastVariant;
}

interface NotificationContextValue {
    push: (toast: Omit<ToastMessage, "id">) => void;
    dismiss: (id: string) => void;
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
}


const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const toastIdsRef = useRef(new Map<string, string | number>());

    const dismiss = useCallback((id: string) => {
        const sonnerId = toastIdsRef.current.get(id);
        if (sonnerId !== undefined) {
            sonnerToast.dismiss(sonnerId);
            toastIdsRef.current.delete(id);
        }
    }, []);

    const push = useCallback((toast: Omit<ToastMessage, 'id'>) => {
        const id = crypto.randomUUID();

        let sonnerId: string | number;

        if (toast.variant === "success") {
            sonnerId = sonnerToast.success(toast.title || toast.message, {
                description: toast.title ? toast.message : undefined,
                duration: 4000,
            });
        } else if (toast.variant === "error") {
            sonnerId = sonnerToast.error(toast.title || toast.message, {
                description: toast.title ? toast.message : undefined,
                duration: 4000,
            });
        } else {
            sonnerId = sonnerToast.info(toast.title || toast.message, {
                description: toast.title ? toast.message : undefined,
                duration: 4000,
            });
        }

        toastIdsRef.current.set(id, sonnerId);
    }, []);

    const success = useCallback(
        (message: string, title?: string) => push({ message, title, variant: 'success' }),
        [push]
    );

    const error = useCallback(
        (message: string, title?: string) => push({ message, title, variant: 'error' }),
        [push]
    );

    const info = useCallback(
        (message: string, title?: string) => push({ message, title, variant: 'info' }),
        [push]
    );

    const value = useMemo(
        () => ({
            push,
            dismiss,
            success,
            error,
            info
        }),
        [push, dismiss, success, error, info]
    );

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}