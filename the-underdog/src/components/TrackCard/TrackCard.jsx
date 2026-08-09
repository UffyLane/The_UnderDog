// src/components/TrackCard/TrackCard.jsx
import "./TrackCard.css";

const formatDuration = (ms) => {
  if (!ms && ms !== 0) return "";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const sourceLabel = {
  soundcloud: "SoundCloud",
  tidal: "TIDAL",
};

export default function TrackCard({ track }) {
  const title = track?.title || "Untitled track";
  const artist = track?.artist || "Unknown artist";
  const artworkUrl = track?.artworkUrl;
  const trackUrl = track?.trackUrl;
  const duration = formatDuration(track?.duration);
  const source = sourceLabel[track?.source] || track?.source;

  return (
    <li className="track">
      <article className="track__card">
        <div className="track__top">
          {artworkUrl ? (
            <img
              className="track__art"
              src={artworkUrl}
              alt=""
              loading="lazy"
            />
          ) : (
            <div className="track__art track__art_placeholder" aria-hidden="true" />
          )}

          <div className="track__text">
            <h3 className="track__title" title={title}>
              {title}
            </h3>
            <p className="track__meta">{artist}</p>
            {duration && <p className="track__meta track__meta_muted">{duration}</p>}
          </div>
        </div>

        {trackUrl && (
          <a
            className="track__link"
            href={trackUrl}
            target="_blank"
            rel="noreferrer"
          >
            Listen on {source} ↗
          </a>
        )}
      </article>
    </li>
  );
}
