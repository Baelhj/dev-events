import { model, models, Schema, Types, type HydratedDocument } from "mongoose";

import { Event } from "./event.model";

export interface Booking {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingDocument = HydratedDocument<Booking>;

const bookingSchema = new Schema<Booking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },
  { timestamps: true },
);

bookingSchema.index({ eventId: 1 });

bookingSchema.pre("save", async function (this: BookingDocument) {
  // Confirm the referenced event exists before persisting the booking.
  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    throw new Error("Cannot create booking: event does not exist");
  }
});

export const Booking =
  models.Booking ?? model<Booking>("Booking", bookingSchema);
