"use client";

import { useState } from "react";
import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";

const BookEvent = ({ slug }: { slug: string }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await createBooking({ slug, email });

      if (result?.success) {
        setSubmitted(true);
        posthog.capture("event_booked", { slug, email });
        return;
      }

      const message = result?.error ?? "Unable to create booking. Please try again.";
      setErrorMessage(message);
      console.error("Error creating booking:", message);
      posthog.captureException(message, { slug, email });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create booking. Please try again.";
      setErrorMessage(message);
      console.error("Error creating booking:", error);
      posthog.captureException(error, { slug, email });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for sining up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={isSubmitting}
            />

            {errorMessage ? (
              <p className="text-sm text-red-400" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              className="button-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
