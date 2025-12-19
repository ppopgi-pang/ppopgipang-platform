import NavBar from '@/shared/ui/bottom-nav/nav-bar.ui';
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_header_layout')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="flex flex-col min-h-screen w-full lg:items-center">
			<div className="flex flex-col w-full min-h-screen desktop:max-w-[1216px] mobile:px-10 tablet:px-15 desktop:px-0">
				<main className="w-full flex-1">
					<Outlet />
				</main>
				<NavBar />
			</div>
		</div>
	);
}
