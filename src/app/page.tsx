import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'; // 1. Footer import kiya
import { connectDB } from '@/lib/db';
import Job from '@/models/Job';
import Link from 'next/link';
//import FlashBanner from '@/components/FlashBanner';

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

  // Categorized Items Filter
  const admitCards = allJobs.filter((j: any) => j.category === 'admit-card');
  const newUpdates = allJobs.slice(0, 8);
  const topBannerJob = allJobs.find((j: any) => j.category === 'top-banner' || j.category === 'top-update');
  const currentJobs = allJobs.filter((j: any) => j.category === 'latest-jobs');
  const results = allJobs.filter((j: any) => j.category === 'result');
  const answerKeys = allJobs.filter((j: any) => j.category === 'answer-key');
  const syllabusList = allJobs.filter((j: any) => j.category === 'syllabus');
  const admissions = allJobs.filter((j: any) => j.category === 'admission');
  const scholarships = allJobs.filter((j: any) => j.category === 'scholarship');

  const trendingGrid = allJobs.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col justify-between">
      <div>
        <Navbar />
        {/* <FlashBanner /> */}

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

          {/* Top Alert Bar (Dynamic Link Banner) */}
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

          {/* Trending Colored 8-Box Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {trendingGrid.map((item: any, idx: number) => {
              const isYellow = idx % 2 === 0;
              return (
                <Link
                  key={item._id}
                  href={`/job/${item.slug}`}
                  className={`p-2.5 rounded border text-xs font-bold transition flex items-center gap-2 shadow-2xs ${isYellow
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

          {/* SECTION 1: Admit Card | New Update | Current Job */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <SectionCard title="Admit Card" items={admitCards} color="bg-red-600" />
            <SectionCard title="⚡ New Update" items={newUpdates} color="bg-red-600" />
            <SectionCard title="Current Job" items={currentJobs} color="bg-red-600" />
          </div>

          {/* SECTION 2: Result | Answer Key | Syllabus */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <SectionCard title="Result" items={results} color="bg-blue-600" />
            <SectionCard title="Answer Key" items={answerKeys} color="bg-blue-600" />
            <SectionCard title="Syllabus" items={syllabusList} color="bg-blue-600" />
          </div>

          {/* SECTION 3: Admission | Scholarship & Schemes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SectionCard title="Admission" items={admissions} color="bg-emerald-700" />
            <SectionCard title="Scholarship & Schemes" items={scholarships} color="bg-emerald-700" />
          </div>

        </main>
      </div>

      {/* 2. Page ke end me Footer render kiya */}
      <Footer />
    </div>
  );
}

// Reusable Helper Component for Clean Grid Box Cards
function SectionCard({ title, items, color }: { title: string; items: any[]; color: string }) {
  return (
    <div className="bg-white rounded border border-gray-300 shadow-2xs overflow-hidden flex flex-col">
      <div className={`${color} text-white font-bold text-center py-2 text-sm uppercase tracking-wide`}>
        {title}
      </div>
      <ul className="divide-y divide-gray-200 text-xs flex-1">
        {items && items.length > 0 ? (
          items.slice(0, 10).map((job: any) => (
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