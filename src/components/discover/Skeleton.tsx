function Skeleton() {
	return (
		<div className="w-full">
			<div className="gap-y-2 gap-x-1 pb-5 mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
				{[...Array(8)].map((_, i) => (
					<div key={i} className="flex flex-col p-1 gap-1 w-full rounded-lg">
						<div className="w-full relative rounded-md overflow-hidden aspect-square bg-card-foreground/20 animate-pulse" />
						<div className="space-y-2">
							<div className="h-4 bg-card-foreground/20 rounded animate-pulse" />
							<div className="h-3 bg-card-foreground/20 rounded animate-pulse w-3/4" />
							<div className="flex justify-between">
								<div className="h-3 bg-card-foreground/20 rounded animate-pulse w-1/3" />
								<div className="h-3 bg-card-foreground/20 rounded animate-pulse w-1/4" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default Skeleton;
