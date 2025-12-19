export interface Store {
    id: number;
    name: string;
    address: string;
    latitude: string | number;
    longitude: string | number;
    phone?: string | null;
    averageRating?: number;
    distance?: number;
    type?: {
        id: number;
        name: string;
    };
}

export interface StoreResponse {
    success: boolean;
    data: Store[];
    meta: {
        count: number;
    };
}

export interface NearbyParams {
    latitude: number;
    longitude: number;
    radius?: number;
    page?: number;
    size?: number;
    keyword?: string;
}

export interface InBoundsParams {
    north: number;
    south: number;
    east: number;
    west: number;
    keyword?: string;
}

export const getNearbyStores = async (params: NearbyParams): Promise<StoreResponse> => {
    const query = new URLSearchParams({
        latitude: params.latitude.toString(),
        longitude: params.longitude.toString(),
        radius: (params.radius || 100).toString(),
        page: (params.page || 1).toString(),
        size: (params.size || 10).toString(),
    });

    if (params.keyword) {
        query.append("keyword", params.keyword);
    }

    const response = await fetch(`http://localhost:3000/api/v1/stores/nearby?${query.toString()}`, {
        method: 'GET',
        headers: {
            'accept': '*/*',
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch nearby stores');
    }

    return response.json();
};

export const getStoresInBounds = async (params: InBoundsParams): Promise<StoreResponse> => {
    const query = new URLSearchParams({
        north: params.north.toString(),
        south: params.south.toString(),
        east: params.east.toString(),
        west: params.west.toString(),
    });

    if (params.keyword) {
        query.append("keyword", params.keyword);
    }

    const response = await fetch(`http://localhost:3000/api/v1/stores/in-bounds?${query.toString()}`, {
        method: 'GET',
        headers: {
            'accept': '*/*',
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch stores in bounds');
    }

    return response.json();
};
export interface CreateStoreDto {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone: string;
    typeId: number;
}

export interface CreateStoreTypeDto {
    name: string;
    description: string;
}

export const createStore = async (data: CreateStoreDto): Promise<void> => {
    const response = await fetch('http://localhost:3000/api/v1/stores', {
        method: 'POST',
        headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to create store');
    }
};

export const createStoreType = async (data: CreateStoreTypeDto): Promise<void> => {
    const response = await fetch('http://localhost:3000/api/v1/stores/type', {
        method: 'POST',
        headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to create store type');
    }
};
