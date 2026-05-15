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
  const [cardMessages, setCardMessages] = useState({});
  const [sessionFilter, setSessionFilter] = useState("all");
  const [sessionDirection, setSessionDirection] = useState("all");
  const [feedTypeFilter, setFeedTypeFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });
  const [spinning, setSpinning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("light-mode", !darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    return () => document.body.classList.remove("light-mode");
  }, [darkMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resSkills = await fetch("http://localhost/LogicForge-Hackathon/backend/skills.php");
        const dataSkills = await resSkills.json();
        if (dataSkills.success) setSkills(dataSkills.skills);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
      try {
        const resSessions = await fetch(
          `http://localhost/LogicForge-Hackathon/backend/sessions.php?user_id=${user.id}`
        );
        const dataSessions = await resSessions.json();
        if (dataSessions.success) setSessions(dataSessions.sessions);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };
    fetchData();
    document.body.classList.add("scrollable");
    return () => document.body.classList.remove("scrollable");
  }, [user.id]);

  const fetchSkills = async () => {
    const res = await fetch("http://localhost/LogicForge-Hackathon/backend/skills.php");
    const data = await res.json();
    if (data.success) setSkills(data.skills);
  };

  const fetchSessions = async () => {
    const res = await fetch(
      `http://localhost/LogicForge-Hackathon/backend/sessions.php?user_id=${user.id}`
    );
    const data = await res.json();
    if (data.success) setSessions(data.sessions);
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
      setTimeout(() => setMessage(""), 3000);
      setTitle("");
      setDescription("");
      fetchSkills();
      setView("feed");
    } else {
      setMessage(data.error || "Failed to post skill");
      setTimeout(() => setMessage(""), 3000);
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
    setCardMessages(prev => ({ ...prev, [skill_id]: data.message || data.error }));
    setTimeout(() => {
      setCardMessages(prev => ({ ...prev, [skill_id]: null }));
    }, 3000);
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

  const handleThemeToggle = () => {
    setSpinning(true);
    setDarkMode(prev => !prev);
    setTimeout(() => setSpinning(false), 400);
  };

  const pendingSessions = sessions.filter(
    s => s.status === "pending" && s.requester_name !== user.name
  );

  const logout = () => {
    setUser(null);
    navigate("/");
  };

  const getSessionLabel = (session) => {
    const action = session.skill_type === "offer" ? "to learn" : "to teach";
    if (session.requester_name === user.name) {
      return `You requested ${action}`;
    }
    return `${session.requester_name} requested ${action}`;
  };

  const filteredFeedSkills = skills.filter((skill) => {
    if (feedTypeFilter === "offer") return skill.type === "offer";
    if (feedTypeFilter === "need") return skill.type === "need";
    return true;
  });

  const filteredSessions = sessions
    .filter(s => {
      if (sessionFilter !== "all" && s.skill_type !== sessionFilter) return false;
      if (sessionDirection === "incoming" && s.requester_name === user.name) return false;
      if (sessionDirection === "outgoing" && s.requester_name !== user.name) return false;
      return true;
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="dashboard">

      <button
        className={`theme-toggle ${spinning ? "spin" : ""}`}
        onClick={handleThemeToggle}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      <div className="dashboard-header">
        <div className="dashboard-header-inner">
          <div className="logo">SkillSwap</div>
          <div className="dashboard-actions">
            <button onClick={() => { setView("feed"); setMessage(""); }}>
              Skills Feed
            </button>
            <button className="post-skill-btn" onClick={() => { setView("post"); setMessage(""); }}>
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
      </div>

      <hr className="divider" />

      <div className="user-info">
        <h1>Welcome, {user.name} 👋</h1>
        <p className="subtitle">{user.email}</p>
        {user.bio && <p className="subtitle">{user.bio}</p>}
      </div>

      <hr className="divider" />

      {message && <p className="feed-message">{message}</p>}

      {view === "post" && (
        <div className="post-form">

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

          <div className="feed-filters">
            <select
              value={feedTypeFilter}
              onChange={(e) => setFeedTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="offer">Teaching</option>
              <option value="need">Learning</option>
            </select>
          </div>

          {filteredFeedSkills.length === 0 && <p className="subtitle">No skills found</p>}
          {filteredFeedSkills.map((skill) => (
            <div key={skill.id} className="skill-card">
              <h3>{skill.title}</h3>
              <p className="skill-type">
                {skill.type === "offer" ? "Teaching" : "Needs help with this"}
              </p>
              {skill.description && (
                <p className="skill-desc">
                  <span className="field-label">Description:</span> {skill.description}
                </p>
              )}
              <p className="skill-author">
                <span className="field-label">Posted by:</span> {skill.posted_by}
              </p>
              {skill.posted_by_bio && (
                <p className="skill-poster-bio">
                  <span className="field-label">Bio:</span> {skill.posted_by_bio}
                </p>
              )}
              {skill.user_id !== user.id && (
                <>
                  <button onClick={() => requestSession(skill.id)}>
                    Request Session
                  </button>
                  {cardMessages[skill.id] && (
                    <p className="card-message">{cardMessages[skill.id]}</p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {view === "sessions" && (
        <div>


          <div className="session-filters">
            <select
              value={sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="offer">Teaching</option>
              <option value="need">Learning</option>
            </select>

            <select
              value={sessionDirection}
              onChange={(e) => setSessionDirection(e.target.value)}
              className="filter-select"
            >
              <option value="all">Incoming & Outgoing</option>
              <option value="incoming">Incoming</option>
              <option value="outgoing">Outgoing</option>
            </select>
          </div>

          {filteredSessions.map((session) => (
            <div key={session.id} className="skill-card">
              <div className="session-card-header">
                <h3>{session.skill_title}</h3>
                <span className="session-date">
                  {new Date(session.created_at).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                  })}
                </span>
              </div>
              <h4 className="session-requester">{getSessionLabel(session)}</h4>
              <p className="skill-author">
                Status: <span className={`status-${session.status}`}>{session.status}</span>
              </p>
              {session.status === "pending" && session.requester_name !== user.name && (
                <div className="session-actions">
                  <button className="accept-btn" onClick={() => respondToSession(session.id, "accepted")}>
                    Accept
                  </button>
                  <button className="decline-btn" onClick={() => respondToSession(session.id, "declined")}>
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}

          {filteredSessions.length === 0 && (
            <p className="subtitle">No sessions match your filters</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;