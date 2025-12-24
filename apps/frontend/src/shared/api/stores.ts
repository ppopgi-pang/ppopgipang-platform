import type {
	AdminStoreInput,
	FileResult,
	ReviewInput,
	ReviewResult,
	StoreTypeInput,
	UserStoreResult,
} from "@ppopgipang/types";
import { apiClient } from "../lib/axios";

export type Store = UserStoreResult.StoreDto;
export type Review = ReviewResult.ReviewDto;
export type StoreDetailResponse = UserStoreResult.StoreDetailDto;
export type StoreResponse = UserStoreResult.InBoundSearchDto | UserStoreResult.FindNearByDto;
export type SearchResponse = UserStoreResult.SearchDto;
export type CreateStoreDto = AdminStoreInput.CreateStoreDto;
export type CreateStoreTypeDto = StoreTypeInput.CreateStoreTypeDto;
export type ReviewCreateRequest = ReviewInput.CreateReviewDto;
export type FileUploadResponse = FileResult.UploadDto;

export type NearbyParams = {
	latitude: number;
	longitude: number;
	radius?: number;
	page?: number;
	size?: number;
	keyword?: string;
};

export type InBoundsParams = {
	north: number;
	south: number;
	east: number;
	west: number;
	keyword?: string;
};

export const getNearbyStores = async ({
	latitude,
	longitude,
	radius = 100,
	page = 1,
	size = 10,
	keyword,
}: NearbyParams): Promise<UserStoreResult.FindNearByDto> => {
	const { data } = await apiClient.get<UserStoreResult.FindNearByDto>("/stores/nearby", {
		params: {
			latitude,
			longitude,
			radius,
			page,
			size,
			keyword,
		},
	});
	return data;
};

export const getStoresInBounds = async ({
	north,
	south,
	east,
	west,
	keyword,
}: InBoundsParams): Promise<UserStoreResult.InBoundSearchDto> => {
	const { data } = await apiClient.get<UserStoreResult.InBoundSearchDto>("/stores/in-bounds", {
		params: {
			north,
			south,
			east,
			west,
			keyword,
		},
	});
	return data;
};

export const searchStore = async (
	keyword: string,
	page = 1,
	size = 20,
): Promise<UserStoreResult.SearchDto> => {
	const { data } = await apiClient.get<UserStoreResult.SearchDto>("/stores/search", {
		params: { keyword, page, size },
	});
	return data;
};

export const createStore = async (data: CreateStoreDto): Promise<void> => {
	await apiClient.post("/stores", data);
};

export const createStoreType = async (data: CreateStoreTypeDto): Promise<void> => {
	await apiClient.post("/stores/type", data);
};

export const uploadFile = async (file: File): Promise<FileUploadResponse> => {
	const formData = new FormData();
	formData.append("file", file);

	const { data } = await apiClient.post<FileUploadResponse>("/commons/file-upload", formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});

	return data;
};

export const createReview = async (data: ReviewCreateRequest): Promise<Review> => {
	const { data: responseData } = await apiClient.post<Review>("/reviews", data);
	return responseData;
};

export const getStoreDetail = async (id: number): Promise<StoreDetailResponse> => {
	const { data } = await apiClient.get<StoreDetailResponse>(`/stores/${id}`);
	return data;
};
