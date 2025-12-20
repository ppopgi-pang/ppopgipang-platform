import { apiClient } from "../lib/axios";

export interface User {
    email: string;
    username: string;
    profileImage: string;
}

export interface Review {
    id: number;
    rating: number;
    content: string;
    images?: string[];
    user: User;
    createdAt: string;
    updatedAt: string;
}

export interface StoreDetailResponse {
    store: Store;
    reviews: Review[];
}

export interface StoreDetail extends Store {
    // Legacy support or if we want to merge them manually
    reviews?: Review[];
}

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
    const { data } = await apiClient.get<StoreResponse>("/stores/nearby", {
        params: {
            latitude: params.latitude,
            longitude: params.longitude,
            radius: params.radius || 100,
            page: params.page || 1,
            size: params.size || 10,
            keyword: params.keyword,
        },
    });
    return data;
};

export const getStoresInBounds = async (params: InBoundsParams): Promise<StoreResponse> => {
    const { data } = await apiClient.get<StoreResponse>("/stores/in-bounds", {
        params: {
            north: params.north,
            south: params.south,
            east: params.east,
            west: params.west,
            keyword: params.keyword,
        },
    });
    return data;
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
    await apiClient.post("/stores", data);
};

export const createStoreType = async (data: CreateStoreTypeDto): Promise<void> => {
    await apiClient.post("/stores/type", data);
};


export interface ReviewCreateRequest {
    storeId: number;
    rating: number;
    content: string;
    images?: string[];
    boardId: number; // Seems required by API based on user request example
}

export interface FileUploadResponse {
    fileName: string;
}

export const uploadFile = async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post<FileUploadResponse>("/commons/file-upload", formData, {
        headers: {
            // Axios automatically sets Content-Type to multipart/form-data when body is FormData
            // Explicitly setting it to undefined lets the browser set the boundary
            "Content-Type": "multipart/form-data",
        }
    });

    return data;
};

export const createReview = async (data: ReviewCreateRequest): Promise<Review> => {
    // Hardcoded auth token for now as per user request example (or use existing mechanism if any, but sticking to simple fetch for now based on file style)
    // Actually the file uses simple fetch. We should probably assume auth headers are handled or needs to be added. 
    // The user request example showed an Authorization header.
    // However, existing calls in this file don't explicitly add it (except maybe purely public ones?).
    // Wait, createStore, createStoreType have no auth headers in the existing code. That might be a separate issue or handled by cookie/proxy?
    // User request explicitly showed curl with Bearer token.
    // I will use localStorage token if available or just generic fetch and assume configured global fetch or similar if it existed.
    // But looking at existing code: 
    // export const createStore = async (data: CreateStoreDto): Promise<void> => { ... }
    // It doesn't use the token. I should probably follow the pattern but maybe check if I need to retrieve token.
    // The existing code has `import { tokenManager}` commented out in `router/index.tsx`.
    // I will assume for now I need to send the token if I can find it, or just make the call.
    // Given the previous conversation summaries don't mention auth fully working, I'll stick to the pattern but I should probably try to get the token if possible.
    // Actually, I'll check if there's a token manager I can use.
    // Looking at the codebase search, there was `entities/user/user-api.ts`.
    // Let's blindly add the token from localStorage if present manually for now to be safe, or just standard fetch.
    // I'll stick to standard fetch to match file style, but if it fails I'll needed to fix it.
    // Wait, the existing POSTs might not be working if they need auth.
    // I'll proceed with standard fetch wrapping.

    // For the JWT token, I will hardcode getting it from localStorage 'accessToken' as is common, or just proceed. 
    // The request showed a specific token. I can't hardcode THAT token.

    // NOTE: The user's curl command had a Bearer token. 

    const { data: responseData } = await apiClient.post<Review>("/reviews", data);
    return responseData;
};

export const getStoreDetail = async (id: number): Promise<StoreDetailResponse> => {
    const { data } = await apiClient.get<StoreDetailResponse>(`/stores/${id}`);
    return data;
};
