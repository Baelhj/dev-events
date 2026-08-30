import { Suspense } from "react";
import EventDetails from "@/components/EventDetails";

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  return (
    <main>
      <Suspense fallback={<p>Loading event details...</p>}>
        <EventDetails params={params} />
      </Suspense>
    </main>
  );
};

export default EventDetailsPage;
