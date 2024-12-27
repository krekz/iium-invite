"use client"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

function BreadCrumb() {
    const { campus } = useParams()
    return (
        <Breadcrumb className="py-2">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/discover">Discover</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1">
                            {typeof campus === 'string'
                                ? campus.charAt(0).toUpperCase() + campus.slice(1)
                                : 'All Campuses'}
                            <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                                <Link href="/discover">All Campuses</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/discover/gombak">Gombak</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/discover/kuantan">Kuantan</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/discover/pagoh">Pagoh</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/discover/gambang">Gambang</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadCrumb