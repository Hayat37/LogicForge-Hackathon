import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

function App() {
  const [page, setPage] = useState("register");
  const [user, setUser] = useState(null);

  return (
    <div style={{ padding: 20 }}>
      <h1>SkillSwap</h1>

      {!user && (
        <>
          <button onClick={() => setPage("register")}>Register</button>
          <button onClick={() => setPage("login")}>Login</button>
          <hr />
        </>
      )}

      {/* IF LOGGED IN → SHOW DASHBOARD */}
      {user ? (
        <Dashboard user={user} />
      ) : (
        <>
          {page === "register" && <Register />}
          {page === "login" && (
            <Login setUser={setUser} />
          )}
        </>
      )}
    </div>
  );
}

export default App;