
function Error() {
    return (
        <div className="w-full flex flex-col items-center justify-center h-full text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-20 mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xl font-semibold">Error loading events</p>
            <p className="text-sm">Please try again later</p>
        </div>
    )
}

export default Error