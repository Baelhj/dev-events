"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { Booking } from "@/database/booking.model";
import { Event } from "@/database/event.model";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createBooking = async ({
  slug,
  email,
}: {
  slug: string;
  email: string;
}) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (!slug.trim()) {
    return { success: false, error: "Event slug is required" };
  }

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return { success: false, error: "Please enter a valid email address" };
  }

  try {
    await connectToDatabase();

    const event = await Event.findOne({ slug: slug.trim() }).select("_id").lean();
    if (!event?._id) {
      return { success: false, error: "Event not found" };
    }

    await Booking.create({ eventId: event._id, email: normalizedEmail });

    return { success: true };
  } catch (e) {
    console.error("Error creating booking:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Unknown booking failure",
    };
  }
};
