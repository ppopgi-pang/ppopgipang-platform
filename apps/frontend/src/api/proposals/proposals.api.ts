import { api } from "../common/client";

/** TODO: backend 타입 정의 확인 필요 */
export interface CreateProposalDto {
  // 추가 필요
}

export type ProposalStatus = "pending" | "approved" | "rejected";

export interface GetMyProposalsParams {
  status?: ProposalStatus;
  page?: number;
  size?: number;
}

export const proposalsApi = {
  /**
   * (사용자) 신규 제보 생성
   */
  createProposal: (data: CreateProposalDto) =>
    api.post("/api/proposals", data),

  /**
   * (사용자) 내 제보 내역 조회
   */
  getMyProposals: (params?: GetMyProposalsParams) =>
    api.get("/api/proposals/me", { params }),
};
