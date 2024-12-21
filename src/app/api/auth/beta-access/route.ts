import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto'

const CORRECT_PASSWORD = process.env.BETA_PASSWORD!;
const AUTH_KEY = process.env.AUTH_KEY!;
const AUTH_SECRET = process.env.AUTH_SECRET!;

export async function POST(req: Request) {
    const cookiesPass = await cookies()
    const { password } = await req.json();

    if (password === CORRECT_PASSWORD) {
        const token = crypto.randomBytes(32).toString('hex');

        const hashedToken = crypto
            .createHmac('sha256', AUTH_SECRET)
            .update(token)
            .digest('hex');

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        };

        cookiesPass.set(AUTH_KEY, `${token}.${hashedToken}`, cookieOptions);

        return NextResponse.json({
            success: true,
            message: 'Authenticated'
        });
    }

    return NextResponse.json({ success: false, message: 'Incorrect Password' }, { status: 401 });
}

export async function GET() {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_KEY);

    if (!authCookie?.value) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const [token, hash] = authCookie.value.split('.');

    if (!token || !hash) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // verify the token by recreating the hash
    const expectedHash = crypto
        .createHmac('sha256', AUTH_SECRET)
        .update(token)
        .digest('hex');

    // compare in constant time to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
        new Uint8Array(Buffer.from(hash)),
        new Uint8Array(Buffer.from(expectedHash))
    );

    if (!isValid) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true });
}