import { GraduationCap } from "lucide-react";
import SearchInput from "../SearchInput";
export default () => {
	return (
		<div className="px-3 flex flex-col items-center text-center pb-8">
			<GraduationCap className="h-16 w-16 text-primary mb-6" />
			<h1 className="text-4xl md:text-6xl font-bold mb-4">Campus Events Hub</h1>
			<p className="text-sm lg:text-base text-muted-foreground max-w-2xl mb-8">
				Your ultimate platform for discovering and managing university events.
				Stay updated with upcoming programs and connect with campus
				communities—all in one place!
			</p>
			<SearchInput page="Home" />
		</div>
	);
};
