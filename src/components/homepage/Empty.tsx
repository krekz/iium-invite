function EmptyState() {
    return (
        <div className="w-full flex flex-col items-center justify-center h-full text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl font-semibold">No events found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
        </div>
    );
}

export default EmptyState;