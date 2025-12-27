import { NextResponse } from "next/server";
import { getTeachersStats } from "@/lib/firebase/get-requests";

export async function GET() {
  try {
    const stats = await getTeachersStats();

    // Формуємо дані для головної сторінки
    const homeStats = {
      tutorsCount: stats.total,
      reviewsCount: stats.totalReviews,
      subjectsCount: Object.keys(stats.languages || {}).length,
      nationalitiesCount: stats.total, // можна додати окреме поле nationalities в майбутньому
    };

    return NextResponse.json(homeStats);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch stats",
      },
      { status: 500 }
    );
  }
}
