import { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createChatMessage, findAllChatMessages, leaveChatRoom } from '@/shared/api/trades';

interface TradeChatRoomProps {
    chatRoomId: number;
    currentUserId: number;
    onClose: () => void;
}

export function TradeChatRoom({ chatRoomId, currentUserId, onClose }: TradeChatRoomProps) {
    const [message, setMessage] = useState('');
    const queryClient = useQueryClient();
    const scrollRef = useRef<HTMLDivElement>(null);

    const { data: messageList, isLoading } = useQuery({
        queryKey: ['chat-messages', chatRoomId],
        queryFn: () => findAllChatMessages(chatRoomId, 1, 50),
        refetchInterval: 3000,
    });

    const sendMessageMutation = useMutation({
        mutationFn: (msg: string) => createChatMessage({ chatRoomId, message: msg }),
        onSuccess: () => {
            setMessage('');
            queryClient.invalidateQueries({ queryKey: ['chat-messages', chatRoomId] });
        },
    });

    const leaveRoomMutation = useMutation({
        mutationFn: () => leaveChatRoom(chatRoomId),
        onSuccess: () => {
            onClose();
        },
    });

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messageList]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        sendMessageMutation.mutate(message);
    };

    const handleLeave = () => {
        if (window.confirm('채팅방을 나가시겠습니까? 대화 내용이 모두 삭제됩니다.')) {
            leaveRoomMutation.mutate();
        }
    };

    return (
        <div className="fixed inset-y-0 left-1/2 z-[100] w-full max-w-[var(--app-max-width)] -translate-x-1/2">
            <div className="flex h-full flex-col bg-slate-50">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200/60 bg-white px-4 py-3 shadow-sm pt-[max(12px,env(safe-area-inset-top))]">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-full p-1 -ml-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="font-bold text-lg text-slate-800">채팅</div>
                    </div>
                    <button
                        onClick={handleLeave}
                        className="text-xs font-medium text-rose-500 hover:text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full transition-colors"
                    >
                        나가기
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="flex flex-col-reverse gap-3 min-h-full justify-end">
                            {messageList?.list.map((msg) => {
                                const isMe = msg.sender.id === currentUserId;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[75%] px-4 py-2.5 text-sm shadow-sm ${isMe
                                                ? 'bg-sky-500 text-white rounded-2xl rounded-tr-sm'
                                                : 'bg-white text-slate-700 rounded-2xl rounded-tl-sm border border-slate-100'
                                                }`}
                                        >
                                            {msg.message}
                                        </div>
                                        <div className={`text-[10px] text-slate-400 mt-auto mb-1 mx-1 ${isMe ? 'order-first' : ''}`}>
                                            {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                );
                            })}
                            {messageList?.count === 0 && (
                                <div className="flex flex-1 flex-col items-center justify-center text-slate-400 py-20 gap-2 opacity-60">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <span className="text-sm">대화를 시작해보세요!</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Input */}
                <form
                    onSubmit={handleSend}
                    className="bg-white border-t border-slate-100 p-3 pb-[max(12px,env(safe-area-inset-bottom))]"
                >
                    <div className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="메시지를 입력하세요..."
                            className="flex-1 rounded-2xl bg-slate-100 py-3 pl-4 pr-12 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!message.trim() || sendMessageMutation.isPending}
                            className={`
                                absolute right-2 p-2 rounded-full shadow-sm transition-all
                                ${!message.trim() || sendMessageMutation.isPending
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-sky-500 text-white hover:bg-sky-600 active:scale-95'
                                }
                            `}
                        >
                            {sendMessageMutation.isPending ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
