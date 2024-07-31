import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import { User } from "../../../models";
import { useAuth } from "../../../contexts/AuthContext";

import "./login.css";


function Login() {
  const { setIsAuthenticated, setRole, setUsername, setScore } = useAuth();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { fetchData, loading } = useFetch();

  const handleLoginSuccess = (user: User) => {
    setIsAuthenticated(true);
    setRole(user.role);
    setUsername(user.username);
    setScore(user.score);
    
    user.role === "admin" ? navigate("/admin/home") : navigate("/user/home");
  };

  const handleLoginError = (error: Error) => {
    alert(error.message);
    navigate("/login");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const loginData = {
        user,
        password,
      };
      const loginEndpoint = "https://192.168.88.148:5000/api/login";

      const login_response = await fetchData({
        method: "POST",
        endpoint: loginEndpoint,
        body: loginData,
      });
      handleLoginSuccess(login_response);
    } catch (error) {
      handleLoginError(error as Error);
    }
  };

  return (
    <div className="container-fluid full-page-container">
        <div className="row justify-content-center align-items-center full-page-row">
            <div className="col-md-4">
                <h1 className="text-center text-white">POD TRIVIA</h1>
                <h2 className="text-center text-white">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group text-white mb-3">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            className="form-control login-input"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            id="username"
                            placeholder="Enter username"
                            required
                        />
                    </div>
                    <div className="form-group text-white mb-3">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control login-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <div className="text-center">
                      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? "loading..." : "Login"}
                      </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}

export default Login;
