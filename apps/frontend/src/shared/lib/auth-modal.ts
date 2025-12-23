import { tokenManager } from "@/shared/lib/token-manager";

const AUTH_MODAL_EVENT = "ppopgipang:auth-modal";

export const openLoginModal = () => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent(AUTH_MODAL_EVENT));
};

export const onLoginModalOpen = (handler: () => void) => {
    if (typeof window === "undefined") return () => undefined;
    const listener = () => handler();
    window.addEventListener(AUTH_MODAL_EVENT, listener);
    return () => window.removeEventListener(AUTH_MODAL_EVENT, listener);
};

export const requireAuth = () => {
    const hasToken = Boolean(tokenManager.getAccessToken());
    if (!hasToken) {
        openLoginModal();
    }
    return hasToken;
};
