// import { useState, useEffect } from 'react';

// interface Coordinates {
//     lat: number;
//     lng: number;
// }

// interface GeolocationState {
//     loaded: boolean;
//     coordinates: Coordinates;
//     error?: {
//         code: number;
//         message: string;
//     };
// }

// export const useGeolocation = () => {
//     const [location, setLocation] = useState<GeolocationState>({
//         loaded: false,
//         coordinates: { lat: 37.497900, lng: 127.027600 }, // Default to Gangnam
//     });

//     const onSuccess = (location: GeolocationPosition) => {
//         setLocation({
//             loaded: true,
//             coordinates: {
//                 lat: location.coords.latitude,
//                 lng: location.coords.longitude,
//             },
//         });
//     };

//     const onError = (error: GeolocationPositionError) => {
//         setLocation({
//             loaded: true,
//             error: {
//                 code: error.code,
//                 message: error.message,
//             },
//             coordinates: { lat: 37.497900, lng: 127.027600 }, // Default fallback
//         });
//     };

//     useEffect(() => {
//         if (!("geolocation" in navigator)) {
//             onError({
//                 code: 0,
//                 message: "Geolocation not supported",
//                 PERMISSION_DENIED: 1,
//                 POSITION_UNAVAILABLE: 2,
//                 TIMEOUT: 3,
//             } as GeolocationPositionError);
//         }

//         navigator.geolocation.getCurrentPosition(onSuccess, onError);
//     }, []);

//     return location;
// };
