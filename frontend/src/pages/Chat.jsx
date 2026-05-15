import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const user1 = user.id;
  const user2 = searchParams.get("user");

  const bottomRef = useRef(null);

  const loadMessages = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/messages.php?user1=${user1}&user2=${user2}`
      );

      const data = await res.json();

      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadMessages();

    const interval = setInterval(() => {
      loadMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const res = await fetch("http://localhost:8000/messages.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_id: user1,
          receiver_id: user2,
          message: text,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setText("");
        loadMessages();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chat-page">

      <div className="chat-header">
        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back
        </button>

        <div>
          <h2>SkillSwap Chat</h2>
          <p>Chat with User #{user2}</p>
        </div>
      </div>

      <div className="chat-container">

        <div className="chat-box">

          {messages.length === 0 && (
            <p className="empty-chat">
              No messages yet 👋
            </p>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.sender_id === user1
                  ? "message sent"
                  : "message received"
              }
            >
              {msg.message}
            </div>
          ))}

          <div ref={bottomRef}></div>

        </div>

        <div className="chat-input-box">

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            className="send-btn"
            onClick={sendMessage}
          >
            Send
          </button>

        </div>

      </div>
    </div>
  );
}

export default Chat;