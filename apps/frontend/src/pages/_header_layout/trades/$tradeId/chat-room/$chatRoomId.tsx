import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { TradeChatRoom } from '@/features/trades/components/trade-chat-room';
import { getMyProfile } from '@/shared/api/users';
import { openLoginModal } from '@/shared/lib/auth-modal';
import { useAuth } from '@/shared/lib/use-auth';
import LoginRequiredCard from '@/shared/ui/auth/login-required-card';

export const Route = createFileRoute('/_header_layout/trades/$tradeId/chat-room/$chatRoomId')({
    validateSearch: (search: Record<string, unknown>) => ({
        from: search.from === 'chats' || search.from === 'trade' ? search.from : undefined,
    }),
    component: TradeChatRoomPage,
});

function TradeChatRoomPage() {
    const { tradeId, chatRoomId } = Route.useParams();
    const { from } = Route.useSearch();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const { data: me, isLoading } = useQuery({
        queryKey: ['me'],
        queryFn: () => getMyProfile(),
        retry: false,
        enabled: isLoggedIn,
    });

    const handleClose = () => {
        if (from === 'chats') {
            navigate({ to: '/trades/chats' });
            return;
        }
        navigate({ to: '/trades/$tradeId', params: { tradeId } });
    };

    useEffect(() => {
        if (!isLoggedIn) {
            openLoginModal();
        }
    }, [isLoggedIn]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!me) {
        return (
            <LoginRequiredCard
                description="채팅을 이용하려면 로그인해주세요."
                onBack={handleClose}
            />
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
