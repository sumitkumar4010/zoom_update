import Navbar from '@/components/Navbar';
import { connectDB } from '@/lib/db';
import Job from '@/models/Job';
import Link from 'next/link';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

// 1. Fully Updated Dynamic SEO & OpenGraph Metadata Function
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const job = await Job.findOne({ slug }).lean();

  if (!job) {
    return {
      title: 'Job Not Found - ZOOM UPDATE',
      description: 'Requested job posting could not be found on ZOOM UPDATE.',
    };
  }

  const baseUrl = 'https://www.zoomupdate.com';
  const pageUrl = `${baseUrl}/job/${job.slug}`;
  
  // Banner Image (Jab image database me na ho toh default logo/banner dikhane ke liye)
  const shareImageUrl = job.imageUrl || job.bannerUrl || `${baseUrl}/og-banner.png`;

  const metaTitle = `${job.title} - ZOOM UPDATE`;
  const metaDescription = `${job.title} Online Form 2026. Check Application Fee, Important Dates, Age Limit, Qualification, and Apply Online Link at ZOOM UPDATE.`;

  return {
    title: metaTitle,
    description: metaDescription,
    
    // OpenGraph Meta Tags (WhatsApp, Facebook, Telegram Sharing ke liye)
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

    // Twitter Card Meta Tags
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [shareImageUrl],
    },
  };
}

// Date Format Helper
function formatDate(dateStr?: string) {
  if (!dateStr) return 'N/A';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

// URL Format Helper
function formatUrl(url?: string) {
  if (!url || url.trim() === '' || url === '#') return '';
  let trimmedUrl = url.trim();
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    trimmedUrl = `https://${trimmedUrl}`;
  }
  return trimmedUrl;
}

// Main Page Component
export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  await connectDB();
  const job = await Job.findOne({ slug: slug }).lean();

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
  const notificationUrl = formatUrl(job.notificationLink) || applyUrl;
  const officialWebsiteUrl = formatUrl(job.officialWebsite) || applyUrl;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 pb-12">
      <Navbar />

      <main className="max-w-4xl mx-auto px-2 sm:px-4 py-6 space-y-4">
        {/* Main Title & Updated Date */}
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

        {/* Fast Job Searchers Style Main Outer Table Box */}
        <div className="border border-gray-300 rounded bg-white shadow-xs overflow-hidden">
          
          {/* Top Yellow Action Bar */}
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
                <li>General / EBC / BC / EWS: <span className="font-bold text-gray-900">Rs.{job.feeGeneral || '100'}/-</span></li>
                <li>SC / ST / All Female: <span className="font-bold text-gray-900">Rs.{job.feeSCST || '100'}/-</span></li>
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
                <p>• Minimum Age: <span className="font-bold text-gray-900">{job.ageMin || '18'} Years</span></p>
                <p>• Maximum Age: <span className="font-bold text-red-600">{job.ageMax || '37'} Years</span></p>
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

          {/* Fast Job Searchers Style - Golden Useful Links Table */}
          <div>
            <div className="bg-sky-300 font-bold text-sky-950 text-center py-2 text-sm md:text-base border-b border-gray-300">
              ZOOM UPDATE Official Apply Online Links
            </div>

            <div className="divide-y divide-amber-300 bg-amber-100 text-xs md:text-sm font-bold text-gray-800">
              
              {/* Apply Online */}
              <div className="grid grid-cols-2 text-center items-center py-2.5 hover:bg-amber-200 transition">
                <span className="border-r border-amber-300 py-1">Apply Online</span>
                {applyUrl ? (
                  <a href={applyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                    Click Here To Apply
                  </a>
                ) : (
                  <span className="text-gray-400">Link Available Soon</span>
                )}
              </div>

              {/* Applicant Login */}
              <div className="grid grid-cols-2 text-center items-center py-2.5 hover:bg-amber-200 transition">
                <span className="border-r border-amber-300 py-1">Applicant Login</span>
                {applyUrl ? (
                  <a href={applyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                    Click Here To Login
                  </a>
                ) : (
                  <span className="text-gray-400">Link Available Soon</span>
                )}
              </div>

              {/* Download Notification */}
              <div className="grid grid-cols-2 text-center items-center py-2.5 hover:bg-amber-200 transition">
                <span className="border-r border-amber-300 py-1">Download Notification</span>
                {notificationUrl ? (
                  <a href={notificationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                    Click Here For Notification
                  </a>
                ) : (
                  <span className="text-gray-400">Link Available Soon</span>
                )}
              </div>

              {/* Official Website */}
              <div className="grid grid-cols-2 text-center items-center py-2.5 hover:bg-amber-200 transition">
                <span className="border-r border-amber-300 py-1">Official Website</span>
                {officialWebsiteUrl ? (
                  <a href={officialWebsiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                    Click Here To Open Official Website
                  </a>
                ) : (
                  <span className="text-gray-400">Link Available Soon</span>
                )}
              </div>

              {/* Social Channels */}
              <div className="grid grid-cols-2 text-center items-center py-2.5 hover:bg-amber-200 transition">
                <span className="border-r border-amber-300 py-1">Join Telegram Channel</span>
                <a href="#" className="text-blue-700 hover:underline">Click Here To Join Telegram</a>
              </div>

              <div className="grid grid-cols-2 text-center items-center py-2.5 hover:bg-amber-200 transition">
                <span className="border-r border-amber-300 py-1">Join WhatsApp Channel</span>
                <a href="#" className="text-blue-700 hover:underline">Click Here To Join WhatsApp</a>
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