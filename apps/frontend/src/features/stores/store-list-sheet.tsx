import { useState, useRef, forwardRef } from "react";
import type { Store } from "../../shared/api/stores";

interface StoreListSheetProps {
    stores: Store[];
    onStoreClick: (store: Store) => void;
}

const StoreListSheet = forwardRef<HTMLDivElement, StoreListSheetProps>(({ stores, onStoreClick }, ref) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const startY = useRef<number>(0);
    const isSingleStore = stores.length === 1;
    const sheetHeightClass = isSingleStore ? 'h-auto' : (isExpanded ? 'h-[90vh]' : 'h-[40vh]');
    const listBodyClass = isSingleStore
        ? 'px-4 pb-4 space-y-2 h-auto overflow-visible'
        : 'px-4 pb-[var(--page-safe-bottom)] space-y-2 h-full overflow-y-auto';

    if (!stores || stores.length === 0) return null;

    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        if ('touches' in e) {
            startY.current = e.touches[0].clientY;
        } else {
            startY.current = (e as React.MouseEvent).clientY;
        }
    };

    const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
        let endY = 0;
        if ('changedTouches' in e) {
            endY = e.changedTouches[0].clientY;
        } else {
            endY = (e as React.MouseEvent).clientY;
        }

        const deltaY = startY.current - endY;

        if (deltaY > 50) { // Dragged Up
            setIsExpanded(true);
        } else if (deltaY < -50) { // Dragged Down
            setIsExpanded(false);
        }
    };

    // Toggle on click as well for convenience
    const handleClick = () => {
        setIsExpanded(!isExpanded);
    }

    return (
        <div
            ref={ref}
            className={`fixed bottom-[calc(var(--bottom-nav-height)+28px)] left-5 right-5 z-40 bg-white rounded-[32px] shadow-[0_18px_45px_rgba(15,23,42,0.12)] overflow-hidden transition-all duration-300 ease-in-out animate-fade-up ${sheetHeightClass}`}
        >
            <div
                className="sticky top-0 bg-white pt-4 pb-2 z-10 cursor-grab active:cursor-grabbing"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}
                onMouseUp={handleTouchEnd}
                onClick={handleClick}
            >
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />
                <div className="px-6 mt-2 text-sm text-gray-500 font-medium">
                    내 주변 {stores.length}개의 가게
                </div>
            </div>

            <div className={listBodyClass}>
                {stores.map((store) => (
                    <div
                        key={store.id}
                        onClick={() => onStoreClick(store)}
                        className="flex justify-between items-center p-4 rounded-2xl bg-white border border-slate-200 shadow-none hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <div>
                            <h3 className="font-bold text-slate-900">{store.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                <span>{store.type?.name || '가게'}</span>
                                <span className="w-0.5 h-3 bg-slate-200" />
                                <span>{store.averageRating || 0} ⭐</span>
                            </div>
                            <p className="text-sm text-slate-400 mt-1 truncate max-w-[200px]">{store.address}</p>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-sky-500 font-medium">{store.distance ? `${store.distance}m` : ''}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

StoreListSheet.displayName = "StoreListSheet";

export default StoreListSheet;
