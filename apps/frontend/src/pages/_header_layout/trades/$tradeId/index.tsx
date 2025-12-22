import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { getTradeDetail, deleteTrade } from '@/shared/api/trades';
import { getMyProfile } from '@/shared/api/users';
import { TRADE_IMAGE_BASE_URL } from '@/shared/lib/api-config';

export const Route = createFileRoute('/_header_layout/trades/$tradeId/')({
    component: TradeDetailPage,
});

function TradeDetailPage() {
    const { tradeId } = Route.useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeIndex, setActiveIndex] = useState(0);

    const { data: trade, isLoading, error } = useQuery({
        queryKey: ['trade', tradeId],
        queryFn: () => getTradeDetail(Number(tradeId)),
    });

    const { data: me } = useQuery({
        queryKey: ['me'],
        queryFn: getMyProfile,
        retry: false,
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteTrade(Number(tradeId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trades'] });
            navigate({ to: '/trades' });
        },
        onError: () => {
            alert('삭제에 실패했습니다.');
        }
    });

    const isOwner = me && trade && (me.id === trade.user.id || me.isAdmin);
    const images = useMemo(() => trade?.images ?? [], [trade]);
    const hasMultipleImages = images.length > 1;

    const goPrev = () => {
        if (!hasMultipleImages) return;
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goNext = () => {
        if (!hasMultipleImages) return;
        setActiveIndex((prev) => (prev + 1) % images.length);
    };

    if (isLoading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" /></div>;
    if (error || !trade) return <div className="py-20 text-center text-slate-500">게시글을 찾을 수 없습니다.</div>;

    const handleDelete = () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            deleteMutation.mutate();
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-[calc(var(--page-safe-bottom)+64px)]">
            <div className="pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full bg-sky-200/30 blur-3xl" />
            <div className="pointer-events-none absolute top-48 -left-16 h-40 w-40 rounded-full bg-amber-200/30 blur-3xl" />

            <div className="sticky top-0 z-30 border-b border-white/60 bg-white/70 px-4 pb-3 pt-4 backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            onClick={() => navigate({ to: '/trades' })}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-sm ring-1 ring-white/70"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-400">중고거래</div>
                            <div className="truncate text-sm font-semibold text-slate-800">{trade.title}</div>
                        </div>
                    </div>
                    {isOwner && (
                        <div className="flex gap-2">
                            <Link
                                to="/trades/$tradeId/edit"
                                params={{ tradeId }}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-sm ring-1 ring-white/70"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/70 text-white shadow-sm ring-1 ring-white/60"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="relative mx-4 mt-4 overflow-hidden rounded-3xl bg-slate-100 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                <div className="aspect-square w-full">
                    {images.length > 0 ? (
                        <img
                            src={`${TRADE_IMAGE_BASE_URL}${images[activeIndex]}`}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">이미지 없음</div>
                    )}
                </div>
                {hasMultipleImages && (
                    <>
                        <button
                            type="button"
                            onClick={goPrev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-700 shadow-md ring-1 ring-white/70 backdrop-blur"
                            aria-label="이전 이미지"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-700 shadow-md ring-1 ring-white/70 backdrop-blur"
                            aria-label="다음 이미지"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-2 py-0.5 text-[11px] font-semibold text-white">
                            {activeIndex + 1} / {images.length}
                        </div>
                    </>
                )}
            </div>

            <div className="mx-4 mt-4 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">가격</div>
                        <div className="text-2xl font-black text-sky-600">
                            {trade.price ? `${trade.price.toLocaleString()}원` : '가격 제안'}
                        </div>
                    </div>
                    <button className="liquid-button h-11 rounded-2xl px-6 text-sm font-bold text-slate-900 shadow-lg shadow-sky-500/30 active:scale-95 transition-transform">
                        채팅하기
                    </button>
                </div>
            </div>

            <div className="mx-4 mt-4 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
                <div className="flex items-center gap-3 pb-4 border-b border-white/60">
                    <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-100">
                        <img src={trade.user.profileImage} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{trade.user.nickname}</span>
                        <span className="text-xs text-slate-400">{new Date(trade.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="pt-4 flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm ${trade.type === 'sale' ? 'bg-sky-500' : 'bg-emerald-500'
                            }`}>
                            {trade.type === 'sale' ? '판매하기' : '교환하기'}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm ${trade.status === 'active' ? 'bg-amber-400' : trade.status === 'completed' ? 'bg-slate-400' : 'bg-rose-400'
                            }`}>
                            {trade.status === 'active' ? '거래가능' : trade.status === 'completed' ? '거래완료' : '취소됨'}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold leading-tight text-slate-900">{trade.title}</h2>
                    <p className="min-h-[100px] whitespace-pre-wrap text-sm text-slate-600">{trade.description}</p>
                </div>
            </div>
        </div>
    );
}
