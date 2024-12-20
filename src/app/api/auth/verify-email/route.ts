import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { auth } from "@/auth";
import { EmailTemplate } from "@/components/EmailTemplate";
import { Resend } from "resend";
import { emailSchema } from "@/lib/validations/post";

const resend = new Resend(process.env.RESEND_API_KEY!);
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export async function GET(req: NextRequest) {
    const tokenParams = req.nextUrl.searchParams.get("token")
    if (!tokenParams) {
        return NextResponse.json({ message: "Invalid request - missing token" }, { status: 400 });
    }

    try {
        const [decoded, tokenHash] = await Promise.all([
            jwt.verify(tokenParams, process.env.JWT_SECRET!) as Promise<{
                userId: string,
                email: string
            }>,
            crypto.createHash('sha256').update(tokenParams).digest('hex')
        ]);

        const verifyToken = await prisma.verificationToken.findFirst({
            where: {
                tokenHash,
                isValid: true
            },
            select: {
                id: true,
                expiresAt: true
            }
        });

        if (!verifyToken || new Date(Date.now()) > verifyToken.expiresAt) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
        }

        await Promise.all([
            prisma.verificationToken.delete({
                where: { id: verifyToken.id },
            }),
            prisma.user.update({
                where: { id: decoded.userId },
                data: {
                    emailVerified: true,
                    iiumEmail: decoded.email
                },
            })
        ]);

        return NextResponse.json({ message: "Email verified" });

    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized access" }, {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
                'X-Content-Type-Options': 'nosniff'
            }
        });
    }

    try {
        const body = await req.json();
        const validationResult = emailSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json({
                message: validationResult.error.errors[0].message
            }, { status: 400 });
        }

        // check if iiumemail already taken
        const existingUser = await prisma.user.findUnique({
            where: {
                iiumEmail: validationResult.data.email
            },
            cacheStrategy: {
                ttl: 60 * 60 * 24 * 3// 3 day cache
            }
        });

        if (existingUser) {
            return NextResponse.json({ message: "Email already taken" }, { status: 400 });
        }

        // cek current user already verified 
        if (session.user.emailVerified) {
            return NextResponse.json({ message: "Email already verified" }, { status: 400 });
        }

        const rateLimitResult = checkUserAttempt(session.user.id);
        if (rateLimitResult.limited) {
            return NextResponse.json({
                message: rateLimitResult.message,
                count: rateLimitResult.count,
                cooldown: rateLimitResult.cooldown
            }, { status: 429 });
        }

        const token = jwt.sign({
            userId: session.user.id,
            email: validationResult.data.email
        }, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });

        const tokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const expiryDate = new Date(Date.now() + 3600000); // 1 hour

        await prisma.verificationToken.upsert({
            where: {
                userId: session.user.id
            },
            update: {
                tokenHash,
                isValid: true,
                expiresAt: expiryDate,
            },
            create: {
                userId: session.user.id,
                tokenHash,
                expiresAt: expiryDate,
            }
        });

        const emailResult = await resend.emails.send({
            from: "no-reply@kfitri.com",
            to: validationResult.data.email,
            subject: 'Email Verification - Eventure',
            react: EmailTemplate({
                verificationToken: token
            })
        });

        if (emailResult.error) {
            console.error('Email sending error:', emailResult.error);
            return NextResponse.json({
                message: "Failed to send verification email"
            }, { status: 500 });
        }

        return NextResponse.json({
            message: "Verification sent to your email",
            count: rateLimitResult.count,
            cooldown: rateLimitResult.cooldown
        }, {
            status: 201,
            headers: {
                'Cache-Control': 'no-store',
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Verification token creation error:', error);
        return NextResponse.json({
            message: "Internal Server Error"
        }, { status: 500 });
    }
}
function checkUserAttempt(userId: string) {
    const userLimit = rateLimitMap.get(userId);
    const attemptCount = userLimit?.count || 0;

    // max attempt 3
    if (attemptCount >= 3) {
        const twoHoursInMs = 2 * 60 * 60 * 1000;

        // previous attempt & 2hrs not passed
        if (userLimit && Date.now() - userLimit.timestamp < twoHoursInMs) {
            const remainingTime = twoHoursInMs - (Date.now() - userLimit.timestamp);
            return {
                limited: true,
                message: "Too many attempts. Please try again later",
                count: attemptCount,
                cooldown: Math.ceil(remainingTime / 1000)
            };
        }

        // 2hrs passed? reset it
        rateLimitMap.delete(userId);
    } else {
        const timeoutMs = attemptCount > 0 ? attemptCount * 30 * 1000 : 0; // 30s increments
        const lastAttempt = userLimit?.timestamp || 0;
        const timeSinceLastAttempt = Date.now() - lastAttempt;

        if (lastAttempt > 0 && timeSinceLastAttempt < timeoutMs) {
            const waitTimeSeconds = Math.ceil((timeoutMs - timeSinceLastAttempt) / 1000);
            return {
                limited: true,
                message: `Please wait ${waitTimeSeconds} seconds before trying again`,
                cooldown: waitTimeSeconds,
                count: attemptCount
            };
        }
    }

    const newAttemptCount = attemptCount + 1;
    rateLimitMap.set(userId, {
        count: newAttemptCount,
        timestamp: Date.now()
    });

    const timeoutSeconds = newAttemptCount < 3 ? newAttemptCount * 30 : 7200; // 30s increments or 2hrs

    return {
        limited: false,
        count: newAttemptCount,
        cooldown: timeoutSeconds
    };
}