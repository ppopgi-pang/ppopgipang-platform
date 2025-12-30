import { api } from "../common/client";

/** TODO: backend 타입 정의 확인 필요 */
export interface UserInfo {
  id: number;
  email: string;
  nickname: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

/** TODO: backend 타입 정의 확인 필요 */
export interface SearchHistory {
  id: number;
  keyword: string;
  createdAt: string;
}

export const usersApi = {
  /**
   * (사용자) 사용자 정보 조회
   */
  getUserInfo: () => api.get<UserInfo>("/api/v1/users"),

  /**
   * (사용자) 내 최근 검색어 조회
   */
  getSearchHistory: () => api.get<SearchHistory[]>("/api/v1/users/me/search-history"),

  /**
   * (사용자) 검색 기록 전체 삭제
   */
  deleteAllSearchHistory: () => api.delete("/api/v1/users/me/search-history"),

  /**
   * (사용자) 특정 검색 기록 삭제
   */
  deleteSearchHistory: (id: number) =>
    api.delete(`/api/v1/users/me/search-history/${id}`),
};
