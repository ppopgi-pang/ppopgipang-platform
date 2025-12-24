import type { TradeResult } from "@ppopgipang/types";
import { Link } from "@tanstack/react-router";
import { TRADE_IMAGE_BASE_URL } from "@/shared/lib/api-config";

interface TradeCardProps {
    trade: TradeResult.TradeSummaryDto;
}

export default function TradeCard({ trade }: TradeCardProps) {
    return (
        <Link
            to="/trades/$tradeId"
            params={{ tradeId: trade.id.toString() }}
            className="group flex flex-col overflow-hidden rounded-3xl glass-panel transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)]"
        >
            <div className="relative aspect-square bg-slate-100 overflow-hidden">
                {trade.images?.[0] ? (
                    <img
                        src={`${TRADE_IMAGE_BASE_URL}${trade.images[0]}`}
                        alt={trade.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                        이미지 없음
                    </div>
                )}
                <div className="absolute left-3 top-3 flex gap-1">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm ${trade.type === 'sale' ? 'bg-sky-500' : 'bg-emerald-500'
                        }`}>
                        {trade.type === 'sale' ? '판매' : '교환'}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm ${trade.status === 'active' ? 'bg-amber-400' : trade.status === 'completed' ? 'bg-slate-400' : 'bg-rose-400'
                        }`}>
                        {trade.status === 'active' ? '진행중' : trade.status === 'completed' ? '거래완료' : '취소됨'}
                    </span>
                </div>
            </div>
            <div className="p-4">
                <h3 className="line-clamp-1 text-sm font-semibold text-slate-900">{trade.title}</h3>
                <p className="mt-1 text-lg font-bold text-sky-600">
                    {trade.price ? `${trade.price.toLocaleString()}원` : '가격 제안'}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{trade.user.nickname}</span>
                    <span className="text-[10px] text-slate-400">
                        {new Date(trade.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </Link>
    );
}
