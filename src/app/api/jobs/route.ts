import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import Job from '@/models/Job';

// GET Handler - Database se saare posts fetch karne ke liye
export async function GET(req: Request) {
    try {
        await connectDB();
        
        // Database se saari jobs fetch hongi (newest first)
        const jobs = await Job.find({}).sort({ createdAt: -1 }).lean();

        return NextResponse.json({
            success: true,
            data: jobs,
        });
    } catch (error) {
        console.error('Fetch Jobs Error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch jobs', data: [] },
            { status: 500 }
        );
    }
}

// POST Handler - Database me new job save karne ke liye
export async function POST(req: Request) {
    // Session Cookie Check
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session || session.value !== 'authenticated_true') {
        return NextResponse.json(
            { success: false, message: 'Unauthorized! Only Admin can create posts.' },
            { status: 401 }
        );
    }

    try {
        await connectDB();
        const body = await req.json();

        // 1. Title se Automatic Slug Generator
        if (!body.slug && body.title) {
            body.slug = body.title
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
        }

        // 2. Duplicate Slug Handle karne ke liye Timestamp add kar do
        if (body.slug) {
            const existingJob = await Job.findOne({ slug: body.slug });
            if (existingJob) {
                body.slug = `${body.slug}-${Date.now()}`;
            }
        }

        // 3. Database me Entry Save karo
        const newJob = await Job.create(body);

        return NextResponse.json({ 
            success: true, 
            message: 'Job created successfully',
            data: newJob 
        });
    } catch (error: any) {
        console.error('Create Job Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to create job post' },
            { status: 500 }
        );
    }
}