
import Hero from "@/components/homepage/Hero";
import FeaturedEvent from "@/components/homepage/FeaturedEvent";
import Events from "@/components/homepage/Events";
import { Suspense } from "react";
import Skeleton from "@/components/homepage/Skeleton";

function Home() {
	return (
		<main className="max-w-7xl mx-auto py-10 px-3">
			<Hero />
			<FeaturedEvent />
			<Suspense fallback={<Skeleton />}>
				<Events />
			</Suspense>
		</main>
	);
}

export default Home;
