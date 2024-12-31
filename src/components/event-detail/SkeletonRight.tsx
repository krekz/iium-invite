import type React from "react";

const SkeletonRight: React.FC = () => {
	return (
		<div className="w-full lg:w-[40%] lg:sticky lg:top-10 lg:self-start">
			<div className="flex flex-col gap-2 w-full">
				{/* Edit form skeleton */}
				<div className="h-10 bg-white/20 rounded animate-pulse" />

				{/* Recruitment and Starpoints placeholders */}
				<div className="h-6 w-1/2 bg-white/20 rounded animate-pulse" />
				<div className="h-6 w-2/3 bg-white/20 rounded animate-pulse" />

				{/* Event details skeleton */}
				{[...Array(4)].map((_, index) => (
					<div key={index} className="flex flex-col gap-1">
						<div className="h-4 w-1/4 bg-white/20 rounded animate-pulse" />
						<div className="h-6 w-3/4 bg-white/20 rounded animate-pulse" />
					</div>
				))}

				{/* Tags skeleton */}
				<div className="flex flex-col gap-1 mt-2">
					<div className="h-4 w-1/6 bg-white/20 rounded animate-pulse" />
					<div className="flex flex-wrap gap-1">
						{[...Array(3)].map((_, index) => (
							<div
								key={index}
								className="h-6 w-20 bg-white/20 rounded-full animate-pulse"
							/>
						))}
					</div>
				</div>

				{/* Buttons skeleton */}
				<div className="space-y-1 mt-4">
					{[...Array(3)].map((_, index) => (
						<div
							key={index}
							className="h-10 bg-white/20 rounded animate-pulse"
						/>
					))}
				</div>

				{/* Delete button skeleton */}
				<div className="flex w-full mt-2">
					<div className="h-10 w-1/3 bg-white/20 rounded animate-pulse" />
				</div>
			</div>
		</div>
	);
};

export default SkeletonRight;
