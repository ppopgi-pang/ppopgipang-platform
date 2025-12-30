import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { notifyAuthChange } from "@/shared/lib/use-auth";
import { useAuthStore } from "@/stores/auth/auth-store";
import LoadingSpinner from "@/components/common/loading-spinner";

const kakaoCallbackSearchSchema = z.object({}).partial();

const KakaoCallbackPage = () => {
  const navigate = useNavigate();
  const { fetchUser, user } = useAuthStore();

  useEffect(() => {
    const processLogin = async () => {
      try {
        await fetchUser();

        const returnUrl = sessionStorage.getItem("auth_return_url");

        if (returnUrl) {
          sessionStorage.removeItem("auth_return_url");

          if (returnUrl.startsWith("/admin") || returnUrl.includes("/admin/")) {
            if (!user) return;
            // if (!user.) {
            //   alert("접근 권한이 없습니다.");
            //   navigate({ to: "/" });
            //   return;
            // }
          }

          navigate({ to: returnUrl });
        } else {
          navigate({ to: "/" });
        }
      } catch (error) {
        console.error("Login processing failed:", error);
        notifyAuthChange(null);
        navigate({ to: "/" });
      }
    };

    processLogin();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-full w-full">
      <LoadingSpinner />
    </div>
  );
};

export const Route = createFileRoute("/_mobile/auth/kakao/callback/")({
  validateSearch: (search) => kakaoCallbackSearchSchema.parse(search),
  component: KakaoCallbackPage,
});
