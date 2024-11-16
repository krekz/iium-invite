import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { GraduationCap } from "lucide-react";
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
				<div className="w-full max-w-2xl space-y-4">
					<div className="relative">
						<Input
							placeholder="Search events..."
							className="pl-10 h-12 text-lg"
						/>
						<svg
							className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
					<div className="flex flex-wrap justify-center gap-2">
						<Button variant="outline" size="sm" className="rounded-full">
							Theatre & Arts
						</Button>
						<Button variant="outline" size="sm" className="rounded-full">
							Mental Health
						</Button>
						<Button variant="outline" size="sm" className="rounded-full">
							Career Fair
						</Button>
						<Button variant="outline" size="sm" className="rounded-full">
							Sports
						</Button>
						<Button variant="outline" size="sm" className="rounded-full">
							Workshops
						</Button>
					</div>
				</div>
			</div>
		</>

	);
};
