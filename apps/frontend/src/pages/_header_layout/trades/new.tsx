import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { createTrade } from '@/shared/api/trades';
import { uploadFile } from '@/shared/api/stores';
import type { TradeInput } from '@ppopgipang/types';
import { TEMP_IMAGE_BASE_URL } from '@/shared/lib/api-config';

export const Route = createFileRoute('/_header_layout/trades/new')({
    component: TradeNewPage,
});

function TradeNewPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<TradeInput.CreateTradeDto>({
        title: '',
        description: '',
        price: 0,
        type: 'sale',
        images: [],
    });
    const [uploading, setUploading] = useState(false);

    const createMutation = useMutation({
        mutationFn: (dto: TradeInput.CreateTradeDto) => createTrade(dto),
        onSuccess: (id) => {
            queryClient.invalidateQueries({ queryKey: ['trades'] });
            navigate({ to: '/trades/$tradeId', params: { tradeId: id.toString() } });
        },
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
		try {
			const newImages: string[] = [...(formData.images || [])];
			for (let i = 0; i < files.length; i++) {
				const { fileName } = await uploadFile(files[i]);
				// Backend returns just the filename, frontend needs to prefix with preview URL
				newImages.push(fileName);
			}
			setFormData({ ...formData, images: newImages });
		} catch {
			alert('이미지 업로드에 실패했습니다.');
		} finally {
			setUploading(false);
		}
	};

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.description) {
            alert('제목과 설명을 입력해주세요.');
            return;
        }
        createMutation.mutate(formData);
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 pb-[var(--page-safe-bottom)] pt-6">
            <div className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl" />
            <div className="pointer-events-none absolute top-32 -left-16 h-40 w-40 rounded-full bg-amber-200/30 blur-3xl" />

            <div className="relative flex items-center gap-2">
                <button onClick={() => navigate({ to: '/trades' })} className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-600 shadow-sm ring-1 ring-white/70">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">게시글 등록</h1>
                    <p className="text-sm text-slate-500">판매하거나 교환할 물건을 소개해요.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="relative mt-6 flex flex-col gap-6 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.12)] backdrop-blur">
                {/* Image Upload */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">사진 (최대 10장)</label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <label className="flex h-20 w-20 flex-shrink-0 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 transition-colors hover:border-sky-300 hover:text-sky-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-[10px] mt-1">{formData.images?.length}/10</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                        </label>
                        {formData.images?.map((img, idx) => (
                            <div key={idx} className="group relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                                <img src={`${TEMP_IMAGE_BASE_URL}${img}`} alt={`upload-${idx}`} className="h-full w-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, images: formData.images?.filter((_, i) => i !== idx) })}
                                    className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-100 transition-opacity lg:opacity-0 group-hover:opacity-100"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Title */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">제목</label>
                    <input
                        type="text"
                        placeholder="제목을 입력해주세요"
                        className="h-12 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-200/70"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                {/* Type & Price */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">거래 방식</label>
                        <select
                            className="h-12 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-200/70"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'sale' | 'exchange' })}
                        >
                            <option value="sale">판매하기</option>
                            <option value="exchange">교환하기</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">가격 (원)</label>
                        <input
                            type="number"
                            placeholder="0"
                            className="h-12 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-200/70"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">상품 설명</label>
                    <textarea
                        placeholder="상품에 대해 자세히 설명해주세요"
                        className="h-40 resize-none rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-200/70"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    className={`liquid-button mt-2 flex h-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-lg shadow-sky-500/30 transition-all active:scale-[0.98] ${createMutation.isPending ? 'cursor-not-allowed opacity-70' : ''
                        }`}
                    disabled={createMutation.isPending}
                >
                    {createMutation.isPending ? (
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                        '등록하기'
                    )}
                </button>
            </form>
        </div>
    );
}
