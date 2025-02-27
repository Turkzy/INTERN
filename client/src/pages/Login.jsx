import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/login", {
        name,
        password,
      });

      localStorage.setItem("token", response.data.accessToken);
      navigate("/"); 
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white shadow-lg rounded-lg p-6 flex w-full max-w-4xl">
        {/* Left Side */}
        <div className="w-1/2 bg-cover bg-center rounded-l-lg" style={{ backgroundImage: "url('/your-image.jpg')" }}>
          <div className="p-6 text-white">
            <h2 className="text-3xl font-bold">Capture Your Journeys</h2>
            <p>Record your travel experiences and memories in your personal travel journal.</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>

          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-600">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">
              LOGIN
            </button>
          </form>

          <div className="text-center mt-4">
            <p>Don't have an account?</p>
            <button
              className="text-blue-500 underline"
              onClick={() => navigate("/Register")}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
