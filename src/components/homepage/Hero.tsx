"use client";
import Link from "next/link";

export default () => {
	return (
		<section className="overflow-hidden h-72 flex flex-col items-center py-5 px-4 bg-amber-950 md:px-8">
			{/* <div className="w-full h-full rounded-full bg-gradient-to-r from-[#58AEF1] to-pink-500 absolute -top-12 -right-14 blur-2xl opacity-10"></div> */}
			<div className="max-w-3xl mx-auto text-center">
				<div className="py-4">
					<h3 className="text-3xl text-gray-200 font-extrabold md:text-7xl">
						Unlock a World of Campus Events
					</h3>
					<p className="text-gray-300 leading-relaxed mt-3">
						Join an inspiring workshop, or organize your next big event, we’ve
						got you covered.
					</p>
				</div>
				{/* <div className="bg-amber-50 rounded-md p-3 absolute w-1/2 z-20 left-1/2 -translate-x-1/2"> */}
				<input
					type="text"
					className="p-2 w-1/2 rounded-lg ring-1 ring-black "
					placeholder="Type to search..."
				/>
				{/* </div> */}
				{/* <div className="mt-5 items-center justify-center gap-3 sm:flex">
          <Link
            href="/events"
            className="block w-full mt-2 py-2.5 px-8 text-gray-700 bg-white rounded-md duration-150 hover:bg-white sm:w-auto"
          >
            Browse Events
          </Link>
        </div> */}
			</div>
		</section>
	);
};
