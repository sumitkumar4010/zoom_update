import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import Job from '@/models/Job';

// GET Handler
export async function GET() {
  try {
    await connectDB();
    const jobs = await Job.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: jobs,
    });
  } catch (error: any) {
    console.error('Fetch Jobs Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch jobs', data: [] },
      { status: 500 }
    );
  }
}

// POST Handler
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session || session.value !== 'authenticated_true') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized! Only Admin can create posts.' },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await req.json();

    // Title se Slug Generate Karo
    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Fallback slug check
    if (!body.slug) {
      body.slug = `job-${Date.now()}`;
    } else {
      const existingJob = await Job.findOne({ slug: body.slug });
      if (existingJob) {
        body.slug = `${body.slug}-${Date.now()}`;
      }
    }

    const newJob = await Job.create(body);

    return NextResponse.json({
      success: true,
      message: 'Job created successfully',
      data: newJob,
    });
  } catch (error: any) {
    console.error('Create Job Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create job post' },
      { status: 500 }
    );
  }
}