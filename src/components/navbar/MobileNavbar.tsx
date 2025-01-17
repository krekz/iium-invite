"use client";

import { logoutIIUM } from "@/actions/authentication/logout";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
	Bookmark,
	Home,
	LogIn,
	LogOut,
	MoreHorizontal,
	Plus,
	Search,
	User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "../ui/sheet";

const MobileNavbar = ({
	session,
}: { session: { user: string | undefined | null } }) => {
	const router = useRouter();
	const pathname = usePathname();
	const isMobile = useIsMobile();
	const searchParams = useSearchParams();

	const MobileNavLinks = ({
		isActive,
		href,
		icon: Icon,
		label,
	}: {
		isActive: boolean;
		href: string;
		icon: React.ElementType;
		label: string;
	}) => (
		<Link
			href={href}
			className={cn("flex flex-col items-center gap-0.5", {
				"text-amber-600": isActive,
			})}
		>
			<Icon className="h-5 w-5" />
			<span className="text-[10px]">{label}</span>
		</Link>
	);

	const commonNavLinks = (
		<>
			<MobileNavLinks
				href="/"
				icon={Home}
				label="Home"
				isActive={pathname === "/"}
			/>
			<MobileNavLinks
				href="/discover"
				icon={Search}
				label="Discover"
				isActive={pathname === "/discover"}
			/>
			<MobileNavLinks
				href="/login"
				icon={LogIn}
				label="Login"
				isActive={pathname === "/login"}
			/>
		</>
	);

	if (!session.user && isMobile) {
		return (
			<div className="fixed bottom-0 z-50 left-0 right-0 bg-background border-t">
				<div className="flex justify-around items-center h-14 px-4">
					{commonNavLinks}
				</div>
			</div>
		);
	}

	return (
		isMobile && (
			<div className="fixed bottom-0 z-50 left-0 right-0 bg-background border-t">
				<div className="flex justify-around items-center h-14 px-4">
					{commonNavLinks}
					<Sheet>
						<SheetTrigger asChild>
							<button
								type="button"
								className={cn("flex flex-col items-center gap-0.5", {
									"text-amber-600": pathname === "/account",
								})}
							>
								<MoreHorizontal className="h-5 w-5" />
								<span className="text-[10px]">More</span>
							</button>
						</SheetTrigger>
						<SheetContent side="bottom" className="h-[50vh] p-2">
							<SheetHeader>
								<SheetTitle>Menu</SheetTitle>
								<SheetDescription>
									Access additional options and settings
								</SheetDescription>
							</SheetHeader>
							<div className="flex flex-col gap-4 mt-4">
								{[
									{
										href: "/account",
										icon: User,
										label: "Account Settings",
										isActive:
											pathname === "/account" && !searchParams.get("option"),
									},
									{
										href: "/account?option=posts",
										icon: Plus,
										label: "My Posts",
										isActive:
											pathname === "/account" &&
											searchParams.get("option") === "posts",
									},
									{
										href: "/account?option=bookmarks",
										icon: Bookmark,
										label: "Bookmarks",
										isActive:
											pathname === "/account" &&
											searchParams.get("option") === "bookmarks",
									},
								].map(({ href, icon: Icon, label, isActive }) => (
									<SheetClose key={href} asChild>
										<Link
											href={href}
											className={cn(
												"flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-md",
												{
													"text-amber-600": isActive,
												},
											)}
										>
											<Icon size={16} />
											<span>{label}</span>
										</Link>
									</SheetClose>
								))}
								<div className="h-[1px] bg-border my-2" />
								<button
									type="button"
									onClick={async () =>
										await logoutIIUM().then(() => router.push("/"))
									}
									className="flex items-center gap-2 px-4 py-2 hover:bg-destructive hover:text-destructive-foreground rounded-md text-left text-destructive"
								>
									<LogOut size={16} />
									<span>Sign Out</span>
								</button>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		)
	);
};

export default MobileNavbar;
