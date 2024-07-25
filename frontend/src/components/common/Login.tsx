import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { User } from "../../models";
import { useAuth } from "../../contexts/AuthContext";

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
    
    navigate("/home");
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
      const loginEndpoint = "https://localhost:5000/api/login";

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
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
