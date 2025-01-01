import React from "react";

function Loading() {
	return (
		<div className="flex py-20 justify-center min-h-screen">
			<div className="text-center">
				<div
					className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
					role="status"
				>
					<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
						Loading...
					</span>
				</div>
				<p className="mt-4 text-lg font-semibold">Loading...</p>
			</div>
		</div>
	);
}

export default Loading;
