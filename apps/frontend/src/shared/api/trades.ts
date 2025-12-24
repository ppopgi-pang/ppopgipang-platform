import type { TradeChatInput, TradeChatResult, TradeInput, TradeResult } from "@ppopgipang/types";
import { apiClient } from "../lib/axios";

export const createTrade = async (dto: TradeInput.CreateTradeDto): Promise<number> => {
    const { data } = await apiClient.post<number>("/trades", dto);
    return data;
};

export const searchTrades = async (keyword: string = '', page: number = 1, size: number = 10): Promise<TradeResult.SearchDto> => {
    const { data } = await apiClient.get<TradeResult.SearchDto>("/trades/search", {
        params: { keyword, page, size }
    });
    return data;
};

export const getTradeDetail = async (id: number): Promise<TradeResult.TradeDetailDto> => {
    const { data } = await apiClient.get<TradeResult.TradeDetailDto>(`/trades/${id}`);
    return data;
};

export const updateTrade = async (id: number, dto: TradeInput.UpdateTradeDto): Promise<void> => {
    await apiClient.patch(`/trades/${id}`, dto);
};

export const deleteTrade = async (id: number): Promise<void> => {
    await apiClient.delete(`/trades/${id}`);
};

export const createChatRoom = async (dto: TradeChatInput.CreateTradeChatRoomDto): Promise<TradeChatResult.TradeChatRoomDto> => {
    const { data } = await apiClient.post<TradeChatResult.TradeChatRoomDto>("/trades/chat-room", dto);
    return data;
};

export const leaveChatRoom = async (id: number): Promise<void> => {
    await apiClient.delete(`/trades/chat-room/${id}`);
};

export const createChatMessage = async (dto: TradeChatInput.CreateTradeChatMessageDto): Promise<TradeChatResult.TradeChatMessageDto> => {
    const { data } = await apiClient.post<TradeChatResult.TradeChatMessageDto>("/trades/chat-room/message", dto);
    return data;
};

export const findAllChatMessages = async (chatRoomId: number, page: number = 1, size: number = 20): Promise<TradeChatResult.TradeChatMessageListDto> => {
    const { data } = await apiClient.get<TradeChatResult.TradeChatMessageListDto>(`/trades/chat-room/${chatRoomId}/messages`, {
        params: { page, size }
    });
    return data;
};

export const getMyChatRooms = async (): Promise<TradeChatResult.TradeChatRoomListDto> => {
    const { data } = await apiClient.get<TradeChatResult.TradeChatRoomListDto>("/trades/chat-room");
    return data;
};

