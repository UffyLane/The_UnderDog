// src/components/EventList/EventList.jsx
import EventCard from "../EventCard/EventCard";
import "./EventList.css";

export default function EventList({
  events,
  loggedIn,
  onRequireAuth,

  // saved-events
  isEventSaved,
  onSaveEvent,
  onUnsaveEvent,

  // saving UI
  savingKey,
  makeEventKey,
}) {
  return (
    <ul className="event-list">
      {events.map((eventItem) => {
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
  );
}