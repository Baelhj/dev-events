import { model, models, Schema, type HydratedDocument } from "mongoose";

export interface Event {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type EventDocument = HydratedDocument<Event>;

const nonEmptyString = (value: string): boolean => value.trim().length > 0;

const toSlug = (title: string): string =>
  title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeDate = (value: string): string => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Event date must be a valid date");
  }

  return parsedDate.toISOString();
};

const normalizeTime = (value: string): string => {
  const time = value.trim().toUpperCase();
  const match = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/.exec(time);

  if (!match) {
    throw new Error("Event time must be in HH:mm or h:mm AM/PM format");
  }

  const [, hourText, minuteText = "00", meridiem] = match;
  let hour = Number(hourText);
  const minute = Number(minuteText);

  if (minute > 59) {
    throw new Error("Event time contains an invalid minute");
  }

  if (meridiem) {
    if (hour < 1 || hour > 12) {
      throw new Error("Event time contains an invalid hour");
    }
    hour = (hour % 12) + (meridiem === "PM" ? 12 : 0);
  } else if (hour > 23) {
    throw new Error("Event time contains an invalid hour");
  }

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const eventSchema = new Schema<Event>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: { type: [String], required: true },
    organizer: { type: String, required: true, trim: true },
    tags: { type: [String], required: true },
  },
  { timestamps: true },
);

eventSchema.index({ slug: 1 }, { unique: true });

eventSchema.pre("save", function (this: EventDocument) {
  const requiredStrings: Array<
    keyof Pick<
      Event,
      | "title"
      | "description"
      | "overview"
      | "image"
      | "venue"
      | "location"
      | "date"
      | "time"
      | "mode"
      | "audience"
      | "organizer"
    >
  > = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "date",
    "time",
    "mode",
    "audience",
    "organizer",
  ];

  for (const field of requiredStrings) {
    if (!nonEmptyString(this[field])) {
      throw new Error(`Event ${field} is required and cannot be empty`);
    }
  }

  if (
    this.agenda.length === 0 ||
    this.agenda.some((item) => !nonEmptyString(item))
  ) {
    throw new Error("Event agenda must contain non-empty items");
  }

  if (
    this.tags.length === 0 ||
    this.tags.some((item) => !nonEmptyString(item))
  ) {
    throw new Error("Event tags must contain non-empty items");
  }

  // Generate a new slug only for new events or when the title changes.
  if (this.isNew || this.isModified("title")) {
    const slug = toSlug(this.title);
    if (!slug) {
      throw new Error("Event title must produce a valid slug");
    }
    this.slug = slug;
  }

  // Store dates as ISO strings and times as 24-hour HH:mm values.
  this.date = normalizeDate(this.date);
  this.time = normalizeTime(this.time);
});

export const Event = models.Event ?? model<Event>("Event", eventSchema);
