import BottomNavigationBar from "@/components/ui/bottom-navigation-bar/bottom-navigation-bar";
import Header from "@/shared/ui/header/header.ui";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col h-screen w-full lg:items-center">
      <Header />
      <main className="w-full flex-1">
        <Outlet />
      </main>
      <BottomNavigationBar />
    </div>
  );
}
