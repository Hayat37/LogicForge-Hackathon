import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {
  const payload = { name, email, password };

  console.log("SENDING:", payload);

  const res = await fetch("http://localhost:8000/register.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  console.log(data);
};
  

  

  return (
    <div style={{ padding: 20 }}>
      <h1>SkillSwap Register</h1>

      <input
  placeholder="Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

<input
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

<input
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
      <br /><br />

      <button onClick={registerUser}>
        Register
      </button>
    </div>
  );
}

export default App;