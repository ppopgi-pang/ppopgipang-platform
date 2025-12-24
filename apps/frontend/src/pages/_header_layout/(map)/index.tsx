import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import {
	getNearbyStores,
	getStoresInBounds,
	searchStore,
	type Store,
} from "@/shared/api/stores";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { useGeolocation } from "@/shared/hooks/use-geolocation";
import SearchResultList from "@/features/search/search-result-list";
import StoreDetailSheet from "@/features/stores/store-detail-sheet";
import StoreListSheet from "@/features/stores/store-list-sheet";
import SearchBar from "@/shared/ui/search-bar/search-bar.ui";

type Bounds = { n: number; s: number; e: number; w: number };

export const Route = createFileRoute("/_header_layout/(map)/")({
	component: MapPage,
});

function MapPage() {
	const { coordinates, loaded } = useGeolocation();
	const [center, setCenter] = useState(coordinates);
	const [level, setLevel] = useState(3);
	const [bounds, setBounds] = useState<Bounds | null>(null);
	const [selectedStore, setSelectedStore] = useState<Store | null>(null);
	const [sheetNode, setSheetNode] = useState<HTMLDivElement | null>(null);
	const [sheetBottomOffset, setSheetBottomOffset] = useState<number | null>(null);
	const [keyword, setKeyword] = useState("");
	const normalizedKeyword = keyword.trim();
	const debouncedKeyword = useDebounce(normalizedKeyword, 300);
	const mapRef = useRef<kakao.maps.Map | null>(null);

	useEffect(() => {
		if (!loaded) return;
		setCenter(coordinates);
	}, [coordinates, loaded]);

	const storesQuery = useQuery({
		queryKey: ["stores", bounds, center],
		queryFn: () =>
			bounds
				? getStoresInBounds({
						north: bounds.n,
						south: bounds.s,
						east: bounds.e,
						west: bounds.w,
				  })
				: getNearbyStores({ latitude: center.lat, longitude: center.lng }),
	});

	const searchQuery = useQuery({
		queryKey: ["search", debouncedKeyword],
		queryFn: () => searchStore(debouncedKeyword, 1, 100),
		enabled: Boolean(debouncedKeyword),
	});

	const searchResults = searchQuery.data?.data ?? [];
	const totalSearchCount = searchQuery.data?.meta?.count ?? 0;

	const handleBoundsChanged = useCallback((map: kakao.maps.Map) => {
		const nextBounds = map.getBounds();
		const sw = nextBounds.getSouthWest();
		const ne = nextBounds.getNorthEast();

		setBounds({
			n: ne.getLat(),
			s: sw.getLat(),
			e: ne.getLng(),
			w: sw.getLng(),
		});
	}, []);

	useEffect(() => {
		if (!mapRef.current) return;
		handleBoundsChanged(mapRef.current);
	}, [center, handleBoundsChanged]);

	const updateSheetBottomOffset = useCallback(() => {
		if (!sheetNode || typeof window === "undefined") return;
		const rect = sheetNode.getBoundingClientRect();
		const nextOffset = Math.max(12, window.innerHeight - rect.top + 12);
		setSheetBottomOffset(nextOffset);
	}, [sheetNode]);

	useEffect(() => {
		if (!sheetNode || typeof window === "undefined") {
			setSheetBottomOffset(null);
			return;
		}

		updateSheetBottomOffset();
		const resizeObserver =
			typeof ResizeObserver !== "undefined"
				? new ResizeObserver(updateSheetBottomOffset)
				: null;

		resizeObserver?.observe(sheetNode);
		window.addEventListener("resize", updateSheetBottomOffset);

		return () => {
			resizeObserver?.disconnect();
			window.removeEventListener("resize", updateSheetBottomOffset);
		};
	}, [sheetNode, updateSheetBottomOffset]);

	const handleMapCreate = useCallback(
		(map: kakao.maps.Map) => {
			mapRef.current = map;
			handleBoundsChanged(map);
		},
		[handleBoundsChanged],
	);

	const handleZoomChanged = useCallback(
		(map: kakao.maps.Map) => {
			setLevel(map.getLevel());
			handleBoundsChanged(map);
		},
		[handleBoundsChanged],
	);

	const handleMoveToCurrentLocation = useCallback(() => {
		const nextCenter = { lat: coordinates.lat, lng: coordinates.lng };
		setCenter(nextCenter);

		if (mapRef.current) {
			mapRef.current.setCenter(new kakao.maps.LatLng(nextCenter.lat, nextCenter.lng));
			handleBoundsChanged(mapRef.current);
		}
	}, [coordinates, handleBoundsChanged]);

	const handleStoreClick = (store: Store, nextLevel = 3) => {
		const nextCenter = { lat: Number(store.latitude), lng: Number(store.longitude) };
		setSelectedStore(store);
		setCenter(nextCenter);
		setLevel(nextLevel);

		if (mapRef.current) {
			const map = mapRef.current;
			map.setCenter(new kakao.maps.LatLng(nextCenter.lat, nextCenter.lng));
			handleBoundsChanged(map);
		}
	};

	const handleSearchSubmit = () => {
		if (!normalizedKeyword) return;
		setSelectedStore(null);
	};

	const handleSearchResultClick = (store: Store) => {
		setKeyword("");
		handleStoreClick(store);
	};

	const stores = storesQuery.data?.data || [];
	const hasSheet = Boolean(selectedStore) || stores.length > 0;
	const buttonBottomClass = hasSheet
		? "bottom-[calc(42vh+var(--page-safe-bottom))]"
		: "bottom-[calc(var(--page-safe-bottom)+8px)]";

	return (
		<div className="w-full h-screen relative">
			<div className="absolute top-4 w-full z-20 px-4">
				<SearchBar value={keyword} onChange={setKeyword} onSearch={handleSearchSubmit} />
				{searchResults.length > 0 && keyword && (
					<div className="mt-2">
						<SearchResultList
							results={searchResults}
							totalCount={totalSearchCount}
							onClick={handleSearchResultClick}
						/>
					</div>
				)}
			</div>

			<Map
				id="map"
				center={center}
				style={{ width: "100%", height: "100%" }}
				level={level}
				onCreate={handleMapCreate}
				onDragEnd={(map) => handleBoundsChanged(map)}
				onZoomChanged={handleZoomChanged}
				onClick={() => {
					setSelectedStore(null);
					setKeyword("");
				}}
			>
				{selectedStore ? (
					<MapMarker
						position={{
							lat: Number(selectedStore.latitude),
							lng: Number(selectedStore.longitude),
						}}
						title={selectedStore.name}
					/>
				) : (
					stores.map((store) => (
						<MapMarker
							key={store.id}
							position={{ lat: Number(store.latitude), lng: Number(store.longitude) }}
							title={store.name}
							onClick={() => handleStoreClick(store, 1)}
						/>
					))
				)}

				{loaded && (
					<MapMarker
						position={coordinates}
						image={{
							src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
							size: { width: 20, height: 20 },
						}}
						title="Current Location"
					/>
				)}
			</Map>

			<div
				className={`fixed left-1/2 z-40 w-full max-w-[var(--app-max-width)] -translate-x-1/2 px-5 flex justify-end ${buttonBottomClass}`}
				style={sheetBottomOffset !== null ? { bottom: `${sheetBottomOffset}px` } : undefined}
			>
				<button
					className="glass-panel glass-pill w-12 h-12 flex items-center justify-center text-lg transition-all duration-300 animate-float"
					onClick={handleMoveToCurrentLocation}
					aria-label="현재 위치로 이동"
				>
					<div className="w-6 h-6 flex items-center justify-center">📍</div>
				</button>
			</div>

			{selectedStore ? (
				<StoreDetailSheet ref={setSheetNode} store={selectedStore} onClose={() => setSelectedStore(null)} />
			) : (
				<StoreListSheet ref={setSheetNode} stores={stores} onStoreClick={handleStoreClick} />
			)}
		</div>
	);
}
