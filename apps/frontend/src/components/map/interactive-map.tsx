import { Map, MapMarker } from "react-kakao-maps-sdk";
import { type Coordinates } from "@/hooks/map/use-user-location";
import UserPositionMarker from "@/assets/icons/markers/user-marker.svg";

interface InteractiveMapProps {
  center: Coordinates;
  userPosition?: Coordinates;
  heading?: number | null;
  accuracy?: number | null;
  onCenterChange: (center: Coordinates) => void;
  level?: number;
}

export function InteractiveMap({
  center,
  userPosition,
  heading: _heading,
  accuracy: _accuracy,
  onCenterChange,
  level = 3,
}: InteractiveMapProps) {
  const handleDragEnd = (map: kakao.maps.Map) => {
    const latlng = map.getCenter();
    onCenterChange({
      lat: latlng.getLat(),
      lng: latlng.getLng(),
    });
  };

  return (
    <Map
      id="map"
      center={center}
      level={level}
      isPanto
      onDragEnd={handleDragEnd}
      style={{ width: "100%", height: "100%" }}
    >
      {/* 사용자 위치 마커 */}
      {userPosition && (
        <>
          <MapMarker
            position={userPosition}
            image={{
              src: UserPositionMarker,
              size: { width: 45, height: 45 },
            }}
          />
        </>
      )}
    </Map>
  );
}
