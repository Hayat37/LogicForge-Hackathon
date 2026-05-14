import { useState } from "react";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const loginUser = async () => {
    if (!email || !password) {
      setMessage("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost/LogicForge-Hackathon/backend/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();

     
     
     
  if (data.success) {
        setUser(data.user);
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: 300 }}>
      <h2>Login</h2>
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <br /><br />
      
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <br /><br />
      <button onClick={loginUser}>Login</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;