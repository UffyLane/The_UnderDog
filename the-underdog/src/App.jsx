import { useCallback, useEffect, useMemo, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AuthModal from "./components/AuthModal/AuthModal";

import { ToastProvider} from "./components/Toast/ToastProvider";
import { useToast } from "./components/Toast/ToastContext";
import { searchEvents } from "./utils/api";
import { MIDWEST_STATES } from "./utils/constants";

import CurrentUserContext from "./contexts/CurrentUserContext";
import { signup, signin, checkToken } from "./utils/auth";

import { getSavedEvents, saveEvent, deleteSavedEvent } from "./utils/apiClient";

function AppInner() {
  const history = useHistory();
  const { showToast } = useToast();

  // ===== Stage 1 search =====
  const [artistName, setArtistName] = useState("");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ===== Auth =====
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

  // ===== Saved events =====
  const [savedEvents, setSavedEvents] = useState([]);
  const [savingKey, setSavingKey] = useState(""); // track which event is saving

  const midwestEvents = useMemo(() => {
    return events.filter((eventItem) => {
      const stateCode = eventItem?._embedded?.venues?.[0]?.state?.stateCode;
      return stateCode && MIDWEST_STATES.includes(stateCode);
    });
  }, [events]);

  const handleSearch = (searchValue) => {
    setArtistName(searchValue);

    if (!searchValue) {
      setEvents([]);
      setIsLoading(false);
      setErrorMessage("");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
  };

  useEffect(() => {
    if (!artistName) return;

    searchEvents(artistName)
      .then((data) => {
        const eventResults = data?._embedded?.events || [];
        setEvents(eventResults);
      })
      .catch(() => {
        setEvents([]);
        setErrorMessage("Could not load events. Try again.");
      })
      .finally(() => setIsLoading(false));
  }, [artistName]);

  // ===== Helpers =====
  const openSignin = useCallback(() => {
    setAuthMode("signin");
    setAuthError("");
    setAuthSuccess("");
    setIsAuthOpen(true);
  }, []);

  const openSignup = useCallback(() => {
    setAuthMode("signup");
    setAuthError("");
    setAuthSuccess("");
    setIsAuthOpen(true);
  }, []);

  const closeAuth = () => {
    setIsAuthOpen(false);
    setAuthError("");
    setAuthSuccess("");
  };

  const handleUnauthorized = useCallback(() => {
    openSignin();
  }, [openSignin]);

  // Create a stable “key” so we can match Ticketmaster events to saved items
  const makeEventKey = (obj) => {
    const url = obj?.url || "";
    const name = obj?.name || "";
    const date = obj?.dates?.start?.localDate || obj?.date || "";
    const venue = obj?._embedded?.venues?.[0]?.name || obj?.venue || "";
    return url || `${name}|${date}|${venue}`;
  };

  const isEventSaved = (eventItem) => {
    const key = makeEventKey(eventItem);
    return savedEvents.some((s) => makeEventKey(s) === key);
  };

  const getSavedIdForEvent = (eventItem) => {
    const key = makeEventKey(eventItem);
    const found = savedEvents.find((s) => makeEventKey(s) === key);
    return found?._id;
  };

  // ===== Load JWT from localStorage + validate via server =====
  useEffect(() => {
    const stored = localStorage.getItem("jwt");
    if (!stored) return;

    checkToken(stored)
      .then((user) => {
        setCurrentUser(user);
        setLoggedIn(true);
        return getSavedEvents();
      })
      .then((items) => setSavedEvents(items))
      .catch(() => {
        localStorage.removeItem("jwt");
        setCurrentUser(null);
        setLoggedIn(false);
        setSavedEvents([]);
      });
  }, []);

  // ===== Auth submit =====
  const handleAuthSubmit = (formData) => {
    setAuthError("");
    setAuthSuccess("");
    setIsAuthSubmitting(true);

    if (authMode === "signup") {
      signup(formData)
        .then(() => {
          setAuthMode("signin");
          setAuthSuccess("Registered! Please sign in.");
          showToast("Account created. Sign in now.", "success");
        })
        .catch((err) => {
          setAuthError(err.message || "Signup failed");
          showToast("Signup failed.", "error");
        })
        .finally(() => setIsAuthSubmitting(false));
      return;
    }

    signin(formData)
      .then((data) => {
        localStorage.setItem("jwt", data.token);
        return checkToken(data.token);
      })
      .then((user) => {
        setCurrentUser(user);
        setLoggedIn(true);
        showToast("Signed in.", "success");
        return getSavedEvents();
      })
      .then((items) => {
        setSavedEvents(items);
        closeAuth();
      })
      .catch((err) => {
        setAuthError(err.message || "Signin failed");
        showToast("Signin failed.", "error");
      })
      .finally(() => setIsAuthSubmitting(false));
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setLoggedIn(false);
    setSavedEvents([]);
    history.push("/");
    showToast("Signed out.", "info");
  };

  // ===== Save/Unsave =====
  const onSaveEvent = (eventItem) => {
    const key = makeEventKey(eventItem);
    setSavingKey(key);

    const payload = {
      name: eventItem?.name || "",
      date: eventItem?.dates?.start?.localDate || "",
      venue: eventItem?._embedded?.venues?.[0]?.name || "",
      city: eventItem?._embedded?.venues?.[0]?.city?.name || "",
      state: eventItem?._embedded?.venues?.[0]?.state?.stateCode || "",
      url: eventItem?.url || "",
    };

    saveEvent(payload)
      .then((created) => {
        setSavedEvents((prev) => [created, ...prev]);
        showToast("Saved event.", "success");
      })
      .catch((err) => {
        console.log(err);
        showToast("Could not save event.", "error");
      })
      .finally(() => setSavingKey(""));
  };

  const onUnsaveEvent = (eventItem) => {
    const savedId = getSavedIdForEvent(eventItem);
    if (!savedId) return;

    const key = makeEventKey(eventItem);
    setSavingKey(key);

    deleteSavedEvent(savedId)
      .then(() => {
        setSavedEvents((prev) => prev.filter((i) => i._id !== savedId));
        showToast("Removed from saved.", "info");
      })
      .catch((err) => {
        console.log(err);
        showToast("Could not remove.", "error");
      })
      .finally(() => setSavingKey(""));
  };

  const onDeleteSavedEvent = (id) => {
    deleteSavedEvent(id)
      .then(() => {
        setSavedEvents((prev) => prev.filter((i) => i._id !== id));
        showToast("Deleted saved event.", "info");
      })
      .catch((err) => {
        console.log(err);
        showToast("Delete failed.", "error");
      });
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          loggedIn={loggedIn}
          onSignIn={openSignin}
          onSignUp={openSignup}
          onSignOut={handleSignOut}
        />

        <main className="page__content">
          <Switch>
            <Route exact path="/">
              <Home
                onSearch={handleSearch}
                isLoading={isLoading}
                errorMessage={errorMessage}
                events={midwestEvents}
                artistName={artistName}
                loggedIn={loggedIn}
                onRequireAuth={openSignin}
                isEventSaved={isEventSaved}
                onSaveEvent={onSaveEvent}
                onUnsaveEvent={onUnsaveEvent}
                savingKey={savingKey}
                makeEventKey={makeEventKey}
              />
            </Route>

            <ProtectedRoute
              path="/profile"
              loggedIn={loggedIn}
              onUnauthorized={handleUnauthorized}
              component={() => (
                <Profile
                  savedEvents={savedEvents}
                  onDeleteSavedEvent={onDeleteSavedEvent}
                />
              )}
            />
          </Switch>
        </main>

        <Footer />

        <AuthModal
          isOpen={isAuthOpen}
          mode={authMode}
          onClose={closeAuth}
          onSwitchMode={() => setAuthMode((m) => (m === "signin" ? "signup" : "signin"))}
          onSubmit={handleAuthSubmit}
          errorMessage={authError}
          successMessage={authSuccess}
          isSubmitting={isAuthSubmitting}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}