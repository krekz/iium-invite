
"use client"
import { cn } from "@/lib/utils";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import Link from "next/link";
import { Building2 } from "lucide-react";
import React from "react";

export default () => {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Discover</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 gap-y-0 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-4">
                                <NavigationMenuLink asChild>
                                    <Link
                                        className="hover:opacity-80 from-muted/50 to-muted flex size-full select-none flex-col justify-center rounded-md bg-gradient-to-b p-3 no-underline outline-none focus:shadow-md"
                                        href="/discover"
                                    >
                                        <Building2 className="self-center size-32 text-muted-foreground " />
                                        <div className="mb-2 mt-4 text-md font-medium">Explore All Events</div>
                                        <p className="text-muted-foreground text-sm leading-tight">
                                            Find events happening in all IIUM campuses.
                                        </p>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/discover/gombak" title="Gombak">
                                Main campus of IIUM
                            </ListItem>
                            <ListItem href="/discover/kuantan" title="Kuantan">
                                Health and Science campus.
                            </ListItem>
                            <ListItem href="/discover/pagoh" title="Pagoh">
                                Language and management campus.
                            </ListItem>
                            <ListItem href="/discover/gambang" title="Gambang">
                                CFS campus for foundation studies.
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>


            </NavigationMenuList>
        </NavigationMenu>
    );
};

const ListItem = React.forwardRef<
    React.ElementRef<'a'>,
    React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
    return (
        <li className="">
            <NavigationMenuLink asChild>
                <Link
                    className={cn(
                        'h-full w-full hover:bg-accent hover:text-accent-foreground focus:bg-accent p-2 focus:text-accent-foreground block select-none space-y-1 rounded-md leading-none no-underline outline-none transition-colors',
                        className,
                    )}
                    href={props.href!}
                    ref={ref}

                    {...props}
                >
                    <div className="text-md font-medium leading-none">{title}</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = 'ListItem'