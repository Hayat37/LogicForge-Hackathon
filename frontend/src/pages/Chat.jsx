import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function Chat({ user, setUser }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const partnerId = searchParams.get("user");
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [contacts, setContacts] = useState([]);
  const scrollRef = useRef();

  // Theme logic
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") !== "light");
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("light-mode", !darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Logout Function
  const logout = () => {
    setUser(null);
    navigate("/");
  };

  // Fetch Contacts (Accepted Sessions)
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch(`https://skillswap-pro.infinityfreeapp.com/backend/sessions.php?user_id=${user.id}`);
        const data = await res.json();
        if (data.success) {
          const accepted = data.sessions.filter(s => s.status === "accepted");
          const uniqueContacts = [];
          const seen = new Set();
          accepted.forEach(s => {
            const pid = s.requester_name === user.name ? s.skill_owner_id : s.requester_id;
            const pName = s.requester_name === user.name ? s.skill_owner_name : s.requester_name;
            if (!seen.has(pid)) {
              seen.add(pid);
              uniqueContacts.push({ id: pid, name: pName, skill: s.skill_title });
            }
          });
          setContacts(uniqueContacts);
        }
      } catch (e) { console.error(e); }
    };
    fetchContacts();
  }, [user.id]);

  // Fetch Messages (History/Persistence)
  const fetchMessages = async () => {
    if (!partnerId || partnerId === "undefined") return;
    try {
      const res = await fetch(`https://skillswap-pro.infinityfreeapp.com/backend/messages.php?user1=${user.id}&user2=${partnerId}`);
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [partnerId]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !partnerId) return;

    const res = await fetch("https://skillswap-pro.infinityfreeapp.com/backend/messages.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender_id: user.id, receiver_id: partnerId, message: newMessage }),
    });
    const data = await res.json();
    if (data.success) {
      setNewMessage("");
      fetchMessages();
    }
  };

  const currentPartner = contacts.find(c => c.id == partnerId);

  return (
    <div className="dashboard">
      <button className={`theme-toggle ${spinning ? "spin" : ""}`} 
              onClick={() => { setSpinning(true); setDarkMode(!darkMode); setTimeout(()=>setSpinning(false), 400); }}>
        {darkMode ? "☀️" : "🌙"}
      </button>

      <div className="dashboard-header">
        <div className="dashboard-header-inner">
          <div className="logo" onClick={() => navigate("/dashboard")} style={{cursor: 'pointer'}}>SkillSwap</div>
          <div className="dashboard-actions">
            <button onClick={() => navigate("/dashboard")}>Skills Feed</button>
            <button onClick={() => navigate("/dashboard")}>Sessions</button>
            <button className="active-nav">Messages</button>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </div>
      </div>

      <hr className="divider" />

      <div className="chat-app-container">
        <div className="chat-sidebar-new">
          <div className="sidebar-title">Recent Chats</div>
          {contacts.map(c => (
            <div key={c.id} className={`contact-item ${partnerId == c.id ? 'active' : ''}`} onClick={() => setSearchParams({ user: c.id })}>
              <div className="contact-avatar">{c.name.charAt(0).toUpperCase()}</div>
              <div className="contact-info">
                <div className="contact-name">{c.name}</div>
                <div className="contact-skill">{c.skill}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-main-window">
          {partnerId && partnerId !== "undefined" ? (
            <>
              <div className="chat-window-header">
                <h3>Conversation with {currentPartner ? currentPartner.name : "User"}</h3>
              </div>
              <div className="chat-messages-scroll">
                {messages.map(msg => (
                  <div key={msg.id} className={`bubble-container ${msg.sender_id == user.id ? 'sent' : 'received'}`}>
                    <div className="bubble-text">
                      {msg.message}
                      <span className="bubble-time">{new Date(msg.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
              <form className="chat-input-footer" onSubmit={sendMessage}>
                <input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." />
                <button type="submit">Send</button>
              </form>
            </>
          ) : (
            <div className="empty-state">
              <h3>Select a contact to view your history</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;