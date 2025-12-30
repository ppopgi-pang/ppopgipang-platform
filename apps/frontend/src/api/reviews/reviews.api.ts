import { api } from "../common/client";

export interface CreateReviewDto {
  rating: number;
  content: string;
  images: string[];
  storeId: number;
}

export interface GetReviewsParams {
  storeId: number;
  page: number;
  limit: number;
  sort: string;
}

export interface GetReviewStatsParams {
  storeId: number;
}

export interface GetMyReviewsParams {
  page: number;
  size: number;
}

export const reviewsApi = {
  /**
   * (사용자) 특정 가게 리뷰 리스트 조회
   */
  getReviews: (params: GetReviewsParams) =>
    api.get("/api/v1/reviews", { params }),

  /**
   * (사용자) 리뷰 생성
   */
  createReview: (data: CreateReviewDto) => api.post("/api/v1/reviews", data),

  /**
   * (사용자) 가게 리뷰 통계 조회
   */
  getReviewStats: (params: GetReviewStatsParams) =>
    api.get("/api/v1/reviews/stats", { params }),

  /**
   * (사용자) 내 리뷰 목록 조회
   */
  getMyReviews: (params: GetMyReviewsParams) =>
    api.get("/api/v1/reviews/my", { params }),
};
