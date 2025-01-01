import Events from "@/components/homepage/Events";
import FeaturedEvent from "@/components/homepage/FeaturedEvent";
import Hero from "@/components/homepage/Hero";
import Skeleton from "@/components/homepage/Skeleton";
import { Suspense } from "react";

function Home() {
	return (
		<>
			<Hero />
			<FeaturedEvent />
			<Suspense fallback={<Skeleton />}>
				<Events />
			</Suspense>
		</>
	);
}

export default Home;
