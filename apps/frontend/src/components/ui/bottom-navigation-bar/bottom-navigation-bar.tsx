import type { ReactNode } from "react";
import HomeIcon from "@/assets/icons/bottom-nav/ic-home.svg?react";
import MapIcon from "@/assets/icons/bottom-nav/ic-map.svg?react";
// import ChatIcon from "@/assets/icons/bottom-nav/ic-chat.svg?react";
import ProfileIcon from "@/assets/icons/bottom-nav/ic-profile.svg?react";
import { Link } from "@tanstack/react-router";

type BottomNavProps = { to: string; text: string; icon: ReactNode };

const BOTTOM_NAV_LIST: BottomNavProps[] = [
  { to: "/", text: "홈", icon: <HomeIcon /> },
  { to: "/maps", text: "탐색", icon: <MapIcon /> },
  // { to: "/chats", text: "채팅", icon: <ChatIcon /> },
  { to: "/my", text: "MY", icon: <ProfileIcon /> },
];

export default function BottomNavigationBar() {
  return (
    <nav className="fixed bottom-0 min-h-[98px] shrink-0 left-0 z-50 px-10 pt-5 pb-8 w-full border-t border-gray-200 rounded-t-lg bg-white pb-safe shadow-[0_0_12px_rgba(18,18,18,0.1)] pb-safe">
      <div className="flex h-full justify-around items-center">
        {BOTTOM_NAV_LIST.map((nav) => {
          return (
            <Link
              to={nav.to}
              className="text-sm font-medium leading-normal flex flex-col items-center text-gray-500"
              activeProps={{
                style: {
                  color: "#38BDF8",
                },
              }}
            >
              {nav.icon}
              <span>{nav.text}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
