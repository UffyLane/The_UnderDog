// src/components/EventCard/EventCard.jsx
import "./EventCard.css";

export default function EventCard({
  eventItem,
  loggedIn,
  isSaved,
  saving,
  onSave,
  onUnsave,
  onRequireAuth,
}) {
  const name = eventItem?.name || "";
  const date = eventItem?.dates?.start?.localDate || "";

  const venue = eventItem?._embedded?.venues?.[0]?.name || "";
  const city = eventItem?._embedded?.venues?.[0]?.city?.name || "";
  const state = eventItem?._embedded?.venues?.[0]?.state?.stateCode || "";

  const ticketUrl = eventItem?.url;

  const handleSaveClick = () => {
    if (!loggedIn) {
      onRequireAuth?.();
      return;
    }

    if (saving) return;

    if (isSaved) onUnsave(eventItem);
    else onSave(eventItem);
  };

  return (
    <li className="event">
      <article className={`event__card ${saving ? "event__card_saving" : ""}`}>
        <div className="event__top">
          <div className="event__text">
            <h2 className="event__title" title={name}>
              {name}
            </h2>

            <p className="event__meta">
              {date ? `${date} — ` : ""}
              {venue}
            </p>

            <p className="event__meta">
              {city}
              {city && state ? ", " : ""}
              {state}
            </p>
          </div>

          <button
            type="button"
            className={`event__save ${isSaved ? "event__save_saved" : ""}`}
            onClick={handleSaveClick}
            disabled={saving}
            aria-pressed={isSaved}
            title={!loggedIn ? "Sign in to save events" : isSaved ? "Unsave" : "Save"}
          >
            {saving ? "..." : isSaved ? "Saved" : "Save"}
          </button>
        </div>

        {ticketUrl && (
          <a
            className="event__link"
            href={ticketUrl}
            target="_blank"
            rel="noreferrer"
          >
            View Tickets
          </a>
        )}
      </article>
    </li>
  );
}