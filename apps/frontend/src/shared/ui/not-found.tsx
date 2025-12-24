import { Link } from "@tanstack/react-router";
import "@/app/styles/globals.css";

export const NotFoundPage = () => {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="glass-panel-strong relative flex w-full max-w-md flex-col items-center overflow-hidden rounded-3xl p-10 text-center animate-pop">
                {/* Background Decoration */}
                <div className="absolute top-[-50px] right-[-50px] h-40 w-40 rounded-full bg-sky-300/30 blur-3xl" />
                <div className="absolute bottom-[-50px] left-[-50px] h-40 w-40 rounded-full bg-yellow-300/20 blur-3xl" />

                <div className="animate-float z-10 mb-6">
                    <h1 className="text-9xl font-bold text-sky-500 drop-shadow-sm">404</h1>
                </div>

                <div className="animate-fade-up z-10">
                    <h2 className="mb-3 text-2xl font-bold text-[var(--color-text-primary)]">
                        Oops! Page Not Found
                    </h2>
                    <p className="mb-8 text-[var(--color-text-secondary)]">
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>

                    <Link to="/" className="liquid-button inline-flex items-center justify-center px-8 py-3 text-white font-medium hover:no-underline">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};
