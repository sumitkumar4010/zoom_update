import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { connectDB } from '@/lib/db';
import Job from '@/models/Job';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const STATES = [
  { code: 'ap', label: 'AP' },
  { code: 'assam', label: 'Assam' },
  { code: 'bihar', label: 'Bihar' },
  { code: 'chhattisgarh', label: 'Chhattisgarh' },
  { code: 'delhi', label: 'Delhi' },
  { code: 'jharkhand', label: 'Jharkhand' },
  { code: 'haryana', label: 'Haryana' },
  { code: 'hp', label: 'HP' },
  { code: 'mp', label: 'MP' },
  { code: 'odisha', label: 'Odisha' },
  { code: 'rajasthan', label: 'Rajasthan' },
  { code: 'tn', label: 'TN' },
  { code: 'telangana', label: 'Telangana' },
  { code: 'uk', label: 'UK' },
  { code: 'up', label: 'UP' },
  { code: 'wb', label: 'WB' },
];

export default async function HomePage() {
  await connectDB();

  const allJobs = await Job.find({}).sort({ createdAt: -1 }).lean();

  // 1. Top Banner Job extract karo
  const topBannerJob = allJobs.find(
    (j: any) => j.category === 'top-banner' || j.category === 'top-update'
  );

  // 2. Baki normal jobs (Jisme top-banner wali post shaamil NA HO)
  const nonBannerJobs = allJobs.filter(
    (j: any) => j.category !== 'top-banner' && j.category !== 'top-update'
  );

  // Categorized Items Filter (nonBannerJobs se filter karenge)
  const admitCards = nonBannerJobs.filter((j: any) => j.category === 'admit-card');
  const newUpdates = nonBannerJobs; // Saare regular updates
  const currentJobs = nonBannerJobs.filter((j: any) => j.category === 'latest-jobs');
  const results = nonBannerJobs.filter((j: any) => j.category === 'result');
  const answerKeys = nonBannerJobs.filter((j: any) => j.category === 'answer-key');
  const syllabusList = nonBannerJobs.filter((j: any) => j.category === 'syllabus');
  const admissions = nonBannerJobs.filter((j: any) => j.category === 'admission');
  const scholarships = nonBannerJobs.filter((j: any) => j.category === 'scholarship');

  // Trending Grid me sirf NON-BANNER jobs aayengi
  const trendingGrid = nonBannerJobs.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-6xl mx-auto px-2 sm:px-4 py-4 space-y-4">
          {/* Title Heading Bar */}
          <div className="bg-white border border-gray-200 rounded p-2.5 text-center shadow-2xs">
            <h1 className="text-base md:text-lg font-bold text-gray-800">
              ZOOM UPDATE : Official Website zoomupdate.com
            </h1>
          </div>

          {/* State Capsules */}
          <div className="bg-white p-3 rounded border border-gray-200 shadow-2xs">
            <div className="flex flex-wrap justify-center gap-1.5">
              {STATES.map((st) => (
                <Link
                  key={st.code}
                  href={`/state/${st.code}`}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-full text-xs font-semibold text-gray-800 flex items-center gap-1 transition shadow-2xs"
                >
                  <span className="text-amber-600 text-[10px]">📍</span>
                  <span>{st.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Alert Bar (Sirf Top Banner Post Dikhaye) */}
          {topBannerJob && (
            <div className="flex justify-center">
              <Link
                href={`/job/${topBannerJob.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-full text-xs font-bold text-gray-800 shadow-2xs transition cursor-pointer"
              >
                <span>🔥</span>
                <span>{topBannerJob.title}</span>
              </Link>
            </div>
          )}

          {/* Trending Grid (Isme Top Banner Nahi Aayega) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {trendingGrid.map((item: any, idx: number) => {
              const isYellow = idx % 2 === 0;
              return (
                <Link
                  key={item._id}
                  href={`/job/${item.slug}`}
                  className={`p-2.5 rounded border text-xs font-bold transition flex items-center gap-2 shadow-2xs ${
                    isYellow
                      ? 'bg-amber-100/70 border-amber-300 text-gray-900 hover:bg-amber-200'
                      : 'bg-red-100/70 border-red-300 text-gray-900 hover:bg-red-200'
                  }`}
                >
                  <span className="text-red-600">🔥</span>
                  <span className="line-clamp-2 leading-snug">{item.title}</span>
                </Link>
              );
            })}
          </div>

          {/* Social Join Bar */}
          <div className="flex flex-wrap justify-center gap-3 py-1">
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-1.5 bg-sky-50 border border-sky-300 text-sky-700 font-bold text-xs rounded-full hover:bg-sky-100 transition flex items-center gap-1"
            >
              <span>✈️</span> Join Telegram Channel
            </a>
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-700 font-bold text-xs rounded-full hover:bg-emerald-100 transition flex items-center gap-1"
            >
              <span>💬</span> Join WhatsApp Channel
            </a>
          </div>

          {/* SECTION 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <SectionCard title="Admit Card" items={admitCards} color="bg-red-600" />
            <SectionCard title="⚡ New Update" items={newUpdates} color="bg-red-600" />
            <SectionCard title="Current Job" items={currentJobs} color="bg-red-600" />
          </div>

          {/* SECTION 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <SectionCard title="Result" items={results} color="bg-blue-600" />
            <SectionCard title="Answer Key" items={answerKeys} color="bg-blue-600" />
            <SectionCard title="Syllabus" items={syllabusList} color="bg-blue-600" />
          </div>

          {/* SECTION 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SectionCard title="Admission" items={admissions} color="bg-emerald-700" />
            <SectionCard title="Scholarship & Schemes" items={scholarships} color="bg-emerald-700" />
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}

function SectionCard({ title, items, color }: { title: string; items: any[]; color: string }) {
  return (
    <div className="bg-white rounded border border-gray-300 shadow-2xs overflow-hidden flex flex-col">
      <div className={`${color} text-white font-bold text-center py-2 text-sm uppercase tracking-wide`}>
        {title}
      </div>
      <ul className="divide-y divide-gray-200 text-xs flex-1">
        {items && items.length > 0 ? (
          items.map((job: any) => (
            <li key={job._id} className="p-2.5 hover:bg-gray-50 transition">
              <Link
                href={`/job/${job.slug}`}
                className="text-blue-900 font-semibold hover:text-red-600 hover:underline block leading-snug"
              >
                {job.title}
              </Link>
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-gray-400 font-medium">No updates available.</li>
        )}
      </ul>
    </div>
  );
}