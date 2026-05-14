import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [page, setPage] = useState("register");

  return (
    <div style={{ padding: 20 }}>
      <h1>SkillSwap</h1>

      {/* NAVIGATION */}
      <button onClick={() => setPage("register")}>Register</button>
      <button onClick={() => setPage("login")}>Login</button>

      <hr />

      {page === "register" && <Register />}
      {page === "login" && <Login />}
    </div>
  );
}

export default App;