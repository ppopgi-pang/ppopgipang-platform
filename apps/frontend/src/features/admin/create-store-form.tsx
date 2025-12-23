import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import type { AdminStoreInput } from "@ppopgipang/types";
import { createStore } from "@/shared/api/stores";
import { useGeolocation } from "@/shared/hooks/use-geolocation";

type CreateStoreFormState = AdminStoreInput.CreateStoreDto;

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

export default function CreateStoreForm() {
	const { coordinates, loaded } = useGeolocation();
	const [center, setCenter] = useState(DEFAULT_CENTER);
	const [formData, setFormData] = useState<CreateStoreFormState>({
		name: "",
		address: "",
		phone: "",
		typeId: 1,
		latitude: DEFAULT_CENTER.lat,
		longitude: DEFAULT_CENTER.lng,
	});
	const [message, setMessage] = useState("");

	useEffect(() => {
		if (!loaded) return;
		setCenter(coordinates);
		setFormData((prev) => ({
			...prev,
			latitude: coordinates.lat,
			longitude: coordinates.lng,
		}));
	}, [coordinates, loaded]);

	const createStoreMutation = useMutation({
		mutationFn: (payload: CreateStoreFormState) => createStore(payload),
		onSuccess: () => {
			setMessage("Store created successfully!");
			setFormData((prev) => ({
				...prev,
				name: "",
				address: "",
				phone: "",
				typeId: 1,
				latitude: center.lat,
				longitude: center.lng,
			}));
		},
		onError: () => {
			setMessage("Failed to create Store.");
		},
	});

	const handleMapClick = (_map: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
		const lat = mouseEvent.latLng.getLat();
		const lng = mouseEvent.latLng.getLng();
		setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "typeId" ? Number(value) : value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setMessage("");
		createStoreMutation.mutate(formData);
	};

	return (
		<div className="p-4 border rounded shadow bg-white">
			<h2 className="text-lg font-bold mb-4">Create Store</h2>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">Name</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleInputChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Type ID</label>
						<input
							type="number"
							name="typeId"
							value={formData.typeId}
							onChange={handleInputChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Address</label>
						<input
							type="text"
							name="address"
							value={formData.address}
							onChange={handleInputChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Phone</label>
						<input
							type="text"
							name="phone"
							value={formData.phone ?? ""}
							onChange={handleInputChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Location (Click on map to select)
					</label>
					<div className="w-full h-[400px] border">
						<Map center={center} style={{ width: "100%", height: "100%" }} level={3} onClick={handleMapClick}>
							<MapMarker position={{ lat: formData.latitude, lng: formData.longitude }} />
						</Map>
					</div>
					<div className="flex gap-4 mt-2 text-sm text-gray-500">
						<span>Lat: {formData.latitude.toFixed(6)}</span>
						<span>Lng: {formData.longitude.toFixed(6)}</span>
					</div>
				</div>

				<button
					type="submit"
					disabled={createStoreMutation.isPending}
					className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
				>
					{createStoreMutation.isPending ? "Creating..." : "Create Store"}
				</button>
				{message && <p className="text-sm text-center mt-2">{message}</p>}
			</form>
		</div>
	);
}
