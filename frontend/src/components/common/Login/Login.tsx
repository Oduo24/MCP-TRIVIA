import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import { User } from "../../../models";
import { useAuth } from "../../../contexts/AuthContext";
import { errorToast } from "../../../utility";

function Login() {
  const { setIsAuthenticated, setRole, setUsername, setScore, setAnsweredQuestions, setAnsweredEpisodes } = useAuth();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { fetchData, loading } = useFetch();

  const handleLoginSuccess = (user: User) => {
    setIsAuthenticated(true);
    setRole(user.role);
    setUsername(user.username);
    setScore(user.score);
    setAnsweredQuestions(user.answered_questions);
    // Since answered_episodes is optional, check first if it's available
    if (user.answered_episodes) {
      setAnsweredEpisodes(user.answered_episodes);
    }
    
    
    user.role === "admin" ? navigate("/admin/home") : navigate("/user/home");
  };

  const handleLoginError = (error: Error) => {
    errorToast(error.message);
    navigate("/login");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const loginData = {
        user,
        password,
      };
      const loginEndpoint = "/api/login";

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
    <div className="container-fluid d-flex vh-100">
    <div className="row justify-content-center align-items-center w-100">
        <div className="col-md-4 text-center">
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
