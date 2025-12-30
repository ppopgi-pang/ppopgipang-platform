import BottomNavigationBar from "@/components/common/bottom-navigation-bar/bottom-navigation-bar";
import Header from "@/shared/ui/header/header.ui";
import { createFileRoute, Outlet } from "@tanstack/react-router";

function HeaderLayout() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full overflow-y-auto">
        <Outlet />
      </main>
      <BottomNavigationBar />
    </>
  );
}
export const Route = createFileRoute("/_mobile/_header_layout")({
  component: HeaderLayout,
});
