import { createFileRoute } from '@tanstack/react-router';
import StoreFullDetail from '../../features/stores/store-full-detail';

export const Route = createFileRoute('/stores/$storeId')({
    component: StoreDetailRoute
});

function StoreDetailRoute() {
    const { storeId } = Route.useParams();
    return <StoreFullDetail storeId={Number(storeId)} />;
}
