import SkeletonLeft from "@/components/event-detail/SkeletonLeft";
import SkeletonRight from "@/components/event-detail/SkeletonRight";
import React from "react";

function Loading() {
	return (
		<div className="max-w-screen-xl mx-auto px-4">
			<div className="h-10 bg-card-foreground/20 rounded w-1/2 mb-2" />
			<div className="h-4 bg-card-foreground/20 rounded w-[10%]" />
			<div className="flex flex-col lg:flex-row gap-5 py-5">
				{/* LEFT SIDE */}
				<SkeletonLeft />
				{/* RIGHT SIDE */}
				<SkeletonRight />
			</div>
		</div>
	);
}

export default Loading;
