import { NextResponse } from "next/server";

import { Event } from "@/database/event.model";
import { connectToDatabase } from "@/lib/mongodb";

interface EventRouteContext {
  params: Promise<{ slug?: string }>;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET(_request: Request, context: EventRouteContext) {
  const { slug } = await context.params;

  if (!slug || !SLUG_PATTERN.test(slug)) {
    return NextResponse.json(
      { message: "A valid event slug is required" },
      { status: 400 },
    );
  }

  try {
    await connectToDatabase();

    const event = await Event.findOne({ slug }).lean();

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Event fetched successfully", event },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error fetching event:", error);

    return NextResponse.json(
      { message: "Failed to fetch event" },
      { status: 500 },
    );
  }
}
