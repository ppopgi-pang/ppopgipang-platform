import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_mobile/_header_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>홈화면</div>;
}
