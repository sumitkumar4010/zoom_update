'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function FlashBanner() {
  const [flashJob, setFlashJob] = useState<any>(null);

  useEffect(() => {
    async function fetchFlashNotice() {
      try {
        const res = await fetch('/api/jobs?flash=true');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setFlashJob(data.data[0]); // Sabse latest PMS/Flash Notice
        }
      } catch (err) {
        console.error('Failed to fetch flash banner', err);
      }
    }
    fetchFlashNotice();
  }, []);

  if (!flashJob) return null;

  return (
    <div className="flex justify-center my-4 px-2">
      <Link
        href={flashJob.applyLink || `/job/${flashJob._id}`}
        target={flashJob.applyLink ? "_blank" : "_self"}
        className="inline-flex items-center gap-2 bg-amber-100 border border-amber-400 text-amber-900 font-bold px-5 py-2.5 rounded-full text-xs sm:text-sm md:text-base shadow-sm hover:shadow-md hover:bg-amber-200 transition-all duration-200 animate-pulse"
      >
        <span className="text-base">🔥</span>
        <span>{flashJob.title}</span>
      </Link>
    </div>
  );
}