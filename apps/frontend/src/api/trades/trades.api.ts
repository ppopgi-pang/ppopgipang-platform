import { api } from "../common/client";

export type TradeType = "sale" | "exchange";
export type TradeStatus = "active" | "completed" | "cancelled";

export interface CreateTradeDto {
  title: string;
  description: string;
  images?: string[];
  price?: number;
  type: TradeType;
}

export interface UpdateTradeDto {
  title?: string;
  description?: string;
  images?: string[];
  price?: number;
  type?: TradeType;
  status?: TradeStatus;
}

export interface CreateTradeChatRoomDto {
  tradeId: number;
}

export interface CreateTradeChatMessageDto {
  chatRoomId: number;
  message: string;
}

export interface SearchTradeParams {
  keyword?: string;
  page?: number;
  size?: number;
}

export interface GetChatMessagesParams {
  chatRoomId: number;
  page?: number;
  size?: number;
}

export const tradesApi = {
  /**
   * (사용자) 중고거래 게시글 생성
   */
  createTrade: (data: CreateTradeDto) => api.post("/api/v1/trades", data),

  /**
   * (사용자) 중고거래 게시글 검색
   */
  searchTrade: (params: SearchTradeParams) =>
    api.get("/api/v1/trades/search", { params }),

  /**
   * (사용자) 중고거래 게시글 상세 조회
   */
  findOne: (id: number) => api.get(`/api/v1/trades/${id}`),

  /**
   * (사용자) 중고거래 게시글 수정
   */
  updateTrade: (id: number, data: UpdateTradeDto) =>
    api.patch(`/api/v1/trades/${id}`, data),

  /**
   * (사용자) 중고거래 게시글 삭제
   */
  deleteTrade: (id: number) => api.delete(`/api/v1/trades/${id}`),

  /**
   * (사용자) 채팅방 생성
   */
  createChatRoom: (data: CreateTradeChatRoomDto) =>
    api.post("/api/v1/trades/chat-room", data),

  /**
   * (사용자) 내 채팅방 목록 조회
   */
  getMyChatRooms: () => api.get("/api/v1/trades/chat-room"),

  /**
   * (사용자) 채팅방 나가기
   */
  leaveChatRoom: (id: number) =>
    api.delete(`/api/v1/trades/chat-room/${id}`),

  /**
   * (사용자) 채팅 메시지 전송
   */
  createChatMessage: (data: CreateTradeChatMessageDto) =>
    api.post("/api/v1/trades/chat-room/message", data),

  /**
   * (사용자) 채팅 메시지 목록 조회
   */
  getChatMessages: ({ chatRoomId, ...params }: GetChatMessagesParams) =>
    api.get(`/api/v1/trades/chat-room/${chatRoomId}/messages`, { params }),
};
