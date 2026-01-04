import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStoreDetail } from "@/shared/api/stores";
import StoreList from "./store-list";
import StoreForm from "./store-form";

export default function EditStoreContainer() {
    const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

    return (
        <div className="flex flex-col gap-6">
            {!selectedStoreId ? (
                <StoreList onSelectStore={setSelectedStoreId} />
            ) : (
                <EditStoreFormWrapper
                    storeId={selectedStoreId}
                    onBack={() => setSelectedStoreId(null)}
                />
            )}
        </div>
    );
}

function EditStoreFormWrapper({ storeId, onBack }: { storeId: number, onBack: () => void }) {
    const { data: storeDetail, isLoading, isError } = useQuery({
        queryKey: ['store', storeId],
        queryFn: () => getStoreDetail(storeId),
        enabled: !!storeId,
        refetchOnWindowFocus: false, // Don't refetch on window focus while editing form
        staleTime: 0 // Always fetch fresh data on mount
    });

    if (isLoading) return <div className="text-center py-8">Loading Store Details...</div>;
    if (isError || !storeDetail) return <div className="text-center py-8 text-red-500">Failed to load store details.</div>;

    return (
        <StoreForm
            mode="edit"
            initialData={storeDetail}
            storeId={storeId}
            onCancel={onBack}
            onSuccess={onBack}
        />
    );
}
