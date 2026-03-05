import "./ErrorBanner.css";

export default function ErrorBanner({ message }) {
  return (
    <div className="error" role="alert">
      {message}
    </div>
  );
}
