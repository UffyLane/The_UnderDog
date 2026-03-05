import "./Profile.css";
import { useContext, useMemo } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function Profile({ savedEvents = [], onDeleteSavedEvent }) {
  const currentUser = useContext(CurrentUserContext);

  const memberSince = useMemo(() => {
    const raw = currentUser?.createdAt;
    if (!raw) return "—";

    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return "—";

    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [currentUser]);

  return (
    <section className="profile">
      <header className="profile__header">
        <div className="profile__heading">
          <h1 className="profile__title">Profile</h1>

          <p className="profile__subtitle">
            Welcome{currentUser?.name ? `, ${currentUser.name}` : ""}.
          </p>
        </div>

        <div className="profile__stats" aria-label="Profile stats">
          <div className="profile__stat">
            <div className="profile__stat-value">{savedEvents.length}</div>
            <div className="profile__stat-label">Saved events</div>
          </div>

          <div className="profile__stat">
            <div className="profile__stat-value">{memberSince}</div>
            <div className="profile__stat-label">Member since</div>
          </div>
        </div>
      </header>

      <div className="profile__panel">
        <h2 className="profile__section-title">Your saved events</h2>

        {savedEvents.length === 0 ? (
          <p className="profile__empty">
            You haven’t saved anything yet. Go to Home and tap “Save” on an event.
          </p>
        ) : (
          <ul className="profile__list">
            {savedEvents.map((item) => (
              <li className="profile__item" key={item._id}>
                <div className="profile__item-main">
                  <h3 className="profile__item-title">{item.name}</h3>

                  <p className="profile__item-meta">
                    {item.date} — {item.venue}
                  </p>

                  <p className="profile__item-meta">
                    {item.city}, {item.state}
                  </p>

                  {item.url && (
                    <a
                      className="profile__item-link"
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View tickets
                    </a>
                  )}
                </div>

                {onDeleteSavedEvent && (
                  <button
                    type="button"
                    className="profile__delete"
                    onClick={() => onDeleteSavedEvent(item._id)}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}