import "./Modal.css";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  const handleOverlay = () => onClose();
  const handleContent = (e) => e.stopPropagation();

  return (
    <div className="modal" role="dialog" aria-modal="true" onClick={handleOverlay}>
      <div className="modal__content" onClick={handleContent}>
        <button className="modal__close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>

        {title && <h2 className="modal__title">{title}</h2>}

        {children}
      </div>
    </div>
  );
}