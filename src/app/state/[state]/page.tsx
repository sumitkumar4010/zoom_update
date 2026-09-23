import Navbar from '@/components/Navbar';
import { connectDB } from '@/lib/db';
import Job from '@/models/Job';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  await connectDB();

  const stateName = state.toUpperCase();
  const stateQuery = new RegExp(state, 'i');

  // Fetch state specific posts
  const allStateJobs = await Job.find({
    $or: [{ title: stateQuery }, { department: stateQuery }],
  })
    .sort({ createdAt: -1 })
    .lean();

  // Filter posts by category
  const admitCards = allStateJobs.filter((j: any) => j.category === 'admit-card');
  const results = allStateJobs.filter((j: any) => j.category === 'result');
  const currentJobs = allStateJobs.filter((j: any) => j.category === 'latest-jobs');
  const syllabus = allStateJobs.filter((j: any) => j.category === 'syllabus');
  const answerKeys = allStateJobs.filter((j: any) => j.category === 'answer-key');
  const admissions = allStateJobs.filter((j: any) => j.category === 'admission');

  const renderJobBox = (title: string, jobs: any[]) => (
    <div className="bg-white rounded border border-emerald-700 shadow-xs overflow-hidden flex flex-col h-full">
      <div className="bg-emerald-700 text-white font-bold text-center py-2 text-sm uppercase">
        {title}
      </div>
      <ul className="divide-y divide-gray-200 text-xs flex-1">
        {jobs.length > 0 ? (
          jobs.slice(0, 10).map((job: any) => (
            <li key={job._id} className="p-2.5 hover:bg-emerald-50 transition">
              <Link
                href={`/job/${job.slug}`}
                className="text-blue-900 font-semibold hover:text-red-600 hover:underline block leading-snug"
              >
                {job.title}
              </Link>
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-gray-400">
            No active updates available.
          </li>
        )}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 pb-12">
      <Navbar />

      <main className="max-w-6xl mx-auto px-2 sm:px-4 py-6 space-y-6">
        {/* Main Header Title */}
        <div className="text-center space-y-3">
          <h1 className="text-xl md:text-3xl font-bold text-gray-800">
            {stateName} : Latest Job, Admit Card, Result, Syllabus
          </h1>
          <div className="inline-flex items-center gap-1 px-6 py-1.5 bg-white border border-emerald-500 text-emerald-700 font-bold rounded-full text-sm shadow-xs">
            📍 {stateName}
          </div>
        </div>

        {/* 6 Grid Section (Matching Image Design) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {renderJobBox('Admit Card', admitCards)}
          {renderJobBox('Result', results)}
          {renderJobBox('Current Job', currentJobs)}
          {renderJobBox('Syllabus', syllabus)}
          {renderJobBox('Answer Key', answerKeys)}
          {renderJobBox('Admission', admissions)}
        </div>
      </main>
    </div>
  );
}