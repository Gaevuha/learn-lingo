import { NextRequest, NextResponse } from "next/server";
import { getAllTeachers } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "0");
    const offset = parseInt(searchParams.get("offset") || "0");
    const language = searchParams.get("language") || "all";
    const level = searchParams.get("level") || "all";
    const price = searchParams.get("price") || "all";

    const { teachers: allTeachers } = await getAllTeachers();
    let teachers = allTeachers;

    // Фільтрація
    if (language !== "all") {
      teachers = teachers.filter((t) => t.languages?.includes(language));
    }
    if (level !== "all") {
      teachers = teachers.filter((t) => t.levels?.includes(level));
    }
    if (price !== "all") {
      const maxPrice = parseInt(price);
      teachers = teachers.filter((t) => t.price_per_hour <= maxPrice);
    }

    const totalCount = teachers.length;
    const paginatedTeachers =
      limit > 0 ? teachers.slice(offset, offset + limit) : teachers;

    return NextResponse.json({ teachers: paginatedTeachers, totalCount });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}
