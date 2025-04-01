import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validUsername = "user";
  const validPassword = "password";

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === validUsername && password === validPassword) {
      navigate("/home"); // Redirect to Home page
    } else {
      setErrorMessage("❌ Invalid username or password.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${require("../components/background.jpg")})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          width: "300px",
          padding: "60px",
          background: "#568265",
          borderRadius: "20px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <img
          src={require("../components/darklogo.png")}
          alt="Logo"
          style={{ width: "250px", marginBottom: "15px" }}
        />
        <h2 style={{ color: "#F2F6EB" }}>User Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: "calc(100% - 20px)",
              padding: "10px",
              margin: "10px 0",
              border: "1px solid #A7BEAE",
              borderRadius: "4px",
              backgroundColor: "#FFFFFF",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "calc(100% - 20px)",
              padding: "10px",
              margin: "10px 0",
              border: "1px solid #A7BEAE",
              borderRadius: "4px",
              backgroundColor: "#FFFFFF",
            }}
          />
          <div style={{ margin: "10px 0", display: "flex", alignItems: "center" }}>
            <input type="checkbox" id="rememberMe" style={{ marginRight: "10px" }} />
            <label htmlFor="rememberMe" style={{ color: "#92C3A4" }}>Remember Me</label>
          </div>
          <button
            type="submit"
            style={{
              background: "#B85042",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Login
          </button>
          {errorMessage && <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>}
        </form>
        <div style={{ marginTop: "15px" }}>
          <p>
            Don't have an account?{" "}
            <a href="/signup" style={{ color: "#F2F6EB", textDecoration: "none" }}>
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
