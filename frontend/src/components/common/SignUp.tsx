import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { fetchData, loading } = useFetch();

  const handleSignupSuccess = (data: any) => {
    navigate("/home"); // Redirect upon successful signup
  };

  const handleSignupError = (error: Error) => {
    alert(error.message); // Display error message
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const signupData = {
      username,
      password,
    };

    const signupEndpoint = "https://192.168.88.148:5000/api/register";

    try {
      const data = await fetchData({
        method: "POST",
        endpoint: signupEndpoint,
        body: signupData,
      });
      handleSignupSuccess(data);
    } catch (error) {
      handleSignupError(error as Error);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Signup"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
