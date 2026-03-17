import { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";

export default function ProtectedRoute({
  component,
  loggedIn,
  onUnauthorized,
  ...routeProps
}) {
  useEffect(() => {
    if (!loggedIn && onUnauthorized) onUnauthorized();
  }, [loggedIn, onUnauthorized]);

  return (
    <Route
      {...routeProps}
      component={component}
      render={(props) => (loggedIn ? <component {...props} /> : <Redirect to="/" />)}
    />
  );
}