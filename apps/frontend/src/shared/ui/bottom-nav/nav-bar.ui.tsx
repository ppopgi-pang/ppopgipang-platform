// import { Link, useRouterState } from "@tanstack/react-router";
// import { useEffect, useState, type MouseEvent } from "react";
// import LoginSignupModal from "@/features/auth/login-signup-modal";
// import { onLoginModalOpen } from "@/shared/lib/auth-modal";
// import { useAuth } from "@/shared/lib/use-auth";

// export default function NavBar() {
//   const router = useRouterState();
//   const currentPath = router.location.pathname;
//   const { isLoggedIn } = useAuth();
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     return onLoginModalOpen(() => setIsModalOpen(true));
//   }, []);

//   const navItems = [
//     {
//       label: "지도",
//       path: "/",
//       icon: (isActive: boolean) => (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 24 24"
//           fill={isActive ? "currentColor" : "none"}
//           fillOpacity={isActive ? 0.12 : undefined}
//           stroke="currentColor"
//           strokeWidth={isActive ? 2 : 1.8}
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="w-6 h-6"
//         >
//           <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" />
//           <line x1="9" y1="3" x2="9" y2="18" />
//           <line x1="15" y1="6" x2="15" y2="21" />
//         </svg>
//       ),
//     },
//     {
//       label: "중고거래",
//       path: "/trades",
//       icon: (isActive: boolean) => (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 24 24"
//           fill={isActive ? "currentColor" : "none"}
//           stroke="currentColor"
//           strokeWidth={isActive ? 2 : 1.5}
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="w-6 h-6"
//         >
//           <path d="M16 3l5 5-5 5" />
//           <path d="M21 8H3" />
//           <path d="M8 21l-5-5 5-5" />
//           <path d="M3 16h18" />
//         </svg>
//       ),
//     },
//     {
//       label: "내 리뷰",
//       path: "/my-reviews",
//       icon: (isActive: boolean) => (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 24 24"
//           fill={isActive ? "currentColor" : "none"}
//           stroke="currentColor"
//           strokeWidth={isActive ? 2 : 1.5}
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="w-6 h-6"
//         >
//           <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
//         </svg>
//       ),
//     },
//     {
//       label: "프로필",
//       path: "/profile",
//       icon: (isActive: boolean) => (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 24 24"
//           fill={isActive ? "currentColor" : "none"}
//           stroke="currentColor"
//           strokeWidth={isActive ? 2 : 1.5}
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="w-6 h-6"
//         >
//           <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
//           <circle cx="12" cy="7" r="4" />
//         </svg>
//       ),
//     },
//   ];

//   return (
//     <>
//       <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+12px)] left-1/2 transform -translate-x-1/2 z-50 w-full max-w-[var(--app-max-width)] px-4">
//         <nav
//           className="
//           flex items-center justify-around
//           glass-panel glass-pill
//           h-18 px-2
//           transition-all duration-300
//           animate-fade-up
//         "
//         >
//           {navItems.map((item) => {
//             const isProfileItem = item.path === "/profile";
//             const isActive = isProfileItem
//               ? isLoggedIn &&
//                 (currentPath === item.path || currentPath.startsWith(item.path))
//               : currentPath === item.path ||
//                 (item.path !== "/" && currentPath.startsWith(item.path));
//             const label = isProfileItem
//               ? isLoggedIn
//                 ? "내 프로필"
//                 : "로그인"
//               : item.label;
//             const handleClick = (event: MouseEvent) => {
//               if (isProfileItem && !isLoggedIn) {
//                 event.preventDefault();
//                 setIsModalOpen(true);
//               }
//             };

//             return (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 onClick={handleClick}
//                 className={`
//                 relative flex flex-col items-center justify-center
//                 w-16 h-16 rounded-full
//                 transition-all duration-300
//                 group
//                 ${isActive ? "text-sky-500" : "text-gray-500 hover:text-gray-700"}
//               `}
//               >
//                 {/* Active Indicator Glow */}
//                 {isActive && (
//                   <div className="absolute inset-0 bg-sky-400/30 blur-2xl rounded-full -z-10" />
//                 )}

//                 <div
//                   className={`
//                 transition-transform duration-300
//                 ${isActive ? "scale-110 -translate-y-1" : "group-hover:-translate-y-0.5"}
//               `}
//                 >
//                   {item.icon(isActive)}
//                 </div>

//                 <span
//                   className={`
//                 text-[10px] font-medium mt-1
//                 transition-all duration-300
//                 ${isActive ? "opacity-100 translate-y-0 font-bold" : "opacity-70 group-hover:opacity-100"}
//               `}
//                 >
//                   {label}
//                 </span>

//                 {/* Active Dot */}
//                 {isActive && (
//                   <div className="absolute bottom-1 w-1 h-1 bg-sky-500 rounded-full shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
//                 )}
//               </Link>
//             );
//           })}
//         </nav>
//       </div>
//       <LoginSignupModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       />
//     </>
//   );
// }
