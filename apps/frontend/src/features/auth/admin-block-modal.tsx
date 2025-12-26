interface AdminBlockModalProps {
    isOpen: boolean;
    onReturnToAdmin: () => void;
    onLogout: () => void;
}

const AdminBlockModal = ({ isOpen, onReturnToAdmin, onLogout }: AdminBlockModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 px-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
        >
            <div className="glass-panel-strong w-full max-w-sm rounded-[28px] p-7 text-center shadow-[0_30px_70px_rgba(15,23,42,0.22)]">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-2xl text-white shadow-lg">
                    관리자
                </div>
                <h2 className="text-lg font-bold text-slate-900">일반 서비스 제한</h2>
                <p className="mt-2 text-sm text-slate-500">
                    관리자 계정으로 일반 서비스를 사용할 수 없습니다.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                    <button
                        onClick={onReturnToAdmin}
                        className="liquid-button w-full py-3 text-sm font-semibold"
                    >
                        관리자 페이지로 돌아가기
                    </button>
                    <button
                        onClick={onLogout}
                        className="liquid-outline w-full py-3 text-sm font-semibold"
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminBlockModal;
