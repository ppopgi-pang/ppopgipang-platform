import { useEffect, useState } from "react";

export default function DevelopmentModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 프로덕션 환경에서만 모달 표시
    if (import.meta.env.PROD) {
      setIsOpen(true);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-sky-100">
            <svg
              className="h-12 w-12 text-sky-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-900">
            서비스 개발 중
          </h2>
          <p className="text-slate-600">
            현재 뽑기팡 서비스는 개발 중입니다.
            <br />
            빠른 시일 내에 찾아뵙겠습니다!
          </p>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-700">
              <span className="font-semibold">📧 문의:</span>{" "}
              contact@ppopgi.me
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full rounded-lg bg-sky-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-sky-700 active:scale-95"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
