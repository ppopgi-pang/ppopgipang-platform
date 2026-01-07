import type { Coordinates } from "@/hooks/map/use-user-location";
import { Map, MapMarker } from "react-kakao-maps-sdk";

interface KakaoMapProps {
  mapCenterPosition?: Coordinates; // ✅ lat, lng 모두 optional
  level?: number;
}

export default function KakaoMap({
  mapCenterPosition,
  level = 3,
}: KakaoMapProps) {
  return (
    <Map // 지도를 표시할 Container
      //   onCreate={}
      id="map"
      center={{
        lat: mapCenterPosition?.lat || 33.55635,
        lng: mapCenterPosition?.lng || 126.795841,
      }}
      isPanto
      style={{
        // 지도의 크기
        width: "100%",
        height: "100%",
        position: "relative",
        zIndex: 0,
      }}
      level={level} // 지도의 확대 레벨
    >
      <MapMarker position={{ lat: 33.55635, lng: 126.795841 }}>
        <div style={{ color: "#000" }}>Hello World!</div>
      </MapMarker>
    </Map>
  );
}
