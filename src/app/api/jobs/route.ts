import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET Handler - Job Posts & Flash Notices fetch karne ke liye
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const isFlash = searchParams.get('flash') === 'true';

        // TODO: Is jagah apne Database/MongoDB se jobs fetch karein.
        // Abhi ke liye sample data return kar rahe hain taaki crash na ho:
        const sampleJobs = [
            {
                _id: '1',
                title: '🔥 Bihar Police SI Bharti 2026 Online Form Started',
                category: 'top-banner',
                applyLink: '',
            },
        ];

        return NextResponse.json({
            success: true,
            data: sampleJobs,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to fetch jobs', data: [] },
            { status: 500 }
        );
    }
}

// POST Handler - Sirf Admin ke liye Admin Job Posting
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
        const body = await req.json();
        
        // TODO: Yahan aapka Database/MongoDB entry logic aayega
        console.log('Creating job post:', body);

        return NextResponse.json({ success: true, message: 'Job created successfully' });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to create job post' },
            { status: 500 }
        );
    }
}