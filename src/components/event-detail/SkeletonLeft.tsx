function SkeletonLeft() {
    return (
        <div className="flex flex-col w-full lg:w-full break-words animate-pulse">
            <div className='overflow-hidden aspect-[9/9] relative bg-white/20 rounded-md'></div>
            <div className="py-5 md:py-10 space-y-4">
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="h-4 bg-white/20 rounded"></div>
                <div className="h-4 bg-white/20 rounded"></div>
                <div className="h-4 bg-white/20 rounded w-5/6"></div>
            </div>
        </div>
    )
}

export default SkeletonLeft