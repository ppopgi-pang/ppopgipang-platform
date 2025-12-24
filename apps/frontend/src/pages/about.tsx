import { createFileRoute } from "@tanstack/react-router";

function AboutPage() {
	return <div>Hello "/about"!</div>;
}

export const Route = createFileRoute("/about")({
	component: AboutPage,
});
