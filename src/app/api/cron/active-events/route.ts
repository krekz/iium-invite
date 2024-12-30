import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {

  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await prisma.event.updateMany({
      where: {
        OR: [
          {
            registrationEndDate: { lte: new Date() },
            isActive: true,
          },
          {
            date: { lte: new Date() },
            isActive: true,
          }
        ],
      },
      data: {
        isActive: false,
      }
    })
    revalidatePath('/')
    revalidatePath('/discover')
    revalidatePath('/account?option=bookmarks')
    revalidatePath('/account?option=posts')
    return new Response('Cron job ran successfully');
  } catch (error) {
    console.error('Error updating events', error);
    return new Response('Error updating events', { status: 500 });
  }

}