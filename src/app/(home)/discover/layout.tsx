import BreadCrumb from "@/components/discover/BreadCrumb";
import Filter from "@/components/discover/Filter";
import type React from "react";

function DiscoverLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-dvh w-full px-4 md:px-6 lg:px-8 py-3">
			<div className="flex flex-col lg:flex-row lg:gap-4">
				<aside className="w-full md:w-64 md:sticky md:top-36 md:h-fit">
					<Filter />
				</aside>
				<div className="flex-1">
					<BreadCrumb />
					{children}
				</div>
			</div>
		</div>
	);
}

export default DiscoverLayout;
