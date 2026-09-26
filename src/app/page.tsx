import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { connectDB } from '@/lib/db';
import Job from '@/models/Job';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// Exact Fastjob style Location Pin Icon (No Extra Package Required)
function MapPinIcon({ className = "w-3 h-3 text-amber-500" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

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

  // 2. Baki normal jobs
  const nonBannerJobs = allJobs.filter(
    (j: any) => j.category !== 'top-banner' && j.category !== 'top-update'
  );

  // Categorized Items Filter
  const admitCards = nonBannerJobs.filter((j: any) => j.category === 'admit-card');
  const newUpdates = nonBannerJobs; // Saare regular updates
  const currentJobs = nonBannerJobs.filter((j: any) => j.category === 'latest-jobs');
  const results = nonBannerJobs.filter((j: any) => j.category === 'result');
  const answerKeys = nonBannerJobs.filter((j: any) => j.category === 'answer-key');
  const syllabusList = nonBannerJobs.filter((j: any) => j.category === 'syllabus');
  const admissions = nonBannerJobs.filter((j: any) => j.category === 'admission');
  const scholarships = nonBannerJobs.filter((j: any) => j.category === 'scholarship');

  // Trending Grid
  const trendingGrid = nonBannerJobs.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-6xl mx-auto px-2 sm:px-4 py-3 space-y-3">
          {/* Title Heading Bar */}
          <div className="bg-white border border-gray-200 rounded p-2 text-center shadow-sm">
            <h1 className="text-sm md:text-lg font-bold text-gray-800">
              ZOOM UPDATE : Official Website zoomupdate.com
            </h1>
          </div>

          {/* State Capsules (With Fastjob Pin & Hover Zoom Effect) */}
          <div className="bg-white p-2.5 rounded border border-gray-200 shadow-sm">
            <div className="flex flex-wrap justify-center gap-1.5 items-center">
              {STATES.map((st) => (
                <Link
                  key={st.code}
                  href={`/state/${st.code}`}
                  className="px-2.5 py-1 bg-white hover:bg-amber-50 border border-amber-300 rounded text-[11px] font-semibold text-gray-700 hover:text-amber-600 flex items-center gap-1 shadow-sm hover:shadow-md hover:scale-105 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
                >
                  <MapPinIcon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{st.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Alert Bar */}
          {topBannerJob && (
            <div className="flex justify-center">
              <Link
                href={`/job/${topBannerJob.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-full text-xs font-bold text-gray-800 shadow-sm transition cursor-pointer"
              >
                <span>🔥</span>
                <span className="line-clamp-1">{topBannerJob.title}</span>
              </Link>
            </div>
          )}

          {/* Trending Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {trendingGrid.map((item: any, idx: number) => {
              const isYellow = idx % 2 === 0;
              return (
                <Link
                  key={item._id}
                  href={`/job/${item.slug}`}
                  className={`p-2 rounded border text-[11px] font-bold transition flex items-center gap-1.5 shadow-sm ${
                    isYellow
                      ? 'bg-amber-100/70 border-amber-300 text-gray-900 hover:bg-amber-200'
                      : 'bg-red-100/70 border-red-300 text-gray-900 hover:bg-red-200'
                  }`}
                >
                  <span className="text-red-600 text-xs">🔥</span>
                  <span className="line-clamp-2 leading-tight">{item.title}</span>
                </Link>
              );
            })}
          </div>

          {/* Social Join Bar */}
          <div className="flex flex-wrap justify-center gap-2 py-0.5">
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 bg-sky-50 border border-sky-300 text-sky-700 font-bold text-[11px] rounded-full hover:bg-sky-100 transition flex items-center gap-1"
            >
              <span>✈️</span> Join Telegram Channel
            </a>
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 bg-emerald-50 border border-emerald-300 text-emerald-700 font-bold text-[11px] rounded-full hover:bg-emerald-100 transition flex items-center gap-1"
            >
              <span>💬</span> Join WhatsApp Channel
            </a>
          </div>

          {/* SECTION 1: Admit Card, New Update, Current Job */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <SectionCard title="Admit Card" items={admitCards} color="bg-rose-500" categorySlug="admit-card" />
            <SectionCard title="⚡ New Update" items={newUpdates} color="bg-rose-500" categorySlug="latest-jobs" />
            <SectionCard title="Current Job" items={currentJobs} color="bg-rose-500" categorySlug="latest-jobs" />
          </div>

          {/* SECTION 2: Result, Answer Key, Syllabus */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <SectionCard title="Result" items={results} color="bg-blue-600" categorySlug="result" />
            <SectionCard title="Answer Key" items={answerKeys} color="bg-blue-600" categorySlug="answer-key" />
            <SectionCard title="Syllabus" items={syllabusList} color="bg-blue-600" categorySlug="syllabus" />
          </div>

          {/* SECTION 3: Admission, Scholarship */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
            <SectionCard title="Admission" items={admissions} color="bg-emerald-700" categorySlug="admission" />
            <SectionCard title="Scholarship & Schemes" items={scholarships} color="bg-emerald-700" categorySlug="scholarship" />
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}

function SectionCard({ title, items, color, categorySlug }: { title: string; items: any[]; color: string; categorySlug?: string }) {
  return (
    <div className="bg-white rounded border border-red-300 shadow-sm overflow-hidden flex flex-col justify-between">
      <div>
        <div className={`${color} text-white font-bold text-center py-1.5 text-xs sm:text-sm tracking-wide`}>
          {title}
        </div>
        <ul className="divide-y divide-gray-100 text-[11px] sm:text-xs">
          {items && items.length > 0 ? (
            items.slice(0, 8).map((job: any) => (
              <li key={job._id} className="p-1.5 sm:p-2 hover:bg-gray-50 transition">
                <Link
                  href={`/job/${job.slug}`}
                  className="text-gray-800 font-semibold hover:text-red-600 hover:underline block leading-snug"
                >
                  {job.title}
                </Link>
              </li>
            ))
          ) : (
            <li className="p-3 text-center text-gray-400 font-medium">No updates available.</li>
          )}
        </ul>
      </div>

      <div className="p-1.5 bg-gray-50 border-t border-gray-100 flex justify-end">
        <Link
          href={`/category/${categorySlug || 'latest-jobs'}`}
          className="bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-bold text-[10px] px-2 py-0.5 rounded flex items-center gap-0.5 transition"
        >
          <span>→</span> View All
        </Link>
      </div>
    </div>
  );
}