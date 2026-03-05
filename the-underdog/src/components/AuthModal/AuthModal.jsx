// src/components/AuthModal/AuthModal.jsx
import { useState } from "react";
import Modal from "../Modal/Modal";
import "./AuthModal.css";

export default function AuthModal({
  isOpen,
  mode, // "signin" | "signup"
  onClose,
  onSwitchMode,
  onSubmit,
  errorMessage,
  successMessage,
  isSubmitting,
}) {
  const isSignup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSwitchMode = () => {
    resetForm();
    onSwitchMode();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = isSignup ? { name, email, password } : { email, password };
    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isSignup ? "Sign up" : "Sign in"}
    >
      <form className="auth" onSubmit={handleSubmit}>
        {isSignup && (
          <label className="auth__field">
            <span className="auth__label">Name</span>
            <input
              className="auth__input"
              required
              minLength={2}
              maxLength={30}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </label>
        )}

        <label className="auth__field">
          <span className="auth__label">Email</span>
          <input
            className="auth__input"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
          />
        </label>

        <label className="auth__field">
          <span className="auth__label">Password</span>
          <input
            className="auth__input"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            minLength={6}
          />
        </label>

        {/* ✅ SUCCESS ABOVE ERROR */}
        {successMessage && (
          <div className="auth__success">{successMessage}</div>
        )}
        {errorMessage && <div className="auth__error">{errorMessage}</div>}

        <button
          className="auth__switch"
          type="button"
          onClick={handleSwitchMode}
          disabled={isSubmitting}
        >
          {isSignup
            ? "Already have an account? Sign in"
            : "Need an account? Sign up"}
        </button>

        <button className="auth__submit" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isSignup
              ? "Creating..."
              : "Signing in..."
            : isSignup
            ? "Create account"
            : "Sign in"}
        </button>
      </form>
    </Modal>
  );
}