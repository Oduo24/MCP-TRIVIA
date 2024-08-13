import {
  BrowserRouter as Router,
  Routes,
  Route,
  RouteObject,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AuthGuard from "./AuthGuard";
import { adminRoutes, userRoutes, commonRoutes } from "./routes";
import Header from "./components/user/Header/Header";
import Footer from "./components/user/Footer/Footer";


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
  const { username, isAuthenticated, role } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Common Routes No authentication required */}
        {renderRoutes(commonRoutes)}
        {/* Admin Routes */}
        <Route
          element={
            <AuthGuard
              isAuthenticated={isAuthenticated}
              role={role}
              requiredRole="admin">
                <Header isAuthenticated={isAuthenticated} role={role} username={username} />
            </AuthGuard>
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
              requiredRole="member">
                <Header isAuthenticated={isAuthenticated} role={role} username={username} />
            </AuthGuard>

          }
        >
          {renderRoutes(userRoutes)}
        </Route>
      </Routes>
      <Footer/>
    </Router>
  );
};
export default App;
