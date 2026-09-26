import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { connectDB } from '@/lib/db';
import Job from '@/models/Job';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

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

  const topBannerJob = allJobs.find(
    (j: any) => j.category === 'top-banner' || j.category === 'top-update'
  );

  const nonBannerJobs = allJobs.filter(
    (j: any) => j.category !== 'top-banner' && j.category !== 'top-update'
  );

  // 13 Categories Filter
  const admitCards = nonBannerJobs.filter((j: any) => j.category === 'admit-card');
  const newUpdates = nonBannerJobs; 
  const currentJobs = nonBannerJobs.filter((j: any) => j.category === 'latest-jobs' || j.category === 'current-job');
  const results = nonBannerJobs.filter((j: any) => j.category === 'result');
  const answerKeys = nonBannerJobs.filter((j: any) => j.category === 'answer-key');
  const syllabusList = nonBannerJobs.filter((j: any) => j.category === 'syllabus');
  const admissions = nonBannerJobs.filter((j: any) => j.category === 'admission');
  const universityUpdates = nonBannerJobs.filter((j: any) => j.category === 'university-update');
  const scholarships = nonBannerJobs.filter((j: any) => j.category === 'scholarship');
  const upcomingJobs = nonBannerJobs.filter((j: any) => j.category === 'upcoming-job');
  const sarkariYojanas = nonBannerJobs.filter((j: any) => j.category === 'sarkari-yojana' || j.category === 'yojana');
  const documentsList = nonBannerJobs.filter((j: any) => j.category === 'documents' || j.category === 'document');
  const latestBlogs = nonBannerJobs.filter((j: any) => j.category === 'blog' || j.category === 'latest-blog');

  const trendingGrid = nonBannerJobs.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-6xl mx-auto px-2 sm:px-4 py-3 space-y-3">
          {/* Header Title */}
          <div className="bg-white border border-gray-200 rounded p-2 text-center shadow-sm">
            <h1 className="text-sm md:text-lg font-bold text-gray-800">
              ZOOM UPDATE : Official Website zoomupdate.com
            </h1>
          </div>

          {/* State Capsules */}
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

          {/* Social Join Links */}
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

          {/* CATEGORIES GRID (12 Cards Pair me) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <SectionCard title="Admit Card" items={admitCards} color="bg-rose-500" categorySlug="admit-card" />
            <SectionCard title="⚡ New Update" items={newUpdates} color="bg-rose-500" categorySlug="latest-jobs" />
            <SectionCard title="Current Job" items={currentJobs} color="bg-rose-500" categorySlug="latest-jobs" />

            <SectionCard title="Result" items={results} color="bg-blue-600" categorySlug="result" />
            <SectionCard title="Answer Key" items={answerKeys} color="bg-blue-600" categorySlug="answer-key" />
            <SectionCard title="Syllabus" items={syllabusList} color="bg-blue-600" categorySlug="syllabus" />

            <SectionCard title="Admission" items={admissions} color="bg-rose-500" categorySlug="admission" />
            <SectionCard title="University Update" items={universityUpdates} color="bg-rose-500" categorySlug="university-update" />
            <SectionCard title="Scholarship" items={scholarships} color="bg-rose-500" categorySlug="scholarship" />

            <SectionCard title="Upcoming Job" items={upcomingJobs} color="bg-rose-500" categorySlug="upcoming-job" />
            <SectionCard title="Sarkari Yojana" items={sarkariYojanas} color="bg-rose-500" categorySlug="sarkari-yojana" />
            <SectionCard title="Documents" items={documentsList} color="bg-rose-500" categorySlug="documents" />
          </div>

          {/* 13th CATEGORY: Latest Blog (Single Card last me) */}
         <div className="col-span-2 md:col-span-3">
            <SectionCard title="Latest Blog" items={latestBlogs} color="bg-rose-500" categorySlug="blog" />
          </div>

          {/* Bottom Fastjob Style Info Section */}
          <div className="bg-white rounded border border-gray-200 shadow-sm p-4 sm:p-6 mt-4 space-y-8 text-xs sm:text-sm text-gray-800 leading-relaxed">
            
            {/* 1. About Zoom Update */}
            <div>
              <div className="my-6">
                <div 
                  className="text-gray-900 font-bold text-center py-3 px-4 text-base sm:text-2xl shadow-sm w-full"
                  style={{
                    background: 'linear-gradient(90deg, #1abc9c, #2ecc71)',
                    clipPath: 'polygon(3% 0%, 100% 0%, 97% 100%, 0% 100%)'
                  }}
                >
                  About Zoom Update
                </div>
              </div>
              <p className="mb-2">
                Zoom Update is a popular job website in India which website address is{' '}
                <a href="https://www.zoomupdate.com" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium">
                  https://www.zoomupdate.com
                </a>
                . This website was created in 2025 with an aim to provide job updates to millions of job seekers who are wishing to join government job. At present Zoom Update provides job updates of more than 15 (fifteen) important states of India.
              </p>
              <p className="italic font-medium text-gray-700 my-3">
                &quot;Message from Admin:- Dear user we are strengthening our coverage with quick response to deliver job updates accurately with greater user experience.&quot;
              </p>
              <p>
                It is a very light and fast job website with beautiful design in respect of user experience. We are using simple and commonly used English words for taking care of all kinds of visitors.
              </p>
            </div>

            {/* 2. Features of ZoomUpdate */}
            <div>
              <div className="my-6">
                <div 
                  className="text-gray-900 font-bold text-center py-3 px-4 text-base sm:text-2xl shadow-sm w-full"
                  style={{
                    background: 'linear-gradient(90deg, #1abc9c, #2ecc71)',
                    clipPath: 'polygon(3% 0%, 100% 0%, 97% 100%, 0% 100%)'
                  }}
                >
                  Features of ZoomUpdate
                </div>
              </div>
              <p className="mb-2">
                It is a very light and fast website with simple design for all kind of devices. It is a fully responsive website with Mobile first approach with greater user experience. This website also comes with active social handles to keep you updated instantly.
              </p>
              <p className="font-semibold mb-1">Here is key features of our website as:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Current Job (Sarkari Job)</li>
                <li>Admit Card</li>
                <li>Result (Sarkari Result)</li>
                <li>Syllabus</li>
                <li>Answer Key</li>
                <li>Admission</li>
                <li>Exam Date Alert (Sarkari Exam)</li>
                <li>Scholarship</li>
                <li>University Update</li>
                <li>Blogs and other updates.</li>
              </ul>
            </div>

            {/* 3. Zoom Update Coverage */}
            <div>
              <div className="my-6">
                <div 
                  className="text-gray-900 font-bold text-center py-3 px-4 text-base sm:text-2xl shadow-sm w-full"
                  style={{
                    background: 'linear-gradient(90deg, #1abc9c, #2ecc71)',
                    clipPath: 'polygon(3% 0%, 100% 0%, 97% 100%, 0% 100%)'
                  }}
                >
                  Zoom Update Coverage
                </div>
              </div>
              <p className="mb-3">
                We are happy to announce you now extend our coverage in more than 15 (fifteen) important states of our country. This portal is also dedicated for central government job updates. We are also providing almost each and every updates related to central government recruitment. In addition to job updates, you will also get update of Admit Card, Syllabus Answer Key and Result of any state and central government recruitment.
              </p>

              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-gray-900 mb-0.5">Admission Coverage</h3>
                  <p>You will get all kinds of update related to Schools, Colleges and Universities admission update. Almost each and every alert will be available on this website related to state government and central government any kind of admission.</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-0.5">Scholarship Coverage</h3>
                  <p>Those aspirants who want to get higher education and whose family annual income from all sources are under state and central government norms. Zoom Update alerts all the scholarship scheme for the current financial year of states and central government.</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-0.5">Entrance Test Coverage</h3>
                  <p>Those aspirants who are preparing for state and central government entrance test for taking admission in School, College, University, D.El.Ed., B.Ed., Polytechnic, ITI, Engineering, Medical, Agriculture etc. This is the right place for all above students who will get each and every related update as per notification and schedule.</p>
                </div>
              </div>
            </div>

            {/* 4. Sarkari Job on Zoom Update */}
            <div>
              <div className="my-6">
                <div 
                  className="text-gray-900 font-bold text-center py-3 px-4 text-base sm:text-2xl shadow-sm w-full"
                  style={{
                    background: 'linear-gradient(90deg, #1abc9c, #2ecc71)',
                    clipPath: 'polygon(3% 0%, 100% 0%, 97% 100%, 0% 100%)'
                  }}
                >
                  Sarkari Job on Zoom Update
                </div>
              </div>
              <p className="mb-2">You can find almost all state and central government job on this portal. This is a single job point for all those aspirants who are preparing for general competition. Now we are highlighting top government jobs update as follows:</p>
              <ol className="list-[lower-roman] pl-5 space-y-1.5 text-gray-700">
                <li><strong className="text-gray-900">SSC All Exams :-</strong> MTS, CHSL, Constable (GD), CGL, Selection Post, Stenographer Group C and D, Junior Engineer, SI and ASI in Delhi Police etc.</li>
                <li><strong className="text-gray-900">IBPS All Exams :-</strong> Clerk , PO, Special Officer, CRP RRB recruitment etc.</li>
                <li><strong className="text-gray-900">Indian Navy Recruitment :-</strong> Agniveer MR, Agniveer SSR, 10+2 (B.Tech) cadet entry, Tradesman, SSC Officer etc.</li>
                <li><strong className="text-gray-900">Indian Air Force Recruitment :-</strong> Agniveervayu, AFCAT Exam etc.</li>
                <li><strong className="text-gray-900">Indian Coast Guard Recruitment :-</strong> CGEPT ( Navik GD, Navik DB, Yantrik ), CGCAT ( Assistant Commandant ) etc.</li>
                <li><strong className="text-gray-900">Indian Army Recruitment :-</strong> Agniveer Recruitment Rally (State Wise), TEST, JAG, B.Sc (Nursing) Entry Scheme etc.</li>
                <li><strong className="text-gray-900">BSF, ITBP, CRPF, SSB Vacancy:</strong> Constable (Tradesman), SI, ASI, Head Constable (HC), Fireman, Driver etc.</li>
                <li><strong className="text-gray-900">SBI Career :-</strong> Bank PO, Bank Clerk, Special Officer (SO) and Apprentice Engagement.</li>
                <li><strong className="text-gray-900">Indian Railway (RRB and RRC) Recruitment :-</strong> Group D (RRB Group D), RRC Apprentice, RRB NTPC Exam, ALP and Technician recruitment etc.</li>
                <li><strong className="text-gray-900">RPF and RPSF Recruitment :-</strong> Constable and Sub-Inspector (SI) Recruitment etc.</li>
              </ol>
            </div>

            {/* 5. Zoom Update FAQs ? */}
            <div>
              <div className="my-6">
                <div 
                  className="text-gray-900 font-bold text-center py-3 px-4 text-base sm:text-2xl shadow-sm w-full"
                  style={{
                    background: 'linear-gradient(90deg, #1abc9c, #2ecc71)',
                    clipPath: 'polygon(3% 0%, 100% 0%, 97% 100%, 0% 100%)'
                  }}
                >
                  Zoom Update FAQs ?
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-900">1. What is ZoomUpdate?</p>
                  <p className="text-gray-700">Ans:- This is a very light and fast job website for those aspirants who are preparing for General Competitions. All aspirants can find Sarkari job of their state and central government recruitment.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">2. What is official website address of Zoom Update?</p>
                  <p className="text-gray-700">Ans:- The official website address is <a href="https://zoomupdate.com" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">https://www.zoomupdate.com</a></p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">3. Is Zoom Update free for all users?</p>
                  <p className="text-gray-700">Ans:- Yes, Zoom Update is completely free for all job seekers across India.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">4. How to contact Admin?</p>
                  <p className="text-gray-700">Ans:- You can reach out via email at contact@zoomupdate.com</p>
                </div>
              </div>
            </div>

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