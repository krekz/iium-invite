import SkeletonLeft from '@/components/event-detail/SkeletonLeft'
import SkeletonRight from '@/components/event-detail/SkeletonRight'
import React from 'react'

function Loading() {
    return (
        <div className="max-w-screen-xl mx-auto px-4 text-white/85">
            <div className="h-10 bg-white/20 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-[10%]"></div>
            <div className="flex flex-col lg:flex-row gap-5 py-5">
                {/* LEFT SIDE */}
                <SkeletonLeft />
                {/* RIGHT SIDE */}
                <SkeletonRight />
            </div>
        </div>
    )
}

export default Loading