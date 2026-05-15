import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({ user, setUser }) {
  const [view, setView] = useState("feed");
  const [skills, setSkills] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("offer");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost/LogicForge-Hackathon/backend/skills.php")
      .then(res => res.json())
      .then(data => { if (data.success) setSkills(data.skills); });
    fetchSessions();
    document.body.classList.add("scrollable");
    return () => document.body.classList.remove("scrollable");
  }, []);

  const fetchSessions = async () => {
    const res = await fetch(
      `http://localhost/LogicForge-Hackathon/backend/sessions.php?user_id=${user.id}`
    );
    const data = await res.json();
    if (data.success) setSessions(data.sessions);
  };

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
      setMessage("Skill posted successfully!");
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
    setMessage(data.message || data.error);
  };

  const respondToSession = async (session_id, status) => {
    const res = await fetch("http://localhost/LogicForge-Hackathon/backend/sessions.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, status }),
    });
    const data = await res.json();
    if (data.success) fetchSessions();
  };

  const pendingSessions = sessions.filter(
    s => s.status === "pending" && s.requester_name !== user.name
  );

  const logout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <div className="logo" style={{ fontSize: 24 }}>SkillSwap</div>
        <div className="dashboard-actions">
          <button onClick={() => { setView("feed"); setMessage(""); }}>
            Skills Feed
          </button>
          <button onClick={() => { setView("post"); setMessage(""); }}>
            + Post Skill
          </button>
          <button onClick={() => { setView("sessions"); setMessage(""); }}>
            Sessions {pendingSessions.length > 0 && (
              <span className="badge">{pendingSessions.length}</span>
            )}
          </button>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <hr style={{ borderColor: "rgba(255,255,255,0.08)", margin: "16px 0" }} />


      <div className="user-info">
        <h2 style={{ color: "#f1f5f9", textTransform: "none", letterSpacing: 0 }}>
          Welcome, {user.name} 👋
        </h2>
        <p className="subtitle">{user.email}</p>
        {user.bio && <p className="subtitle" style={{ marginTop: 4 }}>{user.bio}</p>}
      </div>

      <hr style={{ borderColor: "rgba(255,255,255,0.08)", margin: "16px 0" }} />

      {message && <p className="subtitle" style={{ marginBottom: 16, color: "#567C8D" }}>{message}</p>}


      {view === "post" && (
        <div className="post-form">
          <h2 style={{ color: "#f1f5f9", textTransform: "none", marginBottom: 16 }}>Post a Skill</h2>
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
        </div>
      )}

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
          </div>

          {skills.length === 0 && <p className="subtitle">No skills found</p>}
          {skills.map((skill) => (
            <div key={skill.id} className="skill-card">
              <h3>{skill.title}</h3>
              <p className="skill-type">
                {skill.type === "offer" ? "🎓 Teaching" : "🙋 Needs help"}
              </p>
              {skill.description && <p className="skill-desc">{skill.description}</p>}
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

      {view === "sessions" && (
        <div>
          <h2 style={{ color: "#f1f5f9", textTransform: "none", marginBottom: 16 }}>
            Session Requests
          </h2>
          {sessions.length === 0 && <p className="subtitle">No session requests yet</p>}
          {sessions.map((session) => (
            <div key={session.id} className="skill-card">
              <h3>{session.skill_title}</h3>
              <p className="skill-type">{session.skill_type === "offer" ? "🎓 Teaching" : "🙋 Needs help"}</p>
              <p className="skill-desc">From: {session.requester_name}</p>
              <p className="skill-author">
                Status: <span style={{ color: session.status === "pending" ? "#567C8D" : session.status === "accepted" ? "#22c55e" : "#ef4444" }}>
                  {session.status}
                </span>
              </p>
              {session.status === "pending" && session.requester_name !== user.name && (
                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                  <button onClick={() => respondToSession(session.id, "accepted")}
                    style={{ background: "#22c55e" }}>
                    Accept
                  </button>
                  <button onClick={() => respondToSession(session.id, "declined")}
                    style={{ background: "#ef4444" }}>
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;