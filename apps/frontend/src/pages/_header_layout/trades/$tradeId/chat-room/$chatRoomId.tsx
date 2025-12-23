import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { TradeChatRoom } from '@/features/trades/components/trade-chat-room';
import { getMyProfile } from '@/shared/api/users';

export const Route = createFileRoute('/_header_layout/trades/$tradeId/chat-room/$chatRoomId')({
    component: TradeChatRoomPage,
});

function TradeChatRoomPage() {
    const { tradeId, chatRoomId } = Route.useParams();
    const navigate = useNavigate();

    const { data: me, isLoading } = useQuery({
        queryKey: ['me'],
        queryFn: getMyProfile,
        retry: false,
    });

    const handleClose = () => {
        navigate({ to: '/trades/$tradeId', params: { tradeId } });
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!me) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
                <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl border border-white/70 bg-white/90 p-6 text-center shadow-lg">
                    <div className="text-lg font-bold text-slate-800">로그인이 필요합니다.</div>
                    <p className="text-sm text-slate-500">채팅을 이용하려면 로그인해주세요.</p>
                    <div className="flex w-full gap-2">
                        <button
                            onClick={handleClose}
                            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600"
                        >
                            돌아가기
                        </button>
                        <button
                            onClick={() => navigate({ to: '/login' })}
                            className="flex-1 rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-500/40"
                        >
                            로그인
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <TradeChatRoom
            chatRoomId={Number(chatRoomId)}
            currentUserId={me.id}
            onClose={handleClose}
        />
    );
}
