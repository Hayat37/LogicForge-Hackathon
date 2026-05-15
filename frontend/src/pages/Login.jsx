import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });
  const [spinning, setSpinning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("light-mode", !darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    return () => document.body.classList.remove("light-mode");
  }, [darkMode]);

  const handleThemeToggle = () => {
    setSpinning(true);
    setDarkMode(prev => !prev);
    setTimeout(() => setSpinning(false), 400);
  };

  const loginUser = async () => {
    if (!email || !password) {
      setMessage("Please fill in all fields");
      return;
    }
    const res = await fetch("http://localhost/LogicForge-Hackathon/backend/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      navigate("/dashboard");
    } else {
      setMessage(data.error || "Login failed");
    }
  };

  return (
    <>
      <button
        className={`theme-toggle ${spinning ? "spin" : ""}`}
        onClick={handleThemeToggle}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
      <div className="container">
        <div className="logo">SkillSwap</div>
        <h2>Welcome Back</h2>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={loginUser}>Sign In</button>
        {message && <p>{message}</p>}
        <p className="link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </>
  );
}