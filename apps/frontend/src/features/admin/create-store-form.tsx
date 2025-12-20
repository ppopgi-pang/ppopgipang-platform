
import { useState, useEffect } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { createStore } from '@/shared/api/stores';
import { useGeolocation } from '@/shared/hooks/use-geolocation';

export default function CreateStoreForm() {
    const { coordinates, loaded } = useGeolocation();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        typeId: 1, // Defaulting to 1 for now, ideally strictly typed or fetched
        latitude: 0,
        longitude: 0,
    });
    const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780 }); // Default Seoul center
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Sync map center with user location once loaded
    useEffect(() => {
        if (loaded && coordinates) {
            setCenter(coordinates);
            // Optional: Set initial form lat/lng to user location? 
            // Maybe better to wait for user to click content.
            setFormData(prev => ({ ...prev, latitude: coordinates.lat, longitude: coordinates.lng }));
        }
    }, [loaded, coordinates]);

    const handleMapClick = (_map: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
        const lat = mouseEvent.latLng.getLat();
        const lng = mouseEvent.latLng.getLng();
        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'typeId' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            await createStore(formData);
            setMessage('Store created successfully!');
            // Reset form but keep location maybe? Or reset all
            setFormData({
                name: '',
                address: '',
                phone: '',
                typeId: 1,
                latitude: center.lat,
                longitude: center.lng,
            });
        } catch (error) {
            console.error(error);
            setMessage('Failed to create Store.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='p-4 border rounded shadow bg-white'>
            <h2 className='text-lg font-bold mb-4'>Create Store</h2>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Name</label>
                        <input
                            type='text'
                            name='name'
                            value={formData.name}
                            onChange={handleInputChange}
                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border'
                            required
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Type ID</label>
                        <input
                            type='number'
                            name='typeId'
                            value={formData.typeId}
                            onChange={handleInputChange}
                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border'
                            required
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Address</label>
                        <input
                            type='text'
                            name='address'
                            value={formData.address}
                            onChange={handleInputChange}
                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border'
                            required
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Phone</label>
                        <input
                            type='text'
                            name='phone'
                            value={formData.phone}
                            onChange={handleInputChange}
                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border'
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Location (Click on map to select)</label>
                    <div className='w-full h-[400px] border'>
                        <Map
                            center={center}
                            style={{ width: "100%", height: "100%" }}
                            level={3}
                            onClick={handleMapClick}
                        >
                            <MapMarker position={{ lat: formData.latitude, lng: formData.longitude }} />
                        </Map>
                    </div>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span>Lat: {formData.latitude.toFixed(6)}</span>
                        <span>Lng: {formData.longitude.toFixed(6)}</span>
                    </div>
                </div>

                <button
                    type='submit'
                    disabled={isLoading}
                    className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400'
                >
                    {isLoading ? 'Creating...' : 'Create Example Store'}
                </button>
                {message && <p className='text-sm text-center mt-2'>{message}</p>}
            </form>
        </div>
    );
}
