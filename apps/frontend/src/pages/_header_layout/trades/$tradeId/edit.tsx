import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getTradeDetail, updateTrade } from '@/shared/api/trades';
import { uploadFile } from '@/shared/api/stores';
import type { TradeInput } from '@ppopgipang/types';
import { TEMP_IMAGE_BASE_URL, TRADE_IMAGE_BASE_URL } from '@/shared/lib/api-config';

export const Route = createFileRoute('/_header_layout/trades/$tradeId/edit')({
    component: TradeEditPage,
});

function TradeEditPage() {
    const { tradeId } = Route.useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<TradeInput.UpdateTradeDto>({
        title: '',
        description: '',
        price: 0,
        type: 'sale',
        status: 'active',
        images: [],
    });
    const [newImages, setNewImages] = useState<Set<string>>(new Set());
    const [uploading, setUploading] = useState(false);

    const { data: trade, isLoading: isFetching } = useQuery({
        queryKey: ['trade', tradeId],
        queryFn: () => getTradeDetail(Number(tradeId)),
    });

    useEffect(() => {
        if (trade) {
            setFormData({
                title: trade.title,
                description: trade.description,
                price: trade.price,
                type: trade.type,
                status: trade.status,
                images: trade.images,
            });
        }
    }, [trade]);

    const updateMutation = useMutation({
        mutationFn: (dto: TradeInput.UpdateTradeDto) => updateTrade(Number(tradeId), dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trade', tradeId] });
            queryClient.invalidateQueries({ queryKey: ['trades'] });
            navigate({ to: '/trades/$tradeId', params: { tradeId } });
        },
        onError: () => {
            alert('수정에 실패했습니다.');
        }
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploading(true);
        try {
            const newImagesList: string[] = [...(formData.images || [])];
            for (let i = 0; i < files.length; i++) {
                const { fileName } = await uploadFile(files[i]);
                newImagesList.push(fileName);
                setNewImages(prev => new Set(prev).add(fileName));
            }
            setFormData({ ...formData, images: newImagesList });
        } catch (error) {
            alert('이미지 업로드에 실패했습니다.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    if (isFetching) return <div className="flex justify-center py-20 text-sky-500">읽어오는 중...</div>;

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 pb-[var(--page-safe-bottom)] pt-6">
            <div className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl" />
            <div className="pointer-events-none absolute top-32 -left-16 h-40 w-40 rounded-full bg-amber-200/30 blur-3xl" />

            <div className="relative flex items-center gap-2">
                <button onClick={() => navigate({ to: '/trades/$tradeId', params: { tradeId } })} className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-600 shadow-sm ring-1 ring-white/70">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">게시글 수정</h1>
                    <p className="text-sm text-slate-500">판매 상태와 정보를 최신으로 유지하세요.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="relative mt-6 flex flex-col gap-6 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.12)] backdrop-blur">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">사진</label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <label className="flex h-20 w-20 flex-shrink-0 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                        </label>
                        {formData.images?.map((img, idx) => (
                            <div key={idx} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                                <img
                                    src={`${newImages.has(img) ? TEMP_IMAGE_BASE_URL : TRADE_IMAGE_BASE_URL}${img}`}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                                <button type="button" onClick={() => setFormData({ ...formData, images: formData.images?.filter((_, i) => i !== idx) })} className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">제목</label>
                    <input type="text" className="h-12 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-200/70" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">거래 방식</label>
                        <select className="h-12 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-200/70" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}>
                            <option value="sale">판매하기</option>
                            <option value="exchange">교환하기</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">상태</label>
                        <select className="h-12 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-200/70" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}>
                            <option value="active">거래진행중</option>
                            <option value="completed">거래완료</option>
                            <option value="cancelled">취소됨</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">가격</label>
                    <input type="number" className="h-12 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-200/70" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">설명</label>
                    <textarea className="h-40 resize-none rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-200/70" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>

                <button type="submit" className="liquid-button mt-2 flex h-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-lg shadow-sky-500/30 transition-all active:scale-[0.98]" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" /> : '수정 완료'}
                </button>
            </form>
        </div>
    );
}
