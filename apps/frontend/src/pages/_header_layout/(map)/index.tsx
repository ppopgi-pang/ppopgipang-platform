import SearchBar from '@/shared/ui/search-bar/search-bar.ui'
import { createFileRoute } from '@tanstack/react-router'
import { Map, MapMarker } from 'react-kakao-maps-sdk'
import { useGeolocation } from '@/shared/hooks/use-geolocation'
import { useQuery } from '@tanstack/react-query'
import { getNearbyStores, getStoresInBounds, searchStore, type Store } from '@/shared/api/stores'
import { useEffect, useState, useCallback, useRef } from 'react'
import StoreDetailSheet from '@/features/stores/store-detail-sheet'
import StoreListSheet from '@/features/stores/store-list-sheet'
import SearchResultList from '@/features/search/search-result-list'
import { useDebounce } from '@/shared/hooks/use-debounce'

export const Route = createFileRoute('/_header_layout/(map)/')({
  component: MapPage,
})

function MapPage() {
  const { coordinates, loaded } = useGeolocation();
  const [center, setCenter] = useState(coordinates);
  const [level, setLevel] = useState(3);
  const [bounds, setBounds] = useState<{ n: number, s: number, e: number, w: number } | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const [sheetNode, setSheetNode] = useState<HTMLDivElement | null>(null);
  const [sheetBottomOffset, setSheetBottomOffset] = useState<number | null>(null);

  // Search State
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 300); // 300ms debounce
  // const [searchResults, setSearchResults] = useState<Store[]>([]); // Removed
  // const [totalSearchCount, setTotalSearchCount] = useState(0); // Removed

  // Initial center sync with geolocation
  useEffect(() => {
    if (loaded) {
      setCenter(coordinates);
    }
  }, [loaded, coordinates]);

  // Fetch stores in bounds
  const { data: storesData } = useQuery({
    queryKey: ['stores', bounds, center],
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

  // Search API (Live Search)
  const { data: searchResponse, refetch: searchRefetch } = useQuery({
    queryKey: ['search', debouncedKeyword],
    queryFn: () => {
      if (!debouncedKeyword) return null;
      return searchStore(debouncedKeyword, 1, 100);
    },
    enabled: !!debouncedKeyword,
  });

  const searchResults = searchResponse?.data || [];
  const totalSearchCount = searchResponse?.meta?.count || 0;

  // Handlers
  const handleCenterChanged = useCallback(() => {
    // Optional: track center
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

  useEffect(() => {
    if (!mapRef.current) return;
    handleBoundsChanged(mapRef.current);
  }, [center, handleBoundsChanged]);

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
    setLevel(map.getLevel());
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

  const handleSearch = () => {
    if (keyword.trim()) {
      setSelectedStore(null);
      searchRefetch();
    }
  };

  const handleSearchResultClick = (store: Store) => {
    setKeyword(''); // Clears query, hides list
    handleStoreClick(store);
  };

  const hasSheet = Boolean(selectedStore) || (storesData?.data?.length ?? 0) > 0;
  const buttonBottomClass = hasSheet
    ? 'bottom-[calc(42vh+var(--page-safe-bottom))]'
    : 'bottom-[calc(var(--page-safe-bottom)+8px)]';

  return <div className='w-full h-screen relative'>
    <div className='absolute top-4 w-full z-20 px-4'>
      <SearchBar
        value={keyword}
        onChange={setKeyword}
        onSearch={handleSearch}
      />
      {searchResults.length > 0 && keyword && ( // Only show if keyword exists
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
      style={{
        width: "100%",
        height: "100%",
      }}
      level={level}
      onCenterChanged={handleCenterChanged}
      onDragEnd={handleDragEnd}
      onZoomChanged={handleZoomChanged}
      onCreate={handleMapCreate}
      onClick={() => {
        setSelectedStore(null);
        setKeyword(''); // Clear search on map click if desired, or just list closes via UI logic
        // If we want to hide results on map click:
        // Since results depend on keyword, clearing keyword hides them.
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
        storesData?.data?.map((store: Store) => (
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
        onStoreClick={handleStoreClick}
      />
    )}

  </div>
}
