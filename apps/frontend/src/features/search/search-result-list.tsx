
import type { Store } from "../../shared/api/stores";
import { useState } from "react";

interface SearchResultListProps {
    results: Store[];
    totalCount: number;
    onClick: (store: Store) => void;
}

export default function SearchResultList({ results, totalCount, onClick }: SearchResultListProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Show 3 items initially, or all if expanded
    const visibleResults = isExpanded ? results : results.slice(0, 3);
    const hasMore = results.length > 3;

    return (
        <div className="absolute top-20 left-4 right-4 z-30 flex flex-col gap-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-up">
                <div className="flex flex-col">
                    {visibleResults.map((store, index) => (
                        <div
                            key={store.id}
                            onClick={() => onClick(store)}
                            className={`flex justify-between items-center p-4 hover:bg-slate-50 transition-colors cursor-pointer ${index !== visibleResults.length - 1 ? 'border-b border-slate-100' : ''
                                }`}
                        >
                            <div>
                                <h3 className="font-bold text-slate-900">{store.name}</h3>
                                <p className="text-sm text-slate-400 mt-1 truncate max-w-[200px]">{store.address}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-xs text-sky-500 font-medium">{store.type?.name}</span>
                                <span className="text-xs text-slate-400">
                                    {store.averageRating ? `★ ${store.averageRating}` : ''}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {hasMore && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full py-3 bg-slate-50 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors border-t border-slate-100 flex items-center justify-center gap-2"
                    >
                        {isExpanded ? (
                            <>
                                접기 <span className="rotate-180">▼</span>
                            </>
                        ) : (
                            <>
                                더보기 ({totalCount - 3}개 더있음) <span>▼</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
