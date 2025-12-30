import { api } from "../common/client";

export type LootRating = "good" | "normal" | "bad";
export type LootSortType = "latest" | "popular";

/** TODO: backend 타입 정의 확인 필요 */
export interface CreateLootRequestDto {
  storeId: number;
  latitude?: number;
  longitude?: number;
  photoFileNames: string[];
  tagIds?: number[];
  comment?: string;
}

/** TODO: backend 타입 정의 확인 필요 */
export interface CreateCheckinRequestDto {
  storeId: number;
  latitude?: number;
  longitude?: number;
  rating: LootRating;
  reasonIds?: number[];
}

export interface GetLootGalleryParams {
  storeId: number;
  sort?: LootSortType;
  page?: number;
  size?: number;
}

export const certificationsApi = {
  /**
   * (사용자) 득템 갤러리 조회
   */
  getLootGallery: (params: GetLootGalleryParams) =>
    api.get("/api/v1/certifications/loots", { params }),

  /**
   * (사용자) 태그 및 프리셋 조회
   * 득템 태그, 한줄평 프리셋, 체크인 이유 프리셋 전체 조회
   */
  getPresets: () => api.get("/api/v1/certifications/presets"),

  /**
   * (사용자) 득템 인증 생성
   * 득템 인증을 생성하고 보상(EXP, 레벨, 스탬프, 배지)을 반환합니다.
   * 먼저 /v1/commons/file-upload로 이미지를 업로드하고 받은 파일명을 photoFileNames에 담아 전송합니다.
   */
  createLoot: (data: CreateLootRequestDto) =>
    api.post("/api/v1/certifications/loot", data),

  /**
   * (사용자) 체크인 인증 생성
   * 체크인 인증을 생성하고 보상(EXP, 레벨, 스탬프, 배지)을 반환합니다.
   */
  createCheckin: (data: CreateCheckinRequestDto) =>
    api.post("/api/v1/certifications/checkin", data),
};
