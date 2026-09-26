import Navbar from '@/components/Navbar';
import { connectDB } from '@/lib/db';
import Job from '@/models/Job';
import Link from 'next/link';
import { Metadata } from 'next';
import { FaTelegramPlane, FaWhatsapp, FaInstagram } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

const TELEGRAM_URL = "https://t.me/your_telegram_channel";
const WHATSAPP_URL = "https://chat.whatsapp.com/your_whatsapp_group";
const INSTAGRAM_URL = "https://instagram.com/your_instagram_handle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const rawJob = await Job.findOne({ slug }).lean();

  if (!rawJob) {
    return {
      title: 'Job Not Found - ZOOM UPDATE',
      description: 'Requested job posting could not be found on ZOOM UPDATE.',
    };
  }

  const job: any = JSON.parse(JSON.stringify(rawJob));
  const baseUrl = 'https://www.zoomupdate.com';
  const pageUrl = `${baseUrl}/job/${job.slug}`;
  const shareImageUrl = job.thumbnailUrl || `${baseUrl}/og-banner.png`;

  const metaTitle = job.seoTitle || `${job.title} - ZOOM UPDATE`;
  const metaDescription = job.metaDescription || `${job.title} Online Application Form. Check Dates, Fee, Eligibility & Apply Online Link.`;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: pageUrl,
      siteName: 'ZOOM UPDATE',
      locale: 'en_US',
      type: 'article',
      images: [{ url: shareImageUrl, width: 1200, height: 630, alt: job.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [shareImageUrl],
    },
  };
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

function formatFee(fee?: string) {
  if (!fee || fee.trim() === '' || fee.toLowerCase() === 'n/a') return 'N/A';
  const cleanFee = fee.replace(/^rs\.?\s*/i, '').trim();
  return `Rs. ${cleanFee}/-`;
}

function formatUrl(url?: any) {
  if (!url) return '';
  let trimmedUrl = String(url).trim();
  if (
    trimmedUrl === '' || 
    trimmedUrl === '#' || 
    trimmedUrl.toLowerCase() === 'null' || 
    trimmedUrl.toLowerCase() === 'undefined'
  ) {
    return '';
  }
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    trimmedUrl = `https://${trimmedUrl}`;
  }
  return trimmedUrl;
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  await connectDB();
  const rawJob = await Job.findOne({ slug }).lean();

  if (!rawJob) {
    return (
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Job Not Found!</h1>
          <p className="text-gray-600 mb-6">Ye job post database me nahi mili ya URL galat hai.</p>
          <Link href="/" className="text-blue-600 hover:underline font-semibold">
            ← Back to Home
          </Link>
        </main>
      </div>
    );
  }

  // Database raw data ko pure JS object me convert kar rhe hai
  const job: any = JSON.parse(JSON.stringify(rawJob));

  const applyUrl = formatUrl(job.applyLink);
  const loginUrl = formatUrl(job.loginLink);
  const notificationUrl = formatUrl(job.notificationLink || job.notificationPdfUrl);
  const syllabusUrl = formatUrl(job.syllabusLink);
  const officialWebsiteUrl = formatUrl(job.officialWebsite);
  const admitCardUrl = formatUrl(job.admitCardLink);
  const answerKeyUrl = formatUrl(job.answerKeyLink);
  const resultUrl = formatUrl(job.resultLink);

  // Variable Mappings
  const organizationName = job.organization || job.department || job.orgName || 'Government Recruitment Examination';
  const totalPosts = job.totalVacancy || job.totalPost || job.vacanciesCount || 'N/A';
  const qualification = job.educationalQualification || job.eligibility || job.qualification;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 pb-12">
      <Navbar />

      <main className="max-w-4xl mx-auto px-2 sm:px-4 py-6 space-y-4">
        {/* SECTION 1: Job Title & Update Date */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-snug">
            {job.title}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Updated On : {job.notificationDate ? formatDate(job.notificationDate) : job.updatedAt ? formatDate(job.updatedAt.split('T')[0]) : 'Recently Updated'}
          </p>
        </div>

        {/* SECTION 9: Meta Description */}
        {job.metaDescription && (
          <p className="text-sm text-gray-700 leading-relaxed bg-white p-3 rounded border border-gray-200">
            {job.metaDescription}
          </p>
        )}

        {/* SECTION 7: Thumbnail / Banner Image */}
        {job.thumbnailUrl && (
          <div className="w-full flex justify-center bg-white border border-gray-300 p-2 rounded">
            <img src={job.thumbnailUrl} alt={job.title} className="max-h-72 object-contain rounded" />
          </div>
        )}

        {/* Main Outer Box */}
        <div className="border border-gray-300 rounded bg-white shadow-sm overflow-hidden">
          
          {/* Quick Header Buttons */}
          <div className="grid grid-cols-2 bg-amber-200 border-b border-gray-300 font-bold text-sm text-center">
            <Link href="/" className="py-2 hover:bg-amber-300 transition border-r border-gray-300 flex items-center justify-center gap-1">
              📋 View All Jobs
            </Link>
            {applyUrl ? (
              <a href={applyUrl} target="_blank" rel="noopener noreferrer" className="py-2 hover:bg-amber-300 transition flex items-center justify-center gap-1">
                ⏩ Apply Online
              </a>
            ) : (
              <span className="py-2 text-gray-500">⏩ Link Available Soon</span>
            )}
          </div>

          {/* SECTION 1: Department Header */}
          <div className="p-4 text-center border-b border-gray-200 bg-gray-50/50 space-y-2">
            <div className="inline-block border border-red-300 px-4 py-0.5 rounded-full text-xs font-bold text-red-600 bg-red-50">
              ZOOM UPDATE
            </div>
            <h2 className="text-base md:text-lg font-bold text-gray-800">
              {organizationName}
            </h2>
            {job.postName && <p className="text-xs font-semibold text-gray-600">{job.postName}</p>}
            <div className="inline-block bg-white border border-gray-300 px-4 py-1 rounded-full text-xs font-semibold text-gray-600 shadow-xs">
              www.zoomupdate.com
            </div>
          </div>

          {/* SECTION 2 & 3: Important Dates & Fee */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-300 border-b border-gray-300">
            {/* SECTION 2: Dates Timeline */}
            <div>
              <div className="bg-sky-200/80 font-bold text-sky-900 px-3 py-1.5 text-sm border-b border-gray-300">
                Important Dates
              </div>
              <ul className="p-3 text-xs md:text-sm space-y-1.5 list-disc list-inside text-gray-700">
                {job.notificationDate && <li>Notification Date: <span className="font-bold text-gray-900">{formatDate(job.notificationDate)}</span></li>}
                {job.applyStartDate && <li>Apply Start Date: <span className="font-bold text-gray-900">{formatDate(job.applyStartDate)}</span></li>}
                {job.applyEndDate && <li>Apply Last Date: <span className="font-bold text-red-600">{formatDate(job.applyEndDate)}</span></li>}
                {job.feePaymentLastDate && <li>Fee Payment Last Date: <span className="font-bold text-gray-900">{formatDate(job.feePaymentLastDate)}</span></li>}
                {job.correctionLastDate && <li>Correction Date: <span className="font-bold text-gray-900">{formatDate(job.correctionLastDate)}</span></li>}
                {job.examDate && <li>Exam Date: <span className="font-bold text-blue-600">{job.examDate}</span></li>}
                {job.admitCardDate && <li>Admit Card Date: <span className="font-bold text-gray-900">{job.admitCardDate}</span></li>}
                {job.resultDate && <li>Result Date: <span className="font-bold text-gray-900">{job.resultDate}</span></li>}
              </ul>
            </div>

            {/* SECTION 3: Application Fee */}
            <div>
              <div className="bg-sky-200/80 font-bold text-sky-900 px-3 py-1.5 text-sm border-b border-gray-300">
                Application Fee
              </div>
              <ul className="p-3 text-xs md:text-sm space-y-1.5 list-disc list-inside text-gray-700">
                {job.feeGeneral && <li>General / OBC / EWS: <span className="font-bold text-gray-900">{formatFee(job.feeGeneral)}</span></li>}
                {job.feeSCST && <li>SC / ST / Female: <span className="font-bold text-gray-900">{formatFee(job.feeSCST)}</span></li>}
                {job.feeEWS && <li>PWD Fee: <span className="font-bold text-gray-900">{formatFee(job.feeEWS)}</span></li>}
                {job.feeMode && <li>Payment Mode: <span className="font-semibold text-gray-800">{job.feeMode}</span></li>}
              </ul>
            </div>
          </div>

          {/* SECTION 4: Age Limit & Total Vacancy */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-300 border-b border-gray-300">
            <div>
              <div className="bg-sky-200/80 font-bold text-sky-900 px-3 py-1.5 text-sm border-b border-gray-300">
                Age Limit
              </div>
              <div className="p-3 text-xs md:text-sm space-y-1 text-gray-700">
                <p>• Minimum Age: <span className="font-bold text-gray-900">{job.ageMin ? `${job.ageMin} Years` : 'N/A'}</span></p>
                <p>• Maximum Age: <span className="font-bold text-red-600">{job.ageMax ? `${job.ageMax} Years` : 'N/A'}</span></p>
                {job.ageRelaxation && <p>• Age Relaxation: <span className="text-gray-800">{job.ageRelaxation}</span></p>}
              </div>
            </div>

            <div>
              <div className="bg-sky-200/80 font-bold text-sky-900 px-3 py-1.5 text-sm border-b border-gray-300">
                Total Vacancy
              </div>
              <div className="p-6 flex flex-col items-center justify-center">
                <span className="text-3xl md:text-5xl font-extrabold text-red-600">
                  {totalPosts}
                </span>
                <span className="text-xs text-gray-500 mt-1">Location: {job.jobLocation || 'All India'}</span>
              </div>
            </div>
          </div>

          {/* SECTION 4: Educational Qualification */}
          {qualification && (
            <div className="border-b border-gray-300">
              <div className="bg-sky-200/80 font-bold text-sky-900 px-3 py-1.5 text-sm border-b border-gray-300">
                Educational Qualification
              </div>
              <div className="p-3 text-xs md:text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                {qualification}
              </div>
            </div>
          )}

          {/* SECTION 5: Salary & Selection Process */}
          {(job.salaryPayScale || job.gradePay || job.selectionProcess || job.experienceRequired) && (
            <div className="border-b border-gray-300 divide-y divide-gray-300">
              <div className="bg-sky-200/80 font-bold text-sky-900 px-3 py-1.5 text-sm">
                Salary, Experience & Selection Process
              </div>
              <div className="p-3 text-xs md:text-sm space-y-2 text-gray-800">
                {job.salaryPayScale && <p>• <span className="font-bold">Salary / Pay Scale:</span> {job.salaryPayScale} {job.gradePay ? `(${job.gradePay})` : ''}</p>}
                {job.experienceRequired && <p>• <span className="font-bold">Experience Required:</span> {job.experienceRequired}</p>}
                {job.selectionProcess && <p>• <span className="font-bold">Selection Process:</span> {job.selectionProcess}</p>}
              </div>
            </div>
          )}

          {/* SECTION 6: Vacancy Breakdown Table */}
          {job.vacancies && job.vacancies.length > 0 && (
            <div className="border-b border-gray-300">
              <div className="bg-sky-200/80 font-bold text-sky-900 px-3 py-1.5 text-sm border-b border-gray-300">
                Vacancy Breakdown Details
              </div>
              <div className="overflow-x-auto p-2">
                <table className="w-full text-xs md:text-sm text-center border border-gray-300">
                  <thead className="bg-gray-200 font-bold text-gray-800">
                    <tr>
                      <th className="border p-2">Post Name</th>
                      <th className="border p-2">UR</th>
                      <th className="border p-2">OBC</th>
                      <th className="border p-2">SC</th>
                      <th className="border p-2">ST</th>
                      <th className="border p-2">PWD</th>
                      <th className="border p-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {job.vacancies.map((v: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border p-2 font-semibold text-left">{v.categoryName || job.postName || 'Post'}</td>
                        <td className="border p-2">{v.ur || '0'}</td>
                        <td className="border p-2">{v.obc || '0'}</td>
                        <td className="border p-2">{v.sc || '0'}</td>
                        <td className="border p-2">{v.st || '0'}</td>
                        <td className="border p-2">{v.ews || '0'}</td>
                        <td className="border p-2 font-bold text-red-600">{v.total || '0'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 8: How To Apply */}
          {job.howToApply && (
            <div className="border-b border-gray-300">
              <div className="bg-sky-200/80 font-bold text-sky-900 px-3 py-1.5 text-sm border-b border-gray-300">
                How to Apply
              </div>
              <div className="p-3 text-xs md:text-sm text-gray-800 whitespace-pre-line leading-relaxed font-mono bg-gray-50">
                {job.howToApply}
              </div>
            </div>
          )}

          {/* SECTION 8: Important Links Box */}
          <div className="border-2 border-yellow-500 rounded-sm overflow-hidden m-2 sm:m-4">
            <div className="divide-y-2 divide-yellow-500 bg-[#fde047] text-sm md:text-base font-bold text-gray-900">
              
              <div className="grid grid-cols-2 text-center items-center">
                <span className="border-r-2 border-yellow-500 py-3 px-2 text-gray-900">Apply Online</span>
                <div className="py-3 px-2">
                  {applyUrl ? (
                    <a href={applyUrl} target="_blank" rel="noopener noreferrer" className="text-[#581c87] hover:underline font-bold block">
                      Click Here To Apply
                    </a>
                  ) : <span className="text-gray-500">Link Available Soon</span>}
                </div>
              </div>

              {loginUrl && (
                <div className="grid grid-cols-2 text-center items-center">
                  <span className="border-r-2 border-yellow-500 py-3 px-2 text-gray-900">Applicant Login</span>
                  <div className="py-3 px-2">
                    <a href={loginUrl} target="_blank" rel="noopener noreferrer" className="text-[#581c87] hover:underline font-bold block">
                      Click Here To Login
                    </a>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 text-center items-center">
                <span className="border-r-2 border-yellow-500 py-3 px-2 text-gray-900">Download Notification</span>
                <div className="py-3 px-2">
                  {notificationUrl ? (
                    <a href={notificationUrl} target="_blank" rel="noopener noreferrer" className="text-[#581c87] hover:underline font-bold block">
                      Click Here To Download PDF
                    </a>
                  ) : <span className="text-gray-500">Link Available Soon</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 text-center items-center">
                <span className="border-r-2 border-yellow-500 py-3 px-2 text-gray-900">Download Syllabus</span>
                <div className="py-3 px-2">
                  {syllabusUrl ? (
                    <a href={syllabusUrl} target="_blank" rel="noopener noreferrer" className="text-[#581c87] hover:underline font-bold block">
                      Click Here To Download Syllabus
                    </a>
                  ) : <span className="text-gray-500">Link Available Soon</span>}
                </div>
              </div>

              {admitCardUrl && (
                <div className="grid grid-cols-2 text-center items-center">
                  <span className="border-r-2 border-yellow-500 py-3 px-2 text-gray-900">Download Admit Card</span>
                  <div className="py-3 px-2">
                    <a href={admitCardUrl} target="_blank" rel="noopener noreferrer" className="text-[#581c87] hover:underline font-bold block">
                      Click Here
                    </a>
                  </div>
                </div>
              )}

              {answerKeyUrl && (
                <div className="grid grid-cols-2 text-center items-center">
                  <span className="border-r-2 border-yellow-500 py-3 px-2 text-gray-900">Download Answer Key</span>
                  <div className="py-3 px-2">
                    <a href={answerKeyUrl} target="_blank" rel="noopener noreferrer" className="text-[#581c87] hover:underline font-bold block">
                      Click Here
                    </a>
                  </div>
                </div>
              )}

              {resultUrl && (
                <div className="grid grid-cols-2 text-center items-center">
                  <span className="border-r-2 border-yellow-500 py-3 px-2 text-gray-900">Check Result</span>
                  <div className="py-3 px-2">
                    <a href={resultUrl} target="_blank" rel="noopener noreferrer" className="text-[#581c87] hover:underline font-bold block">
                      Click Here
                    </a>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 text-center items-center">
                <span className="border-r-2 border-yellow-500 py-3 px-2 text-gray-900">Official Website</span>
                <div className="py-3 px-2">
                  {officialWebsiteUrl ? (
                    <a href={officialWebsiteUrl} target="_blank" rel="noopener noreferrer" className="text-[#581c87] hover:underline font-bold block">
                      Click Here To Open
                    </a>
                  ) : <span className="text-gray-500">Link Available Soon</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 text-center items-center">
                <span className="border-r-2 border-yellow-500 py-3 px-2 text-gray-900 flex items-center justify-center gap-2">
                  Join <FaTelegramPlane className="text-white bg-[#0088cc] p-1 rounded-full text-xl" /> Telegram
                </span>
                <div className="py-3 px-2">
                  <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-[#581c87] hover:underline font-bold block">
                    Join Channel
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 text-center items-center">
                <span className="border-r-2 border-yellow-500 py-3 px-2 text-gray-900 flex items-center justify-center gap-2">
                  Join <FaWhatsapp className="text-white bg-[#25D366] p-1 rounded-full text-xl" /> WhatsApp
                </span>
                <div className="py-3 px-2">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-[#581c87] hover:underline font-bold block">
                    Join Group
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 text-center items-center">
                <span className="border-r-2 border-yellow-500 py-3 px-2 text-gray-900 flex items-center justify-center gap-2">
                  Follow <FaInstagram className="text-white bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-1 rounded-lg text-xl" /> Instagram
                </span>
                <div className="py-3 px-2">
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-[#581c87] hover:underline font-bold block">
                    Follow Page
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center pt-2">
          <Link href="/" className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-semibold text-xs py-2 px-6 rounded transition">
            ← Back To Home
          </Link>
        </div>
      </main>
    </div>
  );
}