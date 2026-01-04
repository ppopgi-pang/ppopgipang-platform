import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchStore } from "@/shared/api/stores";

interface StoreListProps {
    onSelectStore: (storeId: number) => void;
}

export default function StoreList({ onSelectStore }: StoreListProps) {
    const [keyword, setKeyword] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const size = 10;

    const { data, isLoading } = useQuery({
        queryKey: ['stores', searchQuery, page],
        queryFn: () => searchStore(searchQuery, page, size),
        enabled: true // Always fetch, or wait for search? usually fetch all/popular on load? 
        // searchStore returns list even with empty keyword usually or I can pass " " if required.
        // Let's pass empty string if no keyword.
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(keyword);
        setPage(1);
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Store List</h2>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search by name or address..."
                    className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
                <button
                    type="submit"
                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                    Search
                </button>
            </form>

            {/* List */}
            <div className="space-y-2">
                {isLoading ? (
                    <p className="text-center text-sm text-slate-500 py-8">Loading...</p>
                ) : data?.data?.length === 0 ? (
                    <p className="text-center text-sm text-slate-500 py-8">No stores found.</p>
                ) : (
                    data?.data.map((store) => (
                        <div key={store.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-4 hover:bg-slate-50 transition">
                            <div>
                                <h3 className="font-bold text-slate-800">{store.name}</h3>
                                <p className="text-sm text-slate-500">{store.address}</p>
                            </div>
                            <button
                                onClick={() => onSelectStore(store.id)}
                                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                            >
                                Edit
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Simple Pagination */}
            <div className="mt-6 flex justify-center gap-2">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                    className="px-3 py-1 rounded border disabled:opacity-50 text-sm"
                >
                    Prev
                </button>
                <span className="px-3 py-1 text-sm">{page}</span>
                <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={!data || data.data.length < size || isLoading}
                    className="px-3 py-1 rounded border disabled:opacity-50 text-sm"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
