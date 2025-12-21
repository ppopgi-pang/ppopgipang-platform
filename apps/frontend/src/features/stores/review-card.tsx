import type { Review } from "../../shared/api/stores";

interface ReviewCardProps {
    review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
    const { user, rating, content, images, createdAt } = review;

    // Format date (simple version)
    const date = new Date(createdAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/40 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
                {/* User Avatar */}
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                    {user.profileImage ? (
                        <img
                            src={user.profileImage}
                            alt={user.username}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            IMG
                        </div>
                    )}
                </div>

                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800">{user.username}</span>
                    <div className="flex items-center gap-2">
                        <div className="flex text-yellow-500 text-xs">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i}>{i < rating ? '★' : '☆'}</span>
                            ))}
                        </div>
                        <span className="text-xs text-slate-400">{date}</span>
                    </div>
                </div>
            </div>

            <p className="text-sm text-slate-600 mb-3 whitespace-pre-wrap leading-relaxed">
                {content}
            </p>

            {images && images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img: string, idx: number) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`Review ${idx + 1}`}
                            className="w-24 h-24 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
