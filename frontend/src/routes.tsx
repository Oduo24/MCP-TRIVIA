import { RouteObject } from "react-router-dom";
import Signup from "./components/common/SignUp";
import Login from "./components/common/Login/Login";
import Home from "./components/user/Home/Home";
import Trivia from "./components/user/Trivia/Trivia";
import AdminDashboard from "./components/admin/AdminDashboard";
import NotFound from "./components/common/NotFound";
import LeaderBoard from "./components/user/LeaderBoard/LeaderBoard";
import Header from "./components/user/Header/Header";

export const adminRoutes: RouteObject[] = [
  { path: "/admin/home", element: <AdminDashboard /> },
  { path: "/admin/dashboard", element: <AdminDashboard /> },
  { path: "/", element: <Login /> },
];

export const userRoutes: RouteObject[] = [
  { path: "/user/home", element: <Home /> },
  { path: "/", element: <Login /> },
  { path: "/trivia", element: <Trivia /> },
  { path: "/scores", element: <LeaderBoard /> },
];

export const commonRoutes: RouteObject[] = [
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "*", element: <NotFound /> },
];
