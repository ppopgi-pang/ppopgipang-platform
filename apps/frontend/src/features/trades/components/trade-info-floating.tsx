import type { TradeChatResult } from "@ppopgipang/types";
import { useNavigate } from "@tanstack/react-router";
import { TRADE_IMAGE_BASE_URL } from "@/shared/lib/api-config";

interface TradeInfoFloatingProps {
    trade: TradeChatResult.TradeSimpleDto;
    chatRoomId?: number;
}

export function TradeInfoFloating({ trade, chatRoomId }: TradeInfoFloatingProps) {
    const navigate = useNavigate();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return '판매중';
            case 'completed': return '거래완료';
            case 'cancelled': return '취소됨';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-sky-500 text-white';
            case 'completed': return 'bg-slate-500 text-white';
            case 'cancelled': return 'bg-rose-500 text-white';
            default: return 'bg-slate-200 text-slate-600';
        }
    };

    return (
        <div
            onClick={() => navigate({
                to: '/trades/$tradeId',
                params: { tradeId: trade.id.toString() },
                search: chatRoomId ? { fromChatRoomId: chatRoomId.toString() } : undefined
            })}
            className="bg-white border-b border-slate-100 p-3 flex gap-3 sticky top-[57px] z-10 shadow-sm animate-slide-down cursor-pointer hover:bg-slate-50 transition-colors"
        >
            {/* Image */}
            <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                {trade.image ? (
                    <img
                        src={`${TRADE_IMAGE_BASE_URL}${trade.image}`}
                        alt={trade.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-slate-800 truncate">{trade.title}</h3>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-bold text-slate-900">{formatPrice(trade.price)}원</span>
                    {trade.type === 'exchange' && (
                        <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-sm font-medium">교환가능</span>
                    )}
                </div>
            </div>

            {/* Status */}
            <div className="flex flex-col items-end gap-1 shrink-0">
                <div className={`text-[10px] px-2 py-1 rounded-full font-medium ${getStatusColor(trade.status)}`}>
                    {getStatusLabel(trade.status)}
                </div>
            </div>
        </div>
    );
}
