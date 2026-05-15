import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import "./styles.css";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Routes>
  <Route path="/" element={<Login setUser={setUser} />} />
  <Route path="/register" element={<Register />} />
  <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
  <Route path="/chat" element={<Chat user={user} />} />
</Routes>
  );
}

export default App;