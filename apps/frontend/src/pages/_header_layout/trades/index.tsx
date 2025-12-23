import { createFileRoute, Link } from '@tanstack/react-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { searchTrades } from '@/shared/api/trades';
import SearchBar from '@/shared/ui/search-bar/search-bar.ui';
import TradeCard from '@/features/trades/components/trade-card';
import { useDebounce } from '@/shared/hooks/use-debounce';

export const Route = createFileRoute('/_header_layout/trades/')({
    component: TradesPage,
});

function TradesPage() {
    const [keyword, setKeyword] = useState('');
    const debouncedKeyword = useDebounce(keyword, 300);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['trades', debouncedKeyword],
        queryFn: ({ pageParam = 1 }) => searchTrades(debouncedKeyword, pageParam, 10),
        getNextPageParam: (lastPage, allPages) => {
            const currentCount = allPages.flatMap(page => page.data).length;
            return currentCount < lastPage.metadata.count ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allTrades = data?.pages.flatMap((page) => page.data) || [];

    return (
        <div className="relative flex min-h-screen flex-col gap-6 bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-[calc(var(--page-safe-bottom)+64px)]">
            <div className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl" />
            <div className="pointer-events-none absolute top-32 -left-16 h-44 w-44 rounded-full bg-amber-200/30 blur-3xl" />

            <div className="sticky top-0 z-20 px-4 pt-6 pb-4 backdrop-blur-md bg-white/70">
                <div className="mb-3 flex items-end justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">중고거래</h1>
                        <p className="text-sm text-slate-500">가까운 이웃과 안전하게 거래하세요.</p>
                    </div>
                </div>
                <SearchBar
                    value={keyword}
                    onChange={setKeyword}
                    onSearch={() => { }} // Debounce handles it
                />
            </div>

            <div className="grid grid-cols-2 gap-4 px-4">
                {allTrades.map((trade) => (
                    <TradeCard key={trade.id} trade={trade} />
                ))}
            </div>

            {isLoading && (
                <div className="flex justify-center py-10">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
                </div>
            )}

            {!isLoading && allTrades.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mb-4 h-16 w-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p>등록된 게시글이 없습니다.</p>
                </div>
            )}

            <div ref={loadMoreRef} className="h-10" />

            <div className="fixed bottom-[calc(var(--page-safe-bottom)+12px)] left-1/2 z-40 w-full max-w-[var(--app-max-width)] -translate-x-1/2 px-5 flex justify-end">
                <Link
                    to="/trades/new"
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/40 transition-all hover:scale-105 active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
