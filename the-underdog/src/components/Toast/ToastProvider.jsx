// src/components/Toast/ToastProvider.jsx
import { useCallback, useMemo, useState } from "react";
import "./Toast.css";
import { ToastContext } from "./ToastContext";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    setToasts((prev) => [...prev, { id, message, type }]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast UI */}
      <div className="toast" aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <div key={t.id} className={`toast__item toast__item--${t.type}`}>
            <span className="toast__text">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}