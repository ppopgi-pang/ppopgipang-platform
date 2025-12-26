import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { getMyProfile } from "@/shared/api/users";
import { notifyAuthChange } from "@/shared/lib/use-auth";


const kakaoCallbackSearchSchema = z.object({
    // accessToken, refreshToken은 이제 쿠키로 전달되므로 URL query string에 없음.
    // 필요하다면 code나 state 같은 다른 파라미터를 받을 수 있지만 현재는 비워둠.
}).partial(); // 유연하게 처리


const KakaoCallbackPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const processLogin = async () => {
            try {
                // 1. Get user profile to verify session and get info
                const user = await getMyProfile();

                // 2. Update global auth state
                notifyAuthChange(user);

                // 3. Check for return URL
                const returnUrl = sessionStorage.getItem("auth_return_url");

                if (returnUrl) {
                    sessionStorage.removeItem("auth_return_url");

                    // 4. Admin access verify
                    if (returnUrl.startsWith("/admin") || returnUrl.includes("/admin/")) {
                        if (!user.isAdmin) {
                            alert("접근 권한이 없습니다.");
                            navigate({ to: "/" });
                            return;
                        }
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
        <div className="flex items-center justify-center min-h-screen">
            <p>Processing login...</p>
        </div>
    );
};

export const Route = createFileRoute("/auth/kakao/callback/")({
    validateSearch: (search) => kakaoCallbackSearchSchema.parse(search),
    component: KakaoCallbackPage,
});
