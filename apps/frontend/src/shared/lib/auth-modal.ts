

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

// requireAuth는 이제 사용되지 않음 (useAuth 훅 사용)
// export const requireAuth = () => { ... }
