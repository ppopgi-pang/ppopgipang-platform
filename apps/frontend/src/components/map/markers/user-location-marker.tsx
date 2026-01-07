import { MapMarker } from "react-kakao-maps-sdk";
import UserPositionMarker from "@/assets/icons/markers/user-marker.svg";
import type { Coordinates } from "@/hooks/map/use-user-location";

export default function UserLocationMarker({
  position,
  heading: _heading,
}: {
  position: Coordinates;
  heading: number | null;
}) {
  return (
    <MapMarker
      position={position}
      image={{
        src: UserPositionMarker,
        size: { width: 45, height: 45 },
      }}
    />
  );
}
