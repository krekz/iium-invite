import * as z from "zod"

export const postSchema = z.object({
    title: z.string().min(3).max(20),
    description: z.string().min(3),
    poster_url: z.string().url(),
    // start date
    // end date
    location: z.string().min(3),
    organizer: z.string().min(3), // eg. Perkim/PKPIM/KICT/ENGENIUS etc
    fee: z.string().regex(/^\d+(\.\d{1,2})?$/),
    registration_link: z.string().url(),
    // categories: z.array(z.string()).nonempty(),
    has_starpoints: z.string(),
})