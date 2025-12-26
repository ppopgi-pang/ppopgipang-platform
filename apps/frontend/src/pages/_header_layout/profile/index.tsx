import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/shared/api/users";
import { useAuth, notifyAuthChange } from "@/shared/lib/use-auth";
import { logout } from "@/shared/api/auth";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();

  const { data, isLoading: isProfileLoading, isError, refetch } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
    enabled: isLoggedIn,
  });

  const isLoading = isAuthLoading || isProfileLoading;

  const handleLogout = async () => {
    await logout();
    notifyAuthChange(null);
    navigate({ to: "/" });
  };

  const handleLogin = () => {
    navigate({ to: "/login" });
  };

  const profileInitial = data?.nickname?.trim()?.[0] ?? "?";

  return (
    <div className="relative w-full min-h-screen px-5 pt-8 pb-[var(--page-safe-bottom)] bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="pointer-events-none absolute -top-16 right-0 h-44 w-44 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-24 -left-16 h-40 w-40 rounded-full bg-amber-200/30 blur-3xl" />

      <div className="relative">
        <h1 className="text-2xl font-bold text-slate-900">내 프로필</h1>
        <p className="mt-1 text-sm text-slate-500">
          계정 정보를 확인하고 설정을 관리하세요.
        </p>

        {!isLoggedIn && (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
            <div className="text-xs font-semibold text-slate-400">로그인 필요</div>
            <h2 className="mt-2 text-lg font-bold text-slate-900">로그인하면 더 많은 기능을 사용할 수 있어요.</h2>
            <p className="mt-2 text-sm text-slate-500">
              리뷰 작성, 즐겨찾기, 프로필 관리가 모두 가능해집니다.
            </p>
            <button
              onClick={handleLogin}
              className="mt-5 w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              로그인하기
            </button>
          </div>
        )}

        {isLoggedIn && (
          <div className="mt-6 space-y-4">
            {isLoading && (
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-20 rounded-full bg-slate-200" />
                    <div className="h-5 w-36 rounded-full bg-slate-200" />
                    <div className="h-3 w-40 rounded-full bg-slate-200" />
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="h-16 rounded-2xl bg-slate-100" />
                  <div className="h-16 rounded-2xl bg-slate-100" />
                </div>
              </div>
            )}

            {isError && !isLoading && (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-700 shadow-sm">
                <h2 className="text-base font-semibold">프로필 정보를 불러오지 못했어요.</h2>
                <p className="mt-2 text-sm text-rose-600">잠시 후 다시 시도해주세요.</p>
                <button
                  onClick={() => refetch()}
                  className="mt-4 w-full rounded-full bg-rose-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-500"
                >
                  다시 불러오기
                </button>
              </div>
            )}

            {!isLoading && !isError && data && (
              <>
                <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {data.profileImage ? (
                        <img
                          src={data.profileImage}
                          alt={`${data.nickname} 프로필 이미지`}
                          className="h-16 w-16 rounded-full object-cover ring-2 ring-white"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-xl font-semibold text-white">
                          {profileInitial}
                        </div>
                      )}
                      <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-400">환영합니다</div>
                      <div className="text-xl font-bold text-slate-900">{data.nickname}</div>
                      <div className="text-sm text-slate-500">{data.email}</div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                      <div className="text-xs text-slate-400">회원 ID</div>
                      <div className="mt-1 text-sm font-semibold text-slate-900">#{data.id}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                      <div className="text-xs text-slate-400">로그인 방식</div>
                      <div className="mt-1 text-sm font-semibold text-slate-900">카카오 로그인</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
                  <div className="text-sm font-semibold text-slate-900">계정 관리</div>
                  <p className="mt-2 text-sm text-slate-500">
                    개인정보 보호를 위해 로그아웃 후에는 자동으로 세션이 종료됩니다.
                  </p>
                  <button
                    onClick={handleLogout}
                    className="mt-4 w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    로그아웃
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_header_layout/profile/")({
  component: ProfilePage,
});
