import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
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

  const registerUser = async () => {
    setIsSuccess(false);
    if (!name.trim() || !email.trim() || !password) {
      setMessage("Please fill in all fields");
      return;
    }
    if (name.trim().length < 2) {
      setMessage("Name must be at least 2 characters");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setMessage("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }
    try {
      const res = await fetch("http://localhost/LogicForge-Hackathon/backend/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password, bio: bio.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        setMessage("Account created! Redirecting...");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMessage(data.error || "Registration failed");
      }
    } catch {
      setMessage("Server error. Check if your PHP backend is running.");
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
        <h2>Create Account</h2>
        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => { setName(e.target.value); setMessage(""); }}
          onKeyDown={(e) => e.key === "Enter" && registerUser()}
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setMessage(""); }}
          onKeyDown={(e) => e.key === "Enter" && registerUser()}
        />
        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setMessage(""); }}
          onKeyDown={(e) => e.key === "Enter" && registerUser()}
        />
        <textarea
          placeholder="Short bio (optional) e.g. I am a CS student and love teaching math."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="bio-input"
          rows={3}
        />
        <button onClick={registerUser}>Get Started</button>
        {message && <p className={isSuccess ? "auth-message success" : "auth-message error"}>{message}</p>}
        <p className="link">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </>
  );
}

export default Register;