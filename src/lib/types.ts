export type EventsProps = {
    id: string;
    title: string;
    description: string;
    poster_url: string[];
    date: Date;
    campus: string;
    location: string;
    organizer: string;
    fee: string | null;
    registration_link: string | null;
    categories: string[];
    has_starpoints: boolean;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
    contacts: {
        name: string;
        phone: string;
    }[];
}