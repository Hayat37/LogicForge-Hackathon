import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({ user, setUser }) {
  const [view, setView] = useState("feed");
  const [skills, setSkills] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("offer");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const res = await fetch("http://localhost/LogicForge-Hackathon/backend/skills.php");
    const data = await res.json();
    if (data.success) setSkills(data.skills);
  };

  const postSkill = async () => {
    if (!title) {
      setMessage("Please enter a skill title");
      return;
    }
    const res = await fetch("http://localhost/LogicForge-Hackathon/backend/skills.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, title, type, description }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Skill posted!");
      setTitle("");
      setDescription("");
      fetchSkills();
      setView("feed");
    } else {
      setMessage(data.error || "Failed to post skill");
    }
  };

  const searchSkills = async () => {
    const res = await fetch(
      `http://localhost/LogicForge-Hackathon/backend/search.php?q=${search}`
    );
    const data = await res.json();
    if (data.success) setSkills(data.results);
  };

  const requestSession = async (skill_id) => {
    const res = await fetch("http://localhost/LogicForge-Hackathon/backend/sessions.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requester_id: user.id,
        skill_id,
        message: "I would like to learn this skill!",
      }),
    });
    const data = await res.json();
    alert(data.message || data.error);
  };

  const logout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome {user.name} 👋</h1>
      <p>Email: {user.email}</p>

      <button onClick={() => setView("feed")}>Search Skills</button>
      <button onClick={() => setView("post")}>Post Skill</button>
      <button onClick={logout}>Logout</button>

      <hr />

      {/* POST SKILL VIEW */}
      {view === "post" && (
        <div>
          <h2>Post a Skill</h2>
          <input
            placeholder="Skill title (e.g. React, Math, Photoshop)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="offer">I can teach this</option>
            <option value="need">I need help with this</option>
          </select>
          <br />
          <input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <br /><br />
          <button onClick={postSkill}>Post Skill</button>
          {message && <p>{message}</p>}
        </div>
      )}

      {/* FEED/SEARCH VIEW */}
      {view === "feed" && (
        <div>
          <h2>Find Skills</h2>
          <input
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={searchSkills}>Search</button>
          <button onClick={fetchSkills}>Show All</button>

          <h3>Skills</h3>
          {skills.length === 0 && <p>No skills found</p>}
          {skills.map((skill) => (
            <div key={skill.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
              <strong>{skill.title}</strong> — {skill.type === "offer" ? "🎓 Teaching" : "🙋 Needs help"}
              <p>{skill.description}</p>
              <small>Posted by {skill.posted_by}</small>
              <br />
              {skill.user_id !== user.id && (
                <button onClick={() => requestSession(skill.id)}>
                  Request Session
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;