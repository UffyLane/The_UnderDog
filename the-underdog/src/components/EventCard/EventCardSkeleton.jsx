// src/components/EventCard/EventCardSkeleton.jsx
import "./EventCardSkeleton.css";

export default function EventCardSkeleton() {
  return (
    <li className="event">
      <article className="event-skel">
        <div className="event-skel__top">
          <div className="event-skel__text">
            <div className="event-skel__line event-skel__line_title" />
            <div className="event-skel__line" />
            <div className="event-skel__line event-skel__line_short" />
          </div>

          <div className="event-skel__pill" />
        </div>

        <div className="event-skel__btn" />
      </article>
    </li>
  );
}