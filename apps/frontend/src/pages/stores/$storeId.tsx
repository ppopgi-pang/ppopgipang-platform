import { createFileRoute } from "@tanstack/react-router";
import StoreFullDetail from "@/features/stores/store-full-detail";

export const Route = createFileRoute("/stores/$storeId")({
	component: StoreDetailPage,
});

function StoreDetailPage() {
	const { storeId } = Route.useParams();
	return <StoreFullDetail storeId={Number(storeId)} />;
}
