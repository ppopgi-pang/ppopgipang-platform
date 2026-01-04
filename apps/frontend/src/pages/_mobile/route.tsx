import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/_mobile")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname === "/admin" || location.pathname.startsWith("/admin/");

  if (isAdminRoute) {
    return (
      <div className="admin-root admin-shell">
        <div className="admin-frame">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen w-full bg-white">
      {/* 모바일 우선 컨테이너 */}
      <div className="relative flex flex-col h-screen w-full max-w-lg">
        <Outlet />
      </div>
    </div>
  );
}
