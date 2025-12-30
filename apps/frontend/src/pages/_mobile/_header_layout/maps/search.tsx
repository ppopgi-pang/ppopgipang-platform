import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_mobile/_header_layout/maps/search")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="relative w-full h-full"></div>;
}
