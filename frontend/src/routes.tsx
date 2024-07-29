import { RouteObject } from "react-router-dom";
import Signup from "./components/common/SignUp";
import Login from "./components/common/Login/Login";
import Home from "./components/user/Home/Home";
import Index from "./components/user/Index/Index";
import Trivia from "./components/user/Trivia/Trivia";
import AdminDashboard from "./components/admin/AdminDashboard";
import NotFound from "./components/common/NotFound";
import LeaderBoard from "./components/user/LeaderBoard/LeaderBoard";
import Header from "./components/user/Header/Header";

export const adminRoutes: RouteObject[] = [
  { path: "/", element: <AdminDashboard /> },
];

export const userRoutes: RouteObject[] = [
  { path: "/home", element: <Home /> },
  { path: "/", element: <Index /> },
  { path: "/trivia", element: <Trivia /> },
  { path: "/scores", element: <LeaderBoard /> },
  { path: "/header", element: <Header /> },
  { path: "/footer", element: <Header /> },
];

export const commonRoutes: RouteObject[] = [
  { path: "/login", element: <Login /> },
  { path: "*", element: <NotFound /> },
  { path: "/signup", element: <Signup /> },
];
