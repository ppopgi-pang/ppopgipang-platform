import {
  DEFAULT_LOCATION,
  type Coordinates,
} from "@/hooks/map/use-geolocation";
import SearchBar from "@/shared/ui/search-bar/search-bar.ui";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import UserPositionMarker from "@/assets/icons/markers/user-marker.svg";

export const Route = createFileRoute("/_header_layout/maps/")({
  component: MapPage,
});

function MapPage() {
  const size = 50;
  const [mapCenter, setMapCenter] = useState<Coordinates>(DEFAULT_LOCATION);
  const [heading, setHeading] = useState<number | null>(null);
  const [currentPosition, setCurrentPosition] =
    useState<Coordinates>(DEFAULT_LOCATION);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setMapCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });

    navigator.geolocation.watchPosition((pos) => {
      setCurrentPosition({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      setHeading(pos.coords.heading);
    });
  }, []);

  return (
    <div className="relative w-screen h-screen">
      <div className="absolute top-5 w-full h-10 z-10 px-3">
        <SearchBar />
      </div>
      <button
        onClick={() => {
          setMapCenter({ ...currentPosition });
        }}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md active:scale-95 absolute left-0 bottom-0 -translate-y-50 translate-x-5 z-10"
        aria-label="현재 위치로 이동"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="3" fill="#555555" />
          <path
            d="M12 2V5M12 19V22M22 12H19M5 12H2"
            stroke="#555555"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <Map // 지도를 표시할 Container
        //   onCreate={}
        id="map"
        onDragEnd={(map) => {
          const latlng = map.getCenter();
          setMapCenter({
            lat: latlng.getLat(),
            lng: latlng.getLng(),
          });
        }}
        center={{
          lat: mapCenter?.lat || 33.55635,
          lng: mapCenter?.lng || 126.795841,
        }}
        isPanto
        style={{
          // 지도의 크기
          width: "100%",
          height: "100%",
        }}
        level={3} // 지도의 확대 레벨
      >
        <MapMarker
          position={currentPosition}
          image={{
            src: UserPositionMarker,
            size: { width: 45, height: 45 },
          }}
        />
      </Map>
    </div>
  );
}
