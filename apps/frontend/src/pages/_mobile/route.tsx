import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_mobile")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex justify-center min-h-screen w-full bg-white">
      {/* 모바일 우선 컨테이너 */}
      <div className="relative flex flex-col h-screen w-full max-w-lg">
        <Outlet />
      </div>
    </div>
  );
}
