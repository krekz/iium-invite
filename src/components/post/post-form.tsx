"use client"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { postSchema } from "@/lib/validations/post"


import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"


function PostForm() {

    const form = useForm<z.infer<typeof postSchema>>({
        resolver: zodResolver(postSchema),
        //defaultValues: { title: "", description: "", date: "", time: "", location: "" },
        defaultValues: {
            title: "",
            description: "",
            poster_url: "",
            location: "",
            organizer: "",
            fee: "0",
            registration_link: "",
            // categories: [],
            has_starpoints: "false",
        }
    })

    function onSubmit(values: z.infer<typeof postSchema>) {
        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-5">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="iHax IIUM" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* TODO: poster upload */}
                <FormField
                    control={form.control}
                    name="poster_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Poster/Thumbnail</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* TODO: start/end date */}
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input placeholder="KICT Hall" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="organizer"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Organizer</FormLabel>
                            <FormControl>
                                <Input placeholder="PKPIM/PSSCM/etc.." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="fee"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fee (RM)</FormLabel>
                            <FormDescription>
                                Leave it empty if it's free.
                            </FormDescription>
                            <FormControl>
                                <Input type="number"  {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="registration_link"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Registration Link</FormLabel>
                            <FormControl>
                                <Input {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Sports" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}
                <FormField
                    control={form.control}
                    name="has_starpoints"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Starpoints</FormLabel>
                            <FormControl>
                                <Input placeholder="true" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="bg-blue-600" type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default PostForm
