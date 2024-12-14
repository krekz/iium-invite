import { GraduationCap } from "lucide-react";
import SearchInput from "../SearchInput";
export default () => {
	return (
		<>
			<div className="flex flex-col items-center text-center mb-16">
				<GraduationCap className="h-16 w-16 text-primary mb-6" />
				<h1 className="text-4xl md:text-6xl font-bold mb-4">
					Campus Events Hub
				</h1>
				<p className="text-sm lg:text-xl text-muted-foreground max-w-2xl mb-8">
					Discover and participate in exciting university events. From academic symposiums to cultural festivals,
					find everything happening on campus in one place.
				</p>
				<SearchInput page="Home"/>
			</div>
		</>

	);
};
