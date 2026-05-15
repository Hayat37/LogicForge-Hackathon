import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

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

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/skills.php")
      .then(res => res.json())
      .then(data => {
        if (data.success) setSkills(data.skills);
      });

    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const res = await fetch(
      `http://localhost:8000/sessions.php?user_id=${user.id}`
    );
    const data = await res.json();

    if (data.success) setSessions(data.sessions);
  };

  const postSkill = async () => {
    if (!title) return setMessage("Enter skill title");

    const res = await fetch("http://localhost:8000/skills.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        title,
        type,
        description,
      }),
    });

    const data = await res.json();

    setMessage(data.message || data.error);
    if (data.success) {
      setTitle("");
      setDescription("");
      fetchSessions();
      setView("feed");
    }
  };

  const searchSkills = async () => {
    const res = await fetch(
      `http://localhost:8000/search.php?q=${search}`
    );
    const data = await res.json();

    if (data.success) setSkills(data.results);
  };

  const requestSession = async (skill_id) => {
    const res = await fetch("http://localhost:8000/sessions.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requester_id: user.id,
        skill_id,
        message: "I want to learn this skill",
      }),
    });

    const data = await res.json();

    setCardMessages(prev => ({
      ...prev,
      [skill_id]: data.message || data.error,
    }));
  };

  const respondToSession = async (session_id, status) => {
    const res = await fetch("http://localhost:8000/sessions.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, status }),
    });

    const data = await res.json();
    if (data.success) fetchSessions();
  };

  const logout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <div className="logo">SkillSwap</div>

        <div className="dashboard-actions">
          <button onClick={() => setView("feed")}>Feed</button>
          <button onClick={() => setView("post")}>Post</button>
          <button onClick={() => setView("sessions")}>Sessions</button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {/* USER */}
      <div className="user-info">
        <h2>Welcome, {user.name}</h2>
        <p>{user.email}</p>
      </div>

      {message && <p>{message}</p>}

      {/* POST */}
      {view === "post" && (
        <div className="post-form">
          <input
            placeholder="Skill title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="offer">Teach</option>
            <option value="need">Need help</option>
          </select>

          <input
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <button onClick={postSkill}>Post</button>
        </div>
      )}

      {/* FEED */}
      {view === "feed" && (
        <div>
          <input
            placeholder="Search skills"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button onClick={searchSkills}>Search</button>

          {skills.map(skill => (
            <div key={skill.id} className="skill-card">
              <h3>{skill.title}</h3>
              <p>{skill.description}</p>

              {skill.user_id !== user.id && (
                <div>
                  <button onClick={() => requestSession(skill.id)}>
                    Request Session
                  </button>

                  <Link to={`/chat?user=${skill.user_id}`}>
                    <button className="chat-btn">Chat</button>
                  </Link>

                  {cardMessages[skill.id] && (
                    <p>{cardMessages[skill.id]}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SESSIONS */}
      {view === "sessions" && (
        <div>
          <h2>Sessions</h2>

          {sessions.map(session => (
            <div key={session.id} className="skill-card">
              <h3>{session.skill_title}</h3>
              <p>Status: {session.status}</p>

              {session.status === "pending" &&
                session.requester_id !== user.id && (
                  <div>
                    <button onClick={() => respondToSession(session.id, "accepted")}>
                      Accept
                    </button>

                    <button onClick={() => respondToSession(session.id, "declined")}>
                      Decline
                    </button>
                  </div>
              )}

              {session.requester_id && (
                <Link to={`/chat?user=${session.requester_id}`}>
                  <button className="chat-btn">Open Chat</button>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;