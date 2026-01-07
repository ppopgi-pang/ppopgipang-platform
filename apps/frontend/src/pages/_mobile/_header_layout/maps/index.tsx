import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CurrentLocationButton } from "@/components/map/buttons/current-location-button";
import useGeolocation, {
  DEFAULT_LOCATION,
  type Coordinates,
} from "@/hooks/map/use-user-location";
import { InteractiveMap } from "@/components/map/interactive-map";
import SearchModal from "@/components/map/search/search-modal";
import SearchBarButton from "@/shared/ui/search-bar/search-bar.ui";
import useModal from "@/hooks/ui/use-modal";

export const Route = createFileRoute("/_mobile/_header_layout/maps/")({
  component: MapPage,
});

function MapPage() {
  const [mapCenter, setMapCenter] = useState<Coordinates>(DEFAULT_LOCATION);
  const [isInitialLocationSet, setIsInitialLocationSet] = useState(false);

  const { isOpen, open, close } = useModal();

  const [place, setPlace] = useState<string | undefined>(undefined);

  const { loading, coordinates, heading, error: _error, accuracy } = useGeolocation({
    watch: true, // 실시간 추적 활성화
    enableHighAccuracy: true,
  });

  useEffect(() => {
    if (!loading && coordinates && !isInitialLocationSet) {
      setMapCenter(coordinates);
      setIsInitialLocationSet(true);
    }
  }, [loading, coordinates, isInitialLocationSet]);

  return (
    <>
      <div className="relative w-full h-full">
        <div className="absolute top-5 w-full h-10 z-10 px-3">
          <SearchBarButton searchedPlace={place} onClick={open} />
        </div>

        <div className="flex h-full w-full">
          <InteractiveMap
            center={mapCenter}
            userPosition={coordinates}
            heading={heading}
            accuracy={accuracy}
            level={3}
            onCenterChange={(center) => setMapCenter(center)}
          />

          <CurrentLocationButton
            onClick={() => {
              if (coordinates) {
                setMapCenter({ ...coordinates });
              } else {
                alert("실패");
              }
            }}
          />
        </div>
      </div>
      {isOpen && (
        <SearchModal
          selectedPlace={place ?? ""}
          isOpen
          onClose={close}
          onSelectPlace={(place) => setPlace(place)}
        />
      )}
    </>
  );
}
