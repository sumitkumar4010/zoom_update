import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        const envUser = process.env.ADMIN_USERNAME;
        const envPass = process.env.ADMIN_PASSWORD;

        // Credentials Verification
        if (username !== envUser || password !== envPass) {
            return NextResponse.json(
                { success: false, message: 'Invalid Username or Password' },
                { status: 401 }
            );
        }

        // Response with Secure Cookie Set
        const response = NextResponse.json({
            success: true,
            message: 'Authentication Successful',
        });

        // HTTP-Only Cookie set karein (Frontend JavaScript ise read/modify nahi kar sakta)
        response.cookies.set('admin_session', 'authenticated_true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 Day Session
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}