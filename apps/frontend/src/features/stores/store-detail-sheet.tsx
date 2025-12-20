import { forwardRef, useRef } from "react";
import type { PointerEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Store } from "../../shared/api/stores";

interface StoreDetailSheetProps {
    store: Store | null;
    onClose: () => void;
}

const StoreDetailSheet = forwardRef<HTMLDivElement, StoreDetailSheetProps>(({ store, onClose }, ref) => {
    const navigate = useNavigate();
    const dragStartY = useRef<number | null>(null);
    const hasTriggered = useRef(false);
    if (!store) return null;

    const handleHandlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        dragStartY.current = event.clientY;
        hasTriggered.current = false;
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handleHandlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        if (dragStartY.current === null || hasTriggered.current) return;
        const deltaY = event.clientY - dragStartY.current;

        if (deltaY <= -28) {
            hasTriggered.current = true;
            navigate({ to: '/stores/$storeId', params: { storeId: store.id.toString() } });
        }
    };

    const handleHandlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
        dragStartY.current = null;
        hasTriggered.current = false;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };

    return (
        <div
            ref={ref}
            className="fixed bottom-0 left-0 right-0 z-50 p-6 pb-[var(--page-safe-bottom)] glass-panel-strong rounded-t-[28px] shadow-[0_-12px_40px_rgba(15,23,42,0.12)] animate-fade-up"
        >
            <div
                className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label="상세보기로 이동"
                onClick={() => navigate({ to: '/stores/$storeId', params: { storeId: store.id.toString() } })}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        navigate({ to: '/stores/$storeId', params: { storeId: store.id.toString() } });
                    }
                }}
                onPointerDown={handleHandlePointerDown}
                onPointerMove={handleHandlePointerMove}
                onPointerUp={handleHandlePointerUp}
                onPointerCancel={handleHandlePointerUp}
            />

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">{store.name}</h2>
                    <p className="text-sm text-slate-500">{store.type?.name || '가게'}</p>
                </div>
                {/* Close Button (Optional, can rely on clicking outside or swipe in future) */}
                <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    ✕
                </button>
            </div>

            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <span className="text-slate-400">📍</span>
                    <span className="text-slate-700 text-sm">{store.address}</span>
                </div>

                {store.phone && (
                    <div className="flex items-center gap-3">
                        <span className="text-slate-400">📞</span>
                        <a href={`tel:${store.phone}`} className="text-sky-600 text-sm hover:underline">{store.phone}</a>
                    </div>
                )}

                {/* Placeholders for Rating/Distance if available */}
                <div className="flex gap-4 mt-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                        <span>⭐</span>
                        <span>{store.averageRating || 0}</span>
                    </div>
                    {/* Distance is calculated relative to center, might need passing in or calculating */}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
                <button className="flex-1 py-3 liquid-button font-semibold">
                    길찾기
                </button>
                <button
                    onClick={() => navigate({ to: '/stores/$storeId', params: { storeId: store.id.toString() } })}
                    className="flex-1 py-3 liquid-outline font-semibold"
                >
                    상세보기
                </button>
            </div>
        </div>

    );
});

StoreDetailSheet.displayName = "StoreDetailSheet";

export default StoreDetailSheet;
