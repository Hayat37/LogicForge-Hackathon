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

  const fetchSkills = async () => {
    const res = await fetch("http://localhost/LogicForge-Hackathon/backend/skills.php");
    const data = await res.json();
    if (data.success) setSkills(data.skills);
  };

  useEffect(() => {
    fetchSkills();
    document.body.classList.add("scrollable");
    return () => document.body.classList.remove("scrollable");
  }, []);

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
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user.name} 👋</h1>
          <p className="subtitle">{user.email}</p>
        </div>
        <div className="dashboard-actions">
          <button onClick={() => { setView("feed"); setMessage(""); }}>
            Skills Feed
          </button>
          <button onClick={() => { setView("post"); setMessage(""); }}>
            + Post Skill
          </button>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <hr style={{ borderColor: "rgba(255,255,255,0.08)", margin: "20px 0" }} />

      {/* POST SKILL */}
      {view === "post" && (
        <div className="post-form">
          <h2>Post a Skill</h2>
          <input
            placeholder="Skill title (e.g. React, Math, Photoshop)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="offer">I can teach this</option>
            <option value="need">I need help with this</option>
          </select>
          <input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={postSkill}>Post Skill</button>
          {message && <p className="subtitle" style={{ marginTop: 12 }}>{message}</p>}
        </div>
      )}

      {}
      {view === "feed" && (
        <div>
          <div className="search-bar">
            <input
              placeholder="Search skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchSkills()}
            />
            <button onClick={searchSkills}>Search</button>
            <button onClick={fetchSkills}>All</button>
          </div>

          {skills.length === 0 && (
            <p className="subtitle">No skills found</p>
          )}
          {skills.map((skill) => (
            <div key={skill.id} className="skill-card">
              <h3>{skill.title}</h3>
              <p className="skill-type">
                {skill.type === "offer" ? "🎓 Teaching" : "🙋 Needs help"}
              </p>
              {skill.description && (
                <p className="skill-desc">{skill.description}</p>
              )}
              <p className="skill-author">Posted by {skill.posted_by}</p>
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