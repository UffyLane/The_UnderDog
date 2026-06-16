import { createElement, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";

export default function ProtectedRoute({
  component: Component,
  loggedIn,
  isCheckingAuth = false,
  onUnauthorized,
  ...routeProps
}) {
  useEffect(() => {
    if (!isCheckingAuth && !loggedIn && onUnauthorized) onUnauthorized();
  }, [isCheckingAuth, loggedIn, onUnauthorized]);

  return (
    <Route
      {...routeProps}
      render={(props) => {
        if (isCheckingAuth) return null;
        return loggedIn ? createElement(Component, props) : <Redirect to="/" />;
      }}
    />
  );
}
