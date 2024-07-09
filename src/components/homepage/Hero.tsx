import Link from "next/link";

export default () => {
  return (
    <section className="relative h-[80vh] overflow-hidden flex flex-col items-center justify-center py-28 px-4 bg-gray-900 md:px-8">
      <div className="w-full h-full rounded-full bg-gradient-to-r from-[#58AEF1] to-pink-500 absolute -top-12 -right-14 blur-2xl opacity-10"></div>
      <div className="max-w-xl mx-auto text-center relative">
        <div className="py-4">
          <h3 className="text-3xl text-gray-200 font-semibold md:text-4xl">
            Discover All Events at IIUM
          </h3>
          <p className="text-gray-300 leading-relaxed mt-3">
            Your one-stop destination for all events. Stay updated with the
            latest happenings, from academic conferences to cultural festivals.
            Join us in celebrating knowledge, diversity, and community!
          </p>
        </div>
        <label className="input input-bordered flex items-center gap-2">
          <input type="text" className="grow" placeholder="Search" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
        <div className="mt-5 items-center justify-center gap-3 sm:flex">
          <Link
            href="/events"
            className="block w-full mt-2 py-2.5 px-8 text-gray-700 bg-white rounded-md duration-150 hover:bg-gray-100 sm:w-auto"
          >
            Browse Events
          </Link>
        </div>
      </div>
    </section>
  );
};
