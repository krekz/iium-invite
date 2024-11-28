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
    contacts: { name: string, phone: string }[];
    bookmarks: { userId: string }[];
}