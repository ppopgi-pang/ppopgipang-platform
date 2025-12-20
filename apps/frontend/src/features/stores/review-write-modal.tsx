import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview, uploadFile } from "../../shared/api/stores";

interface ReviewWriteModalProps {
    storeId: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function ReviewWriteModal({ storeId, isOpen, onClose }: ReviewWriteModalProps) {
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const queryClient = useQueryClient();

    const uploadMutation = useMutation({
        mutationFn: uploadFile,
    });

    const createReviewMutation = useMutation({
        mutationFn: createReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['store', storeId] });
            onClose();
            // Reset form
            setRating(5);
            setContent("");
            setImageFile(null);
            setPreviewUrl(null);
            alert("리뷰가 등록되었습니다.");
        },
        onError: (error) => {
            console.error(error);
            alert("리뷰 등록에 실패했습니다.");
        }
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async () => {
        if (!content.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }

        try {
            let uploadedFileName = null;
            if (imageFile) {
                const result = await uploadMutation.mutateAsync(imageFile);
                uploadedFileName = result.fileName;
            }

            await createReviewMutation.mutateAsync({
                storeId,
                rating,
                content,
                images: uploadedFileName ? [uploadedFileName] : [],
                boardId: 1, // Defaulting to 1 as per user request example
            });
        } catch (error) {
            console.error("Submit error", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scale-up">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">리뷰 작성</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Rating */}
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className={`text-3xl transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-slate-200'
                                    }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    <div className="text-center text-sm text-slate-500 font-medium mb-2">
                        {rating}점, 만족하셨나요?
                    </div>

                    {/* Image Upload */}
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        {previewUrl ? (
                            <div className="relative w-full h-48 bg-slate-100 rounded-xl overflow-hidden group">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => {
                                        setImageFile(null);
                                        setPreviewUrl(null);
                                    }}
                                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-sky-500 hover:text-sky-500 transition-colors bg-slate-50"
                            >
                                <span className="text-2xl mb-1">📷</span>
                                <span className="text-sm">사진 추가하기</span>
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="가게에 대한 솔직한 리뷰를 남겨주세요."
                        className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                    />

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={createReviewMutation.isPending || uploadMutation.isPending}
                        className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {createReviewMutation.isPending || uploadMutation.isPending ? '등록 중...' : '리뷰 등록하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}
