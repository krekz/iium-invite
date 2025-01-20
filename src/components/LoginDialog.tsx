"use client";
import { loginIIUM } from "@/actions/authentication/login";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/context/SessionProvider";
import { LoginCredentialsSchema } from "@/lib/validations/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type LoginFormValues = z.infer<typeof LoginCredentialsSchema>;

interface LoginDialogProps {
	children?: React.ReactNode;
	redirectPath?: string;
}

function LoginDialog({
	children,
	redirectPath = "/discover",
}: LoginDialogProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [open, setOpen] = useState(false);
	const { session } = useSession();

	if (session?.user) {
		return children;
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset: resetForm,
	} = useForm<LoginFormValues>({
		resolver: zodResolver(LoginCredentialsSchema),
	});

	const onSubmit = async (data: LoginFormValues) => {
		setLoading(true);
		setError("");

		try {
			const formData = new FormData();
			formData.append("matricNo", data.matricNo);
			formData.append("password", data.password);

			const res = await loginIIUM(formData);
			if (res.success) {
				resetForm();
				setOpen(false);
				if (redirectPath) {
					window.location.href = redirectPath;
				}
				window.location.reload();
			} else {
				setError(res.error || "Login failed. Please try again.");
			}
		} catch (err) {
			setError("An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{children || <Button>Sign In</Button>}
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-center">
						Welcome Back
					</DialogTitle>
					<DialogDescription className="text-center">
						Sign in to your i-Ma'luum account
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="matricNo">Matric Number</Label>
						<Input
							id="matricNo"
							placeholder="Enter your matric number"
							{...register("matricNo")}
							className={errors.matricNo ? "border-red-500" : ""}
						/>
						{errors.matricNo && (
							<p className="text-sm text-red-500">{errors.matricNo.message}</p>
						)}
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							placeholder="Enter your password"
							{...register("password")}
							className={errors.password ? "border-red-500" : ""}
						/>
						{errors.password && (
							<p className="text-sm text-red-500">{errors.password.message}</p>
						)}
					</div>
					{error && (
						<div className="text-sm text-red-500 text-center">{error}</div>
					)}
					<Button
						className="w-full bg-indigo-600 hover:bg-indigo-700"
						disabled={loading}
						type="submit"
					>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Signing in...
							</>
						) : (
							"Sign in"
						)}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default LoginDialog;
