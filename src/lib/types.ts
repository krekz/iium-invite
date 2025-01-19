export type PostPageProps = {
	id: string;
	title: string;
	description: string;
	poster_url: string[];
	campus: string;
	organizer: string;
	date: Date;
	location: string;
	createdAt: Date;
	registration_link: string | null;
	fee: string | null;
	has_starpoints: boolean;
	categories: string[];
	contacts: { name: string; phone: string }[];
	isRecruiting: boolean;
};
