import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

export async function GET(request: NextRequest) {
  const secretKey = process.env.CRON_SECRET_KEY;
  const providedKey = request.nextUrl.searchParams.get('key');

  if (!providedKey || providedKey !== secretKey) {
    return new Response("Nice try", { status: 401 });
  }

  try {
    await prisma.event.updateMany({
      where: {
        OR: [
          {
            registrationEndDate: { lte: new Date() },
            active: true,
          },
          {
            date: { lte: new Date() },
            active: true,
          }
        ],
      },
      data: {
        active: false,
      }
    })
    console.log('Cron job ran successfully');
    return new Response('Cron job ran successfully');
  } catch (error) {
    console.error('Error updating events', error);
    return new Response('Error updating events', { status: 500 });
  }

}