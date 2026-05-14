import { useState } from "react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const registerUser = async () => {
    if (!name || !email || !password) {
      setMessage("Please fill in all fields");
      return;
    }

    const res = await fetch("http://localhost/LogicForge-Hackathon/backend/register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (data.success) {
      setMessage("Account created successfully!");
    } else {
      setMessage(data.error || "Something went wrong");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <br />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <br />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <br /><br />
      <button onClick={registerUser}>Register</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;