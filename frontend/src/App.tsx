import {
  BrowserRouter as Router,
  Routes,
  Route,
  RouteObject,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AuthGuard from "./AuthGuard";
import { adminRoutes, userRoutes, commonRoutes } from "./routes";

const renderRoutes = (routes: RouteObject[]) =>
  routes.map(({ path, element }, index) => (
    <Route key={index} path={path} element={element} />
  ));

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AuthGuardWrapper />
    </AuthProvider>
  );
};

const AuthGuardWrapper: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route
          element={
            <AuthGuard
              isAuthenticated={isAuthenticated}
              role={role}
              requiredRole="admin"
            />
          }
        >
          {renderRoutes(adminRoutes)}
        </Route>
        {/* User Routes */}
        <Route
          element={
            <AuthGuard
              isAuthenticated={isAuthenticated}
              role={role}
              requiredRole="member"
            />
          }
        >
          {renderRoutes(userRoutes)}
        </Route>
        {/* Common Routes */}
        {renderRoutes(commonRoutes)}
      </Routes>
    </Router>
  );
};

export default App;
