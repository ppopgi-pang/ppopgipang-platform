import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getMyReviews } from "@/shared/api/reviews";
import { useAuth } from "@/shared/lib/use-auth";
import { useEffect, useRef } from "react";
import ReviewCard from "@/features/stores/review-card";

const MyReviewsPage = () => {
    const size = 10;
    const { isLoggedIn } = useAuth();
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['my-reviews'],
        queryFn: ({ pageParam = 1 }) => getMyReviews({ page: pageParam, size }),
        getNextPageParam: (lastPage, allPages) => {
            const loadedCount = allPages.reduce((count, page) => count + page.list.length, 0);
            return loadedCount < lastPage.total ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
        enabled: isLoggedIn,
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
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <p className="text-gray-500">로그인이 필요한 서비스입니다.</p>
            </div>
        );
    }

    if (isLoading) return <div className="p-4 text-center">로딩 중...</div>;
    if (error) return <div className="p-4 text-center text-red-500">에러가 발생했습니다.</div>;

    const reviews = data?.pages.flatMap((page) => page.list) || [];

    return (
        <div className="container mx-auto px-4 pb-24 pt-4 max-w-[var(--app-max-width)]">
            <h1 className="text-xl font-bold mb-6">내 리뷰</h1>

            <div className="flex flex-col gap-4">
                {reviews.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">작성한 리뷰가 없습니다.</div>
                ) : (
                    reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} showStoreInfo />
                    ))
                )}
            </div>

            {isFetchingNextPage && (
                <div className="py-6 text-center text-sm text-gray-400">불러오는 중...</div>
            )}
            <div ref={loadMoreRef} className="h-8" />
        </div>
    );
};

export const Route = createFileRoute('/_header_layout/my-reviews')({
    component: MyReviewsPage,
});
