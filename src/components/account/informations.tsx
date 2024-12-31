"use client";

function Informations() {
	return (
		<>
			<h3 className="text-3xl font-medium text-center md:text-left">
				Personal Information
			</h3>
			<p className="text-sm font-thin text-center md:text-left mb-6 md:mb-3">
				Manage your account information, including phone numbers and email where
				you can be contacted
			</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-4 mt-3">
				<div className="py-10 rounded-lg border w-full flex flex-col items-center text-start bg-amber-900">
					<p className="text-lg font-semibold">Email address</p>
					<p className="font-thin text-xs">verified</p>
				</div>
				<div className="py-10 rounded-lg border w-full flex flex-col items-center text-start bg-amber-900">
					<p className="text-lg font-semibold">Change Password</p>
					<p className="font-thin text-xs">change your pw</p>
				</div>
				<div className="py-10 rounded-lg border w-full flex flex-col items-center text-start bg-amber-900">
					<p className="text-lg font-semibold">IIUM People?</p>
					<p className="font-thin text-xs">yes</p>
				</div>
			</div>
		</>
	);
}

export default Informations;
