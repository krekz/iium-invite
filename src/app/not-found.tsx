import Link from "next/link";

export default function NotFound() {
    return (
        <div className="h-[75dvh] md:h-[80vh] flex flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-lg">Could not find requested resource</p>
            <Link
                href="/discover"
                className="mt-4 px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
                Browse Events
            </Link>
        </div>
    )
}