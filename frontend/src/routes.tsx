import { RouteObject } from "react-router-dom";
import Signup from "./components/common/SignUp";
import Login from "./components/common/Login";
import Home from "./components/user/Home";
import Index from "./components/user/Index";
import Trivia from "./components/user/Trivia";
import AdminDashboard from "./components/admin/AdminDashboard";
import NewQuestion from "./components/admin/NewQuestion";
import NotFound from "./components/common/NotFound";
import LeaderBoard from "./components/user/LeaderBoard";

export const adminRoutes: RouteObject[] = [
  { path: "admin", element: <AdminDashboard /> },
  { path: "add_new_question", element: <NewQuestion /> },
];

export const userRoutes: RouteObject[] = [
  { path: "/home", element: <Home /> },
  { path: "/", element: <Index /> },
  { path: "/trivia", element: <Trivia /> },
  { path: "/scores", element: <LeaderBoard /> }
];

export const commonRoutes: RouteObject[] = [
  { path: "/login", element: <Login /> },
  { path: "*", element: <NotFound /> },
  { path: "/signup", element: <Signup /> },
];
