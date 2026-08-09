// src/components/TrackList/TrackList.jsx
import TrackCard from "../TrackCard/TrackCard";
import "./TrackList.css";

export default function TrackList({ tracks }) {
  return (
    <ul className="track-list">
      {tracks.map((track) => (
        <TrackCard
          key={`${track.source}-${track.externalId}`}
          track={track}
        />
      ))}
    </ul>
  );
}
