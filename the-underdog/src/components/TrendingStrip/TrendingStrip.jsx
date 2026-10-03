// src/components/TrendingStrip/TrendingStrip.jsx
import { useEffect, useState } from "react";
import EventCard from "../EventCard/EventCard";
import EventCardSkeleton from "../EventCard/EventCardSkeleton";
import { getTrendingEvents } from "../../utils/api";
import "./TrendingStrip.css";

export default function TrendingStrip({
  loggedIn,
  onRequireAuth,
  isEventSaved,
  onSaveEvent,
  onUnsaveEvent,
  savingKey,
  makeEventKey,
}) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTrendingEvents()
      .then((data) => {
        setEvents(data?._embedded?.events || []);
      })
      .catch(() => {
        // This is a discovery surface on the landing page, not the primary
        // flow — fail quietly rather than greeting a first-time visitor
        // with an error banner before they've done anything.
        setEvents([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (!isLoading && events.length === 0) return null;

  return (
    <section className="trending">
      <div className="trending__header">
        <h2 className="trending__title">Trending in the Midwest</h2>
        <p className="trending__subtitle">
          Shows going on sale and coming up over the next two weeks
        </p>
      </div>

      <ul className="trending__track">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))
          : events.map((eventItem) => {
              const key = makeEventKey(eventItem);
              const isSaved = isEventSaved(eventItem);
              const saving = savingKey === key;

              return (
                <EventCard
                  key={key}
                  eventItem={eventItem}
                  loggedIn={loggedIn}
                  isSaved={isSaved}
                  saving={saving}
                  onSave={onSaveEvent}
                  onUnsave={onUnsaveEvent}
                  onRequireAuth={onRequireAuth}
                />
              );
            })}
      </ul>
    </section>
  );
}
