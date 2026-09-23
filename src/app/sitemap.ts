import { connectDB } from '@/lib/db';
import Job from '@/models/Job';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://zoomupdate.com';

  await connectDB();
  const jobs = await Job.find({}).select('slug updatedAt').lean();

  // Dynamic Job URLs
  const jobUrls = jobs.map((job: any) => ({
    url: `${baseUrl}/job/${job.slug}`,
    lastModified: job.updatedAt || new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Main Static & Category Pages
  const staticPages = [
    '',
    '/category/latest-jobs',
    '/category/admit-card',
    '/category/result',
    '/category/answer-key',
    '/category/syllabus',
    '/category/admission',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'always' as const,
    priority: route === '' ? 1.0 : 0.9,
  }));

  return [...staticPages, ...jobUrls];
}