import { api } from "../common/client";

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

export interface NearbyStoresParams {
  latitude: number;
  longitude: number;
  radius?: number;
  page?: number;
  size?: number;
  keyword?: string;
}

export interface InBoundsStoresParams {
  north: number;
  south: number;
  east: number;
  west: number;
  keyword?: string;
}

export interface SearchStoresParams {
  keyword: string;
  lat?: number;
  lng?: number;
  page?: number;
  size?: number;
}

export interface NearestStoreParams {
  latitude: number;
  longitude: number;
  radius?: number;
}

export interface StoreSummaryParams {
  id: number;
  lat?: number;
  lng?: number;
}

export interface StoreGalleryParams {
  id: number;
  page?: number;
  size?: number;
  sort?: "recent" | "popular";
}

export const storesApi = {
  /**
   * (사용자) 가장 가까운 가게 1개 조회
   * GPS 기반으로 가장 가까운 가게 1개를 반환합니다. 반경 내 가게가 없으면 null 반환.
   */
  findNearestStore: (params: NearestStoreParams) =>
    api.get("/api/v1/stores/nearest", { params }),

  /**
   * (사용자) 가게 목록 - 반경 검색
   */
  findNearbyStores: (params: NearbyStoresParams) =>
    api.get("/api/v1/stores/nearby", { params }),

  /**
   * (사용자) 가게 목록 - 뷰포트(바운드) 검색
   */
  searchInBounds: (params: InBoundsStoresParams) =>
    api.get("/api/v1/stores/in-bounds", { params }),

  /**
   * (어드민) 가게 생성
   */
  createStore: (data: CreateStoreDto) => api.post("/api/v1/stores", data),

  /**
   * (사용자) 가게 검색 API
   */
  searchStore: (params: SearchStoresParams) =>
    api.get("/api/v1/stores/search", { params }),

  /**
   * (사용자) 가게 요약 정보 (시트용)
   */
  getStoreSummary: ({ id, ...params }: StoreSummaryParams) =>
    api.get(`/api/v1/stores/${id}/summary`, { params }),

  /**
   * (사용자) 가게 득템 갤러리 조회
   * 가게에서 인증된 득템 사진 목록
   */
  getStoreGallery: ({ id, ...params }: StoreGalleryParams) =>
    api.get(`/api/v1/stores/${id}/gallery`, { params }),

  /**
   * (사용자) 가게 스크랩 토글
   */
  toggleScrap: (id: number) => api.post(`/api/v1/stores/${id}/scrap`),

  /**
   * (사용자) 가게 상세 정보 API (확장)
   * AI 분석 데이터, 퀘스트 정보, 시설 정보, 운영 시간 등 포함
   */
  findStoreDetail: (id: number) => api.get(`/api/v1/stores/${id}`),

  /**
   * (어드민) 가게 타입(카테고리) 생성 API
   */
  createStoreType: (data: CreateStoreTypeDto) =>
    api.post("/api/v1/stores/type", data),

  /**
   * (어드민) 가게 타입(카테고리) 목록 조회 API
   */
  findStoreTypes: () => api.get("/api/v1/stores/type"),
};
