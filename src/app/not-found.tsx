import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#38b6ff] flex flex-col items-center justify-center text-white px-4 text-center">
      {/* Small & Clean 404 Heading */}
      <h1 className="text-3xl md:text-5xl font-bold mb-3">
        404 Page Not Found !
      </h1>

      {/* Compact Subtitle */}
      <p className="text-sm md:text-lg font-normal mb-6 opacity-90">
        The Page You Were Looking For Doest Not Exist.
      </p>

      {/* Compact Button */}
      <Link
        href="/"
        className="bg-[#ff0000] hover:bg-red-700 text-white font-medium py-2 px-5 rounded text-xs md:text-sm transition duration-200"
      >
        Back To Home
      </Link>
    </div>
  );
}