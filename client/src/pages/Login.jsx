import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Design/Login.css";

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        name,
        password,
      });

      console.log("Login Response:", response.data);

      localStorage.setItem("token", response.data.accessToken);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Left Side - Image Section */}
        <div className="login-left">
          <div className="login-left-content">
            <h2>Capture Your Journeys</h2>
            <p>Record your travel experiences and memories in your personal travel journal.</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-right">
          <h2 className="login-title">Login</h2>

          {error && <p className="login-error">{error}</p>}

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                className="login-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="login-button">
              LOGIN
            </button>
          </form>

          <div className="create-account">
            <p>Don't have an account?</p>
            <button className="create-account-link" onClick={() => navigate("/Register")}>
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
