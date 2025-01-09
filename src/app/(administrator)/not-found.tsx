import Link from "next/link";

export default function NotFound() {
	return (
		<div className="min-h-dvh flex flex-col items-center justify-center gap-4">
			<h1 className="text-4xl font-bold">404</h1>
			<p className="text-lg">Could not find requested resource</p>
			<Link
				href="/admin/dashboard"
				className="mt-4 px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-600 transition-colors"
			>
				Back to dashboard
			</Link>
		</div>
	);
}
