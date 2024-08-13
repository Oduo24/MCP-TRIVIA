import { RouteObject } from "react-router-dom";
import Login from "./components/common/Login/Login";
import Home from "./components/user/Home/Home";
import Trivia from "./components/user/Trivia/Trivia";
import AdminDashboard from "./components/admin/AdminDashboard";
import NotFound from "./components/common/NotFound";
import LeaderBoard from "./components/user/LeaderBoard/LeaderBoard";
import FirstVisit from "./components/common/FirstVisit";
import Account from "./components/user/Account/Account";


export const adminRoutes: RouteObject[] = [
  { path: "/admin/home", element: <AdminDashboard /> },
  { path: "/admin/dashboard", element: <AdminDashboard /> },

];

export const userRoutes: RouteObject[] = [
  { path: "/user/home", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/trivia", element: <Trivia /> },
  { path: "/scores", element: <LeaderBoard /> },
  { path: "/user/account", element: <Account /> },
];

export const commonRoutes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/first_try", element: <FirstVisit /> },
  { path: "/login", element: <Login /> },
  { path: "*", element: <NotFound /> },
];
