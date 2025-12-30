import type { ReactNode } from "react";
import HomeIcon from "@/assets/icons/bottom-nav/ic-home.svg?react";
import MapIcon from "@/assets/icons/bottom-nav/ic-map.svg?react";
// import ChatIcon from "@/assets/icons/bottom-nav/ic-chat.svg?react";
import ProfileIcon from "@/assets/icons/bottom-nav/ic-profile.svg?react";
import { Link } from "@tanstack/react-router";
import { CollectionIcon } from "./icons/collection-icon";

type NavItem = {
  to: string;
  text: string;
  icon: (props: { active?: boolean }) => ReactNode;
};

const BOTTOM_NAV_LIST: NavItem[] = [
  { to: "/", text: "홈", icon: () => <HomeIcon /> },
  { to: "/maps", text: "지도", icon: () => <MapIcon /> },
  // { to: "/chats", text: "채팅", icon: () => <ChatIcon /> },
  { to: "/my", text: "프로필", icon: () => <ProfileIcon /> },
  { to: "/collection", text: "수집", icon: ({ active }) => <CollectionIcon active={active} /> },
];

export default function BottomNavigationBar() {
  return (
    <nav className="h-20 shrink-0 z-50 px-10 pt-5 pb-8 w-full border-t rounded-t-2xl border-gray-200 bg-white shadow-[0_0_12px_rgba(18,18,18,0.1)]">
      <div className="flex h-full justify-around items-center">
        {BOTTOM_NAV_LIST.map((nav) => {
          return (
            <Link
              key={nav.to}
              to={nav.to}
              className="text-sm font-medium leading-normal flex flex-col items-center text-gray-500"
              activeProps={{
                style: {
                  color: "#38BDF8",
                },
              }}
            >
              {({ isActive }) => (
                <>
                  {nav.icon({ active: isActive })}
                  <span>{nav.text}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
