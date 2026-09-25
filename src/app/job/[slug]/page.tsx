import Navbar from '@/components/Navbar';
import { connectDB } from '@/lib/db';
import Job from '@/models/Job';
import Link from 'next/link';
import { Metadata } from 'next';
import { FaTelegramPlane, FaWhatsapp, FaInstagram } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

// Social Links
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
  const job: any = await Job.findOne({ slug }).lean();

  if (!job) {
    return {
      title: 'Job Not Found - ZOOM UPDATE',
      description: 'Requested job posting could not be found on ZOOM UPDATE.',
    };
  }

  const baseUrl = 'https://www.zoomupdate.com';
  const pageUrl = `${baseUrl}/job/${job.slug}`;
  const shareImageUrl = job.imageUrl || `${baseUrl}/og-banner.png`;

  const metaTitle = `${job.title} - ZOOM UPDATE`;
  const metaDescription = `${job.title} Online Form 2026. Check Application Fee, Important Dates, Age Limit, Qualification, and Apply Online Link at ZOOM UPDATE.`;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: `Apply online for ${job.title}. Check last date, fee, eligibility, and official links.`,
      url: pageUrl,
      siteName: 'ZOOM UPDATE',
      locale: 'en_US',
      type: 'article',
      images: [
        {
          url: shareImageUrl,
          width: 1200,
          height: 630,
          alt: job.title,
        },
      ],
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
  if (!dateStr) return 'N/A';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

function formatUrl(url?: string) {
  if (!url || url.trim() === '' || url === '#') return '';
  let trimmedUrl = url.trim();
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
  const job: any = await Job.findOne({ slug: slug }).lean();

  if (!job) {
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

  const applyUrl = formatUrl(job.applyLink);
  const loginUrl = formatUrl(job.loginLink);
  const notificationUrl = formatUrl(job.notificationLink);
  const syllabusUrl = formatUrl(job.syllabusLink); // Dynamic link entered by admin
  const officialWebsiteUrl = formatUrl(job.officialWebsite);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 pb-12">
      <Navbar />

      <main className="max-w-4xl mx-auto px-2 sm:px-4 py-6 space-y-4">
        {/* Title & Date Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-snug">
            {job.title}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Updated On : {job.postDate ? formatDate(job.postDate) : 'Recently Updated'}
          </p>
        </div>

        {/* Short Description */}
        <p className="text-sm text-gray-700 leading-relaxed">
          {job.description ||
            `${job.title} online application form is now active. All eligible candidates can apply online before the last date through official website.`}
        </p>

        {/* Main Details Box */}
        <div className="border border-gray-300 rounded bg-white shadow-xs overflow-hidden">
          {/* Action Header */}
          <div className="grid grid-cols-2 bg-amber-200 border-b border-gray-300 font-bold text-sm text-center">
            <Link href="/" className="py-2 hover:bg-amber-300 transition border-r border-gray-300 flex items-center justify-center gap-1">
              📋 View All Jobs
            </Link>
            {applyUrl ? (
              <a href={applyUrl} target="_blank" rel="noopener noreferrer" className="py-2 hover:bg-amber-300 transition flex items-center justify-center gap-1">
                ⏩ Apply Online
              </a>
            ) : (
              <span className="py-2 text-gray-500">⏩ Link Soon</span>
            )}
          </div>

          {/* Department Branding Header */}
          <div className="p-4 text-center border-b border-gray-200 bg-gray-50/50 space-y-2">
            <div className="inline-block border border-red-300 px-4 py-0.5 rounded-full text-xs font-bold text-red-600 bg-red-50">
              ZOOM UPDATE
            </div>
            <h2 className="text-base md:text-lg font-bold text-gray-800">
              {job.department || 'Government Recruitment Examination 2026'}
            </h2>
            <div className="inline-block bg-white border border-gray-300 px-4 py-1 rounded-full text-xs font-semibold text-gray-600 shadow-2xs">
              www.zoomupdate.com
            </div>
          </div>

          {/* Grid 1: Important Dates & Application Fee */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-300 border-b border-gray-300">
            <div>
              <div className="bg-sky-200/80 font-bold text-sky-900 px-3 py-1.5 text-sm border-b border-gray-300">
                Important Dates
              </div>
              <ul className="p-3 text-xs md:text-sm space-y-1.5 list-disc list-inside text-gray-700">
                <li>Application Start Date: <span className="font-bold text-gray-900">{formatDate(job.applyStartDate)}</span></li>
                <li>Application Last Date: <span className="font-bold text-red-600">{formatDate(job.applyEndDate)}</span></li>
              </ul>
            </div>

            <div>
              <div className="bg-sky-200/80 font-bold text-sky-900 px-3 py-1.5 text-sm border-b border-gray-300">
                Application Fee
              </div>
              <ul className="p-3 text-xs md:text-sm space-y-1.5 list-disc list-inside text-gray-700">
                <li>General / EBC / BC / EWS: <span className="font-bold text-gray-900">{job.feeGeneral ? `Rs.${job.feeGeneral}/-` : 'N/A'}</span></li>
                <li>SC / ST / All Female: <span className="font-bold text-gray-900">{job.feeSCST ? `Rs.${job.feeSCST}/-` : 'N/A'}</span></li>
                <li>Pay application fee via Online Mode.</li>
              </ul>
            </div>
          </div>

          {/* Grid 2: Age Limit & Total Post */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-300 border-b border-gray-300">
            <div>
              <div className="bg-sky-200/80 font-bold text-sky-900 px-3 py-1.5 text-sm border-b border-gray-300">
                Age Limit
              </div>
              <div className="p-3 text-xs md:text-sm space-y-1 text-gray-700">
                <p>• Minimum Age: <span className="font-bold text-gray-900">{job.ageMin ? `${job.ageMin} Years` : 'N/A'}</span></p>
                <p>• Maximum Age: <span className="font-bold text-red-600">{job.ageMax ? `${job.ageMax} Years` : 'N/A'}</span></p>
              </div>
            </div>

            <div>
              <div className="bg-sky-200/80 font-bold text-sky-900 px-3 py-1.5 text-sm border-b border-gray-300">
                Total Post
              </div>
              <div className="p-6 flex items-center justify-center">
                <span className="text-4xl md:text-5xl font-extrabold text-red-600">
                  {job.totalPost || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Qualification / Eligibility Section */}
          {job.eligibility && (
            <div className="border-b border-gray-300">
              <div className="bg-sky-200/80 font-bold text-sky-900 px-3 py-1.5 text-sm border-b border-gray-300">
                Eligibility & Qualification Criteria
              </div>
              <div className="p-3 text-xs md:text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                {job.eligibility}
              </div>
            </div>
          )}

          {/* Useful Links Table */}
          <div className="border-2 border-yellow-500 rounded-sm overflow-hidden m-2 sm:m-4">
            <div className="divide-y-2 divide-yellow-500 bg-[#fde047] text-sm md:text-base font-bold text-gray-900">
              
              {/* Apply Online */}
              <div className="grid grid-cols-2 text-center items-center">
                <span className="border-r-2 border-yellow-500 py-3 px-2 text-gray-900">
                  Apply Online
                </span>
                <div className="py-3 px-2">
                  {applyUrl ? (
                    <a href={applyUrl} target="_blank" rel="noopener noreferrer" className="text-[#581c87] hover:underline font-bold block">
                      Click Here To Apply
                    </a>
                  ) : (
                    <span className="text-gray-500">Link Available Soon</span>
                  )}
                </div>
              </div>

              {/* Applicant Login */}
              <div className="grid grid-cols-2 text-center items-center">
                <span className="border-r-2 border-yellow-500 py-3 px-2 text-gray-900">
                  Applicant Login
                </span>
                <div className="py-3 px-2">
                  {loginUrl ? (
                    <a href={loginUrl} target="_blank" rel="noopener noreferrer" className="text-[#581c87] hover:underline font-bold block">
                      Click Here To Login
                    </a>
                  ) : (
                    <span className="text-gray-500">Link Available Soon</span>
                  )}
                </div>
              </div>

              {/* Download Notification */}
              <div className="grid grid-cols-2 text-center items-center">
                <span className="border-r-2 border-yellow-500 py-3 px-2 text-gray-900">
                  Download Notification
                </span>
                <div className="py-3 px-2">
                  {notificationUrl ? (
                    <a href={notificationUrl} target="_blank" rel="noopener noreferrer" className="text-[#581c87] hover:underline font-bold block">
                      Click Here To Download Notification
                    </a>
                  ) : (
                    <span className="text-gray-500">Link Available Soon</span>
                  )}
                </div>
              </div>

              {/* Download Syllabus */}
              <div className="grid grid-cols-2 text-center items-center">
                <span className="border-r-2 border-yellow-500 py-3 px-2 text-gray-900">
                  Download Syllabus
                </span>
                <div className="py-3 px-2">
                  {syllabusUrl ? (
                    <a href={syllabusUrl} target="_blank" rel="noopener noreferrer" className="text-[#581c87] hover:underline font-bold block">
                      Click Here To Download Syllabus
                    </a>
                  ) : (
                    <span className="text-gray-500">Link Available Soon</span>
                  )}
                </div>
              </div>

              {/* Official Website */}
              <div className="grid grid-cols-2 text-center items-center">
                <span className="border-r-2 border-yellow-500 py-3 px-2 text-gray-900">
                  Official Website
                </span>
                <div className="py-3 px-2">
                  {officialWebsiteUrl ? (
                    <a href={officialWebsiteUrl} target="_blank" rel="noopener noreferrer" className="text-[#581c87] hover:underline font-bold block">
                      Click Here To Open Official Website
                    </a>
                  ) : (
                    <span className="text-gray-500">Link Available Soon</span>
                  )}
                </div>
              </div>

              {/* Join Telegram Channel */}
              <div className="grid grid-cols-2 text-center items-center">
                <span className="border-r-2 border-yellow-500 py-3 px-2 text-gray-900 flex items-center justify-center gap-2">
                  Join <FaTelegramPlane className="text-white bg-[#0088cc] p-1 rounded-full text-xl" /> Telegram Channel
                </span>
                <div className="py-3 px-2">
                  <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-[#581c87] hover:underline font-bold block">
                    Click Here To Join Telegram
                  </a>
                </div>
              </div>

              {/* Join WhatsApp Channel */}
              <div className="grid grid-cols-2 text-center items-center">
                <span className="border-r-2 border-yellow-500 py-3 px-2 text-gray-900 flex items-center justify-center gap-2">
                  Join <FaWhatsapp className="text-white bg-[#25D366] p-1 rounded-full text-xl" /> WhatsApp Channel
                </span>
                <div className="py-3 px-2">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-[#581c87] hover:underline font-bold block">
                    Click Here To Join WhatsApp
                  </a>
                </div>
              </div>

              {/* Follow Us On Instagram */}
              <div className="grid grid-cols-2 text-center items-center">
                <span className="border-r-2 border-yellow-500 py-3 px-2 text-gray-900 flex items-center justify-center gap-2">
                  Follow Us On <FaInstagram className="text-white bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 p-1 rounded-lg text-xl" /> Instagram
                </span>
                <div className="py-3 px-2">
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-[#581c87] hover:underline font-bold block">
                    Click Here To Follow Us On Instagram
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