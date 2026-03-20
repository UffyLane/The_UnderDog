import { NavLink } from "react-router-dom";
import dogLogo from "../../assets/icons/under-dog-logo.png";
import "./Header.css";

export default function Header({
  loggedIn,
  onSignIn,
  onSignUp,
  onSignOut,
}) {
  return (
    <header className="header">
      <div className="header__inner">
        <NavLink className="header__brand" to="/">
          <img
            className="header__logo"
            src={dogLogo}
            alt="The UnderDog logo"
          />
          <span className="header__brand-text">The UnderDog</span>
        </NavLink>

        <nav className="header__nav" aria-label="Primary">
  <NavLink className="header__link" to="/">
    Home
  </NavLink>

  <NavLink className="header__link" to="/profile">
    Profile
  </NavLink>

  {!loggedIn ? (
    <div className="header__auth">
      <button className="header__btn header__btn--ghost" type="button" onClick={onSignIn}>
        Sign in
      </button>
      <button className="header__btn header__btn--primary" type="button" onClick={onSignUp}>
        Sign up
      </button>
    </div>
  ) : (
    <button className="header__btn header__btn--ghost" type="button" onClick={onSignOut}>
      Log out
    </button>
  )}
</nav>
      </div>
    </header>
  );
}