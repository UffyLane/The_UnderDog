// src/pages/Home/Home.jsx
import SearchForm from "../../components/SearchForm/SearchForm";
import EventList from "../../components/EventList/EventList";
import ErrorBanner from "../../components/ErrorBanner/ErrorBanner";
import EventCardSkeleton from "../../components/EventCard/EventCardSkeleton";
import "./Home.css";

export default function Home({
  onSearch,
  isLoading,
  errorMessage,
  events,
  artistName,

  isEventSaved,
  onSaveEvent,
  onUnsaveEvent,
  loggedIn,
  onRequireAuth,
  savingKey,
  makeEventKey,
}) {
  const showEmpty =
    artistName &&
    !isLoading &&
    !errorMessage &&
    Array.isArray(events) &&
    events.length === 0;

  const showResultsHeader =
    artistName && !isLoading && !errorMessage && Array.isArray(events);

  return (
    <section className="home">
      <div className="home__hero" role="presentation">
        <div className="home__hero-inner">
          <h1 className="home__title">The UnderDog</h1>
          <p className="home__subtitle">
            Find Midwest shows for the artists you love.
          </p>
        </div>
      </div>

      <div className="home__panel">
        <div className="home__search-sticky">
          <SearchForm onSearch={onSearch} />
        </div>

        {errorMessage && <ErrorBanner message={errorMessage} />}

        {isLoading && (
          <ul className="event-list">
            {Array.from({ length: 4 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </ul>
        )}

        {!isLoading && showEmpty && (
          <p className="home__empty">
            No upcoming Midwest events found for{" "}
            <span className="home__artist">{artistName}</span>.
          </p>
        )}

        {!isLoading && showResultsHeader && events.length > 0 && (
          <div className="home__results">
            <h2 className="home__results-title">Midwest results</h2>
            <p className="home__results-subtitle">
              Showing events for{" "}
              <span className="home__artist">{artistName}</span>
            </p>
          </div>
        )}

        {!isLoading && !errorMessage && events.length > 0 && (
          <EventList
            events={events}
            loggedIn={loggedIn}
            onRequireAuth={onRequireAuth}
            isEventSaved={isEventSaved}
            onSaveEvent={onSaveEvent}
            onUnsaveEvent={onUnsaveEvent}
            savingKey={savingKey}
            makeEventKey={makeEventKey}
          />
        )}
      </div>
    </section>
  );
}