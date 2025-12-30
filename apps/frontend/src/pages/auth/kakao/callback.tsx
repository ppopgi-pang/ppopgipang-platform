// import {
//   createFileRoute,
//   useNavigate,
//   useSearch,
// } from "@tanstack/react-router";
// import { useEffect } from "react";
// import { z } from "zod";

// const kakaoCallbackSearchSchema = z.object({
//   accessToken: z.string(),
//   refreshToken: z.string(),
// });

// const KakaoCallbackPage = () => {
//   const navigate = useNavigate();
//   const search = useSearch({ from: Route.id });

//   useEffect(() => {
//     const { accessToken, refreshToken } = search;

//     if (accessToken && refreshToken) {
//       //   tokenManager.setTokens(accessToken, refreshToken);
//       navigate({ to: "/" });
//     } else {
//       // Handle error or missing tokens
//       console.error("Missing tokens in callback URL");
//       navigate({ to: "/login" });
//     }
//   }, [search, navigate]);

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <p>Processing login...</p>
//     </div>
//   );
// };

// export const Route = createFileRoute("/auth/kakao/callback")({
//   validateSearch: (search) => kakaoCallbackSearchSchema.parse(search),
//   component: KakaoCallbackPage,
// });
