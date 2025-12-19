import SearchBar from '@/shared/ui/search-bar/search-bar.ui'
import { createFileRoute } from '@tanstack/react-router'
import { Map, MapMarker } from 'react-kakao-maps-sdk'
import { useGeolocation } from '@/shared/hooks/use-geolocation'
import { useQuery } from '@tanstack/react-query'
import { getNearbyStores, getStoresInBounds, type Store } from '@/shared/api/stores'
import { useEffect, useState, useCallback, useRef } from 'react'
import StoreDetailSheet from '@/features/stores/store-detail-sheet'
import StoreListSheet from '@/features/stores/store-list-sheet'

export const Route = createFileRoute('/_header_layout/(map)/')({
  component: MapPage,
})

function MapPage() {
  const { coordinates, loaded } = useGeolocation();
  const [center, setCenter] = useState(coordinates);
  const [bounds, setBounds] = useState<{ n: number, s: number, e: number, w: number } | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const [sheetNode, setSheetNode] = useState<HTMLDivElement | null>(null);
  const [sheetBottomOffset, setSheetBottomOffset] = useState<number | null>(null);

  // Initial center sync with geolocation
  useEffect(() => {
    if (loaded) {
      setCenter(coordinates);
    }
  }, [loaded]); // Only update when loaded status changes to true (initial load)

  // Fetch stores in bounds
  const { data: storesData } = useQuery({
    queryKey: ['stores', bounds, center], // Add center to dependency if bounds is null
    queryFn: () => {
      if (!bounds) return getNearbyStores({ latitude: center.lat, longitude: center.lng });

      return getStoresInBounds({
        north: bounds.n,
        south: bounds.s,
        east: bounds.e,
        west: bounds.w
      });
    },
    enabled: true,
  });

  // Handlers
  const handleCenterChanged = useCallback(() => {
    // const level = map.getLevel();
    // const latlng = map.getCenter();
    // setCenter({ lat: latlng.getLat(), lng: latlng.getLng() });
  }, []);

  const handleBoundsChanged = useCallback((map: kakao.maps.Map) => {
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    setBounds({
      n: ne.getLat(),
      s: sw.getLat(),
      e: ne.getLng(),
      w: sw.getLng()
    });
  }, []);

  const updateSheetBottomOffset = useCallback(() => {
    if (!sheetNode || typeof window === 'undefined') return;
    const rect = sheetNode.getBoundingClientRect();
    const nextOffset = Math.max(12, window.innerHeight - rect.top + 12);
    setSheetBottomOffset(nextOffset);
  }, [sheetNode]);

  useEffect(() => {
    if (!sheetNode || typeof window === 'undefined') {
      setSheetBottomOffset(null);
      return;
    }

    updateSheetBottomOffset();
    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(updateSheetBottomOffset)
      : null;

    resizeObserver?.observe(sheetNode);
    window.addEventListener('resize', updateSheetBottomOffset);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateSheetBottomOffset);
    };
  }, [sheetNode, updateSheetBottomOffset]);

  // Map lifecycle events
  const handleMapCreate = useCallback((map: kakao.maps.Map) => {
    mapRef.current = map;
    handleBoundsChanged(map);
  }, [handleBoundsChanged]);

  const handleDragEnd = useCallback((map: kakao.maps.Map) => {
    handleBoundsChanged(map);
  }, [handleBoundsChanged]);

  const handleZoomChanged = useCallback((map: kakao.maps.Map) => {
    handleBoundsChanged(map);
  }, [handleBoundsChanged]);

  const handleMoveToCurrentLocation = useCallback(() => {
    const nextCenter = { lat: coordinates.lat, lng: coordinates.lng };
    setCenter(nextCenter);

    if (mapRef.current) {
      const map = mapRef.current;
      map.setCenter(new kakao.maps.LatLng(nextCenter.lat, nextCenter.lng));
      handleBoundsChanged(map);
    }
  }, [coordinates, handleBoundsChanged]);

  const hasSheet = Boolean(selectedStore) || (storesData?.data?.length ?? 0) > 0;
  const buttonBottomClass = hasSheet
    ? 'bottom-[calc(42vh+var(--page-safe-bottom))]'
    : 'bottom-[calc(var(--page-safe-bottom)+8px)]';

  return <div className='w-full h-screen relative'>
    <div className='absolute top-4 w-full h-12 z-20 px-4'>
      <SearchBar />
    </div>

    <Map // 지도를 표시할 Container
      id="map"
      center={center}
      style={{
        width: "100%",
        height: "100%",
      }}
      level={3} // 지도의 확대 레벨
      onCenterChanged={handleCenterChanged}
      onDragEnd={handleDragEnd}
      onZoomChanged={handleZoomChanged}
      onCreate={handleMapCreate}
      onClick={() => setSelectedStore(null)} // Close sheet on map click
    >
      {storesData?.data?.map((store) => (
        <MapMarker
          key={store.id}
          position={{ lat: +store.latitude, lng: +store.longitude }}
          title={store.name}
          onClick={() => setSelectedStore(store)} // Open sheet on marker click
        />
      ))}

      {/* Current Location Marker (Blue Dot representation) */}
      {loaded && (
        <MapMarker
          position={coordinates}
          image={{
            src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png", // Replace with better user location icon if available
            size: { width: 20, height: 20 },
          }}
          title="Current Location"
        />
      )}
    </Map>

    {/* Current Location Button */}
    <button
      className={`fixed right-5 z-40 glass-panel glass-pill w-12 h-12 flex items-center justify-center text-lg transition-all duration-300 animate-float ${buttonBottomClass}`}
      style={sheetBottomOffset !== null ? { bottom: `${sheetBottomOffset}px` } : undefined}
      onClick={handleMoveToCurrentLocation}
      aria-label="현재 위치로 이동"
    >
      <div className="w-6 h-6 flex items-center justify-center">
        📍
      </div>
    </button>

    {/* Store Sheets */}
    {selectedStore ? (
      <StoreDetailSheet
        ref={setSheetNode}
        store={selectedStore}
        onClose={() => setSelectedStore(null)}
      />
    ) : (
      <StoreListSheet
        ref={setSheetNode}
        stores={storesData?.data || []}
        onStoreClick={setSelectedStore}
      />
    )}

  </div>
}
