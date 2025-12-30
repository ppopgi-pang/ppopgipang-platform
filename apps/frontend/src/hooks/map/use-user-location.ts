// hooks/map/use-user-location.ts
import { useState, useEffect, useRef } from "react";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeolocationState {
  loading: boolean;
  coordinates: Coordinates | undefined;
  heading: number | null;
  accuracy: number | null;
  error: string | null;
}

export const DEFAULT_LOCATION: Coordinates = {
  lat: 37.566535,
  lng: 126.977969,
};

interface UseGeolocationOptions {
  defaultLocation?: Coordinates;
  watch?: boolean;
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

const getErrorMessage = (error: GeolocationPositionError): string => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.";
    case error.POSITION_UNAVAILABLE:
      return "위치 정보를 사용할 수 없습니다. GPS 신호를 확인해주세요.";
    case error.TIMEOUT:
      return "위치 요청 시간이 초과되었습니다. 다시 시도해주세요.";
    default:
      return "위치 정보를 가져오는 중 오류가 발생했습니다.";
  }
};

const useGeolocation = (options?: UseGeolocationOptions) => {
  const {
    defaultLocation = DEFAULT_LOCATION,
    watch = true,
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = watch ? 1000 : 0,
  } = options || {};

  const defaultLocationRef = useRef(defaultLocation);

  const [state, setState] = useState<GeolocationState>({
    loading: true,
    coordinates: defaultLocationRef.current,
    heading: null,
    accuracy: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        loading: false,
        coordinates: defaultLocationRef.current,
        heading: null,
        accuracy: null,
        error: "GPS를 지원하지 않는 브라우저입니다.",
      });
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        loading: false,
        coordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        heading: position.coords.heading,
        accuracy: position.coords.accuracy,
        error: null,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: getErrorMessage(error),
      }));
    };

    const geoOptions: PositionOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge,
    };

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      geoOptions,
    );

    let watchId: number | undefined;
    if (watch) {
      watchId = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        geoOptions,
      );
    }

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watch, enableHighAccuracy, timeout, maximumAge]);

  const refetch = () => {
    setState((prev) => ({ ...prev, loading: true }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          heading: position.coords.heading,
          accuracy: position.coords.accuracy,
          error: null,
        });
      },
      (error) => {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: getErrorMessage(error),
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  return { ...state, refetch };
};

export default useGeolocation;
