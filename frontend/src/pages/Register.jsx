import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {
    try {
      const res = await fetch("http://localhost:8000/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Account created! 🎉");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      alert("Server error. Check if your PHP backend is running.");
    }
  };

  return (
    <div className="container">
      <div className="logo">SkillSwap 🔄</div>
      <h2>Create Account</h2>

      <input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Create Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={registerUser}>Get Started</button>

      <p className="link">
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Register;