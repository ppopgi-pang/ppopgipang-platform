// import { useState, useEffect } from "react";

// export interface Coordinates {
//   lat: number;
//   lng: number;
// }

// export interface GeolocationState {
//   loading: boolean;
//   coordinates: Coordinates | undefined;
//   error: string | null;
// }

// export const DEFAULT_LOCATION: Coordinates = {
//   lat: 33.450701,
//   lng: 126.570667,
// };

// const useGeolocation = (options?: { defaultLocation?: Coordinates }) => {
//   const [state, setState] = useState<GeolocationState>({
//     loading: true,
//     coordinates: options?.defaultLocation || DEFAULT_LOCATION,
//     error: null,
//   });

//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setState({
//         loading: false,
//         coordinates: options?.defaultLocation || DEFAULT_LOCATION,
//         error: "GPS를 지원하지 않는 브라우저입니다.",
//       });
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setState({
//           loading: false,
//           coordinates: {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           },
//           error: null,
//         });
//       },
//       (error) => {
//         setState({
//           loading: false,
//           coordinates: options?.defaultLocation || DEFAULT_LOCATION,
//           error: error.message,
//         });
//       },
//     );
//   }, []);

//   // 현재 위치로 다시 이동하는 함수
//   const refetch = async () => {
//     setState((prev) => ({ ...prev, loading: true }));

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setState((prev) => ({
//           ...prev,
//           loading: false,
//           coordinates: {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           },
//           error: null,
//         }));
//       },
//       (error) => {
//         setState((prev) => ({
//           ...prev,
//           loading: false,
//           error: error.message,
//         }));
//       },
//     );
//   };

//   return { ...state, refetch };
// };

// export default useGeolocation;
