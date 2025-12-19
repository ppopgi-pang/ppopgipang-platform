import { Link } from "@tanstack/react-router";

interface LoginSignupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginSignupModal = ({ isOpen, onClose }: LoginSignupModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm animate-fade-up"
            onClick={onClose}
        >
            <div
                className="glass-panel-strong rounded-[32px] p-8 w-[min(420px,92vw)] shadow-[0_30px_70px_rgba(15,23,42,0.18)] animate-pop"
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 mb-4">
                    <img
                        src="/icons/ppopgipang-icon.png"
                        alt="뽑기팡"
                        className="w-12 h-12 rounded-[16px] shadow-[0_10px_20px_rgba(56,189,248,0.35)]"
                    />
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">환영해요!</h2>
                        <p className="text-xs text-slate-500">로그인 후 내 주변 뽑기방을 모아보세요.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-6">
                    <Link
                        to="/login"
                        className="liquid-button w-full py-3 text-center text-sm font-semibold"
                        onClick={onClose}
                    >
                        로그인
                    </Link>
                    <Link
                        to="/login"
                        className="liquid-outline w-full py-3 text-center text-sm font-semibold"
                        onClick={onClose}
                    >
                        회원가입
                    </Link>
                </div>
                <button
                    onClick={onClose}
                    className="mt-5 w-full text-xs text-slate-500 hover:text-slate-600"
                >
                    다음에 하기
                </button>
            </div>
        </div>
    );
};

export default LoginSignupModal;
