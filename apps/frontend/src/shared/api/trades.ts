import type { TradeInput, TradeResult } from "@ppopgipang/types";
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
