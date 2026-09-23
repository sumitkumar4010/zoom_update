import Navbar from '@/components/Navbar';
import { connectDB } from '@/lib/db';
import Job from '@/models/Job';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();

  const categoryName = slug.toLowerCase();
  const jobs = await Job.find({ category: categoryName }).sort({ createdAt: -1 }).lean();
  const formattedTitle = slug.replace('-', ' ').toUpperCase();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 pb-12">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white p-4 rounded shadow-xs border border-gray-200 text-center">
          <h1 className="text-xl md:text-2xl font-bold text-red-600 uppercase">
            {formattedTitle} UPDATES
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Showing all latest posts under <span className="font-semibold text-gray-800">{formattedTitle}</span>
          </p>
        </div>

        <div className="bg-white rounded shadow-xs border border-gray-300 overflow-hidden">
          <div className="bg-red-700 text-white font-bold text-sm px-4 py-2 uppercase">
            {formattedTitle} List
          </div>
          <ul className="divide-y divide-gray-200">
            {jobs.length > 0 ? (
              jobs.map((job: any) => (
                <li key={job._id} className="p-3.5 hover:bg-amber-50 transition">
                  <Link
                    href={`/job/${job.slug}`}
                    className="text-sm font-semibold text-blue-800 hover:text-red-600 hover:underline flex items-start gap-2"
                  >
                    <span className="text-red-500 font-bold">•</span>
                    <span>{job.title}</span>
                  </Link>
                  {job.postDate && (
                    <span className="text-[11px] text-gray-400 block ml-4 mt-0.5">
                      Posted: {job.postDate}
                    </span>
                  )}
                </li>
              ))
            ) : (
              <li className="p-6 text-center text-gray-500 text-sm">
                No updates available in this category currently.
              </li>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}