import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#38b6ff] flex flex-col items-center justify-center text-white px-4 text-center">
      <h1 className="text-6xl md:text-8xl font-extrabold mb-4 drop-shadow-md">
        404 Page Not Found !
      </h1>
      <p className="text-xl md:text-2xl font-medium mb-8">
        The Page You Were Looking For Does Not Exist.
      </p>
      <Link
        href="/"
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition duration-200"
      >
        Back To Home
      </Link>
    </div>
  );
}   