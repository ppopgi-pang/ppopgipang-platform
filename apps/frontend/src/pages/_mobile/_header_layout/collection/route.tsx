import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_mobile/_header_layout/collection")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_mobile/_header_layout/collection"!</div>;
}
