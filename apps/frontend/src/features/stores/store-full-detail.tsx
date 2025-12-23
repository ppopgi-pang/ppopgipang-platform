import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStoreDetail, type Review } from "@/shared/api/stores";
import ReviewCard from "./review-card";
import ReviewWriteModal from "./review-write-modal";

interface StoreFullDetailProps {
    storeId: number;
}

export default function StoreFullDetail({ storeId }: StoreFullDetailProps) {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ['store', storeId],
        queryFn: () => getStoreDetail(storeId),
        enabled: !!storeId,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <p className="text-slate-500 mb-4">가게 정보를 불러올 수 없습니다.</p>
                <button
                    onClick={() => window.history.back()}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm"
                >
                    돌아가기
                </button>
            </div>
        );
    }

    const { store, reviews } = data;

    return (
        <div className="min-h-screen bg-slate-50 pb-[var(--page-safe-bottom)]">
            {/* Header / Nav (Sticky) */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 h-14 flex items-center gap-3">
                <button
                    onClick={() => window.history.back()}
                    className="w-8 h-8 flex items-center justify-center -ml-2 text-slate-600"
                >
                    ←
                </button>
                <h1 className="font-bold text-lg text-slate-900 truncate">{store.name}</h1>
            </div>

            {/* Store Type & Rating Header */}
            <div className="px-5 pt-6 pb-4 bg-white mb-2">
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                        {store.type?.name || '가게'}
                    </span>
                    {store.averageRating && (
                        <span className="flex items-center text-sm font-bold text-slate-900">
                            ⭐ {store.averageRating}
                        </span>
                    )}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1 leading-tight">{store.name}</h2>
                <p className="text-slate-500 text-sm">{store.address}</p>

                {store.phone && (
                    <div className="mt-3 flex items-center gap-2">
                        <a
                            href={`tel:${store.phone}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-full"
                        >
                            📞 전화하기
                        </a>
                    </div>
                )}
            </div>

            {/* Reviews Section */}
            <div className="px-5 py-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        리뷰
                        <span className="text-sky-600">{reviews?.length || 0}</span>
                    </h3>
                    <button
                        onClick={() => setIsReviewModalOpen(true)}
                        className="text-sm font-bold text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                    >
                        ✎ 리뷰 작성
                    </button>
                </div>

                <div className="space-y-4">
                    {reviews && reviews.length > 0 ? (
                        reviews.map((review: Review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))
                    ) : (
                        <div className="text-center py-10 bg-white/50 rounded-2xl border border-dashed border-slate-300">
                            <p className="text-slate-400 text-sm mb-3">아직 작성된 리뷰가 없습니다.</p>
                            <button
                                onClick={() => setIsReviewModalOpen(true)}
                                className="text-sky-600 font-bold text-sm underline"
                            >
                                첫 번째 리뷰를 남겨주세요!
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Find Route Floating Button (Optional) */}
            <div className="fixed bottom-6 left-1/2 z-20 w-full max-w-[var(--app-max-width)] -translate-x-1/2 px-5">
                <button className="w-full py-3.5 liquid-button shadow-lg shadow-sky-500/30 text-white font-bold rounded-xl active:scale-[0.98] transition-transform">
                    길찾기
                </button>
            </div>

            <ReviewWriteModal
                storeId={storeId}
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
            />
        </div>
    );
}
