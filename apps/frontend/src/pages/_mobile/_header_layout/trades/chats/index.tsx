import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getMyChatRooms } from '@/shared/api/trades';
import { formatRelativeTime } from '@/shared/utils/date';
import { openLoginModal } from '@/shared/lib/auth-modal';
import { useAuth } from '@/shared/lib/use-auth';
import LoginRequiredCard from '@/shared/ui/auth/login-required-card';

export const Route = createFileRoute('/_mobile/_header_layout/trades/chats/')({
    component: TradesChatListPage,
});

function TradesChatListPage() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const { data: chatRooms, isLoading } = useQuery({
        queryKey: ['myChatRooms'],
        queryFn: getMyChatRooms,
        enabled: isLoggedIn,
    });

    useEffect(() => {
        if (!isLoggedIn) {
            openLoginModal();
        }
    }, [isLoggedIn]);

    const avatarLabel = (nickname?: string) => {
        const trimmed = nickname?.trim();
        return trimmed ? trimmed.charAt(0).toUpperCase() : '?';
    };

    const chatTitle = (tradeTitle?: string, buyerName?: string) => {
        const title = tradeTitle?.trim() || '물품';
        const name = buyerName?.trim() || '구매자';
        return `${title} - ${name}`;
    };

    if (!isLoggedIn) {
        return (
            <LoginRequiredCard
                description="채팅 목록을 보려면 로그인해주세요."
                onBack={() => navigate({ to: '/trades' })}
            />
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-white pb-[calc(var(--page-safe-bottom)+20px)]">
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-white/80 px-4 py-3 backdrop-blur-md">
                <Link to="/trades" className="flex items-center text-slate-500 hover:text-slate-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="text-lg font-bold text-slate-900">채팅 목록</h1>
                <div className="w-6" /> {/* Placeholder for alignment */}
            </div>

            {isLoading ? (
                <div className="flex flex-1 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
                </div>
            ) : chatRooms?.list.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mb-4 h-16 w-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>진행 중인 채팅이 없습니다.</p>
                </div>
            ) : (
                <div className="flex flex-col">
                    {chatRooms?.list.map((item) => (
                        <Link
                            key={item.room.id}
                            to="/trades/$tradeId/chat-room/$chatRoomId"
                            params={{
                                tradeId: item.room.tradeId.toString(),
                                chatRoomId: item.room.id.toString(),
                            }}
                            search={{ from: 'chats' }}
                            className="flex items-center gap-4 border-b border-slate-50 px-4 py-4 transition-colors hover:bg-slate-50 active:bg-slate-100"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-lg font-semibold text-slate-600">
                                {item.room.buyer?.profileImage ? (
                                    <img
                                        src={item.room.buyer.profileImage}
                                        alt={item.room.buyer.nickname ?? '구매자 프로필'}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span>{avatarLabel(item.room.buyer?.nickname)}</span>
                                )}
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <span className="truncate font-semibold text-slate-900">
                                        {chatTitle(item.room.trade?.title, item.room.buyer?.nickname)}
                                    </span>
                                    {(item.lastMessage?.sentAt || item.room.createdAt) && (
                                        <span className="text-xs text-slate-400">
                                            {formatRelativeTime(
                                                new Date(item.lastMessage?.sentAt ?? item.room.createdAt).getTime()
                                            )}
                                        </span>
                                    )}
                                </div>
                                <p className="truncate text-sm text-slate-600">
                                    {item.lastMessage ? item.lastMessage.message : <span className="text-slate-400 italic">대화 내용이 없습니다.</span>}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
