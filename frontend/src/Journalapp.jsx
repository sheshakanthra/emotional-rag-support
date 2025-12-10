import { chat, journal, fetchJournals } from "./api";
import { useState, useMemo, useEffect } from "react";
import "./App.css";


export default function JournalApp({ userId, userName = "Friend", onLogout }) {
  const [activeTab, setActiveTab] = useState("write");
  const [entries, setEntries] = useState([]);
  const [todayText, setTodayText] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { from: "ai", text: `Hi ${userName}, I’m here with you. What’s on your mind today?` },
  ]);
  // ✅ AUTO LOAD JOURNAL HISTORY AFTER LOGIN
  useEffect(() => {
    if (!userId) return;

    const loadHistory = async () => {
      try {
        const res = await fetchJournals(userId);

        if (res.success && Array.isArray(res.entries)) {
          setEntries(res.entries); // ✅ LOAD OLD JOURNALS
        }
      } catch (err) {
        console.error("Failed to load journal history", err);
      }
    };

    loadHistory();
  }, [userId]);


  // ✅ DATE FORMAT
  // ✅ DATE & TIME FORMAT
  const [currentTime, setCurrentTime] = useState("");
  const todayInfo = useMemo(() => {
    const d = new Date();
    const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
    const monthDay = d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
    return { dayName, monthDay };
  }, []);

  // ✅ CLOCK TICKER
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(timeStr);
    };

    updateTime(); // Initial call
    const timer = setInterval(updateTime, 1000); // Update every sec

    return () => clearInterval(timer);
  }, []);

  const [notification, setNotification] = useState(null);

  // ✅ BLOCK UI IF USERID IS MISSING
  useEffect(() => {
    if (!userId) {
      showNotification("❌ User ID missing. Please login again.", "error");
      onLogout();
    }
  }, [userId, onLogout]);

  // ✅ DISPLAY NOTIFICATION
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // ✅ SAVE JOURNAL TO BACKEND
  const handleSaveJournal = async () => {
    if (!todayText.trim()) return;

    if (!userId) {
      showNotification("❌ User not logged in properly.", "error");
      return;
    }

    try {
      console.log("Saving journal:", { userId, todayText });

      const response = await fetch("http://127.0.0.1:8000/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,      // ✅ MUST MATCH BACKEND
          message: todayText,  // ✅ MUST MATCH BACKEND
        }),
      });

      const res = await response.json(); // ✅ THIS WAS MISSING EARLIER

      console.log("✅ Backend response:", res);

      if (res.success === true) {
        setEntries((prev) => [...prev, todayText]);
        setTodayText("");
        showNotification("✅ Journal saved successfully ✨", "success");
      } else {
        console.error("❌ Backend rejected journal:", res);
        showNotification("❌ Failed to save journal (backend rejected)", "error");
      }
    } catch (err) {
      console.error("❌ Journal save error:", err);
      showNotification("❌ Failed to save journal (server error)", "error");
    }
  };


  // ✅ SEND MESSAGE TO AI
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    if (!userId) {
      showNotification("❌ User not logged in properly.", "error");
      return;
    }

    const userMsg = { from: "you", text: chatInput.trim() };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    try {
      console.log("Sending chat:", { userId, chatInput });

      const res = await chat(userId, chatInput);
      const aiReply = { from: "ai", text: res.reply };

      setChatMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages((prev) => [
        ...prev,
        { from: "ai", text: "⚠️ AI service unavailable. Try again later." },
      ]);
    }
  };

  return (
    <div className="journal-page">
      <div className="journal-shell">

        {/* ✅ LEFT NAV */}
        <nav className="nav-rail">
          <button
            className={`nav-item ${activeTab === "write" ? "nav-active" : ""}`}
            onClick={() => setActiveTab("write")}
            data-tooltip="Write Journal"
          >
            🖊
          </button>

          <button
            className={`nav-item ${activeTab === "journal" ? "nav-active" : ""}`}
            onClick={() => setActiveTab("journal")}
            data-tooltip="History"
          >
            📒
          </button>

          <button
            className={`nav-item ${activeTab === "reflect" ? "nav-active" : ""}`}
            onClick={() => setActiveTab("reflect")}
            data-tooltip="AI Chat"
          >
            💬
          </button>

          <button
            className={`nav-item ${activeTab === "insights" ? "nav-active" : ""}`}
            onClick={() => setActiveTab("insights")}
            data-tooltip="Insights"
          >
            📊
          </button>

          <div className="nav-spacer" />
          <button className="nav-item logout-btn" onClick={onLogout} data-tooltip="Logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </nav>

        {/* ✅ MAIN CONTENT */}
        <main className="main-pane">

          {/* ✍️ WRITE TAB */}
          {activeTab === "write" && (
            <section className="pane-inner">
              <div className="write-section">
                <header className="date-header">
                  <span className="date-sub">{todayInfo.monthDay}</span>
                  <h1 className="date-main">{todayInfo.dayName}</h1>
                  <span className="date-time">{currentTime} IST</span>
                </header>

                <div className="write-card">
                  <textarea
                    className="write-textarea-creative"
                    placeholder="Start typing your thoughts for today..."
                    value={todayText}
                    onChange={(e) => setTodayText(e.target.value)}
                  />
                  <div className="save-bar">
                    <button className="save-btn-creative" onClick={handleSaveJournal}>
                      <span>Save Journal</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 📒 JOURNAL TAB */}
          {activeTab === "journal" && (
            <section className="pane-inner center-pane">
              <h1 className="page-title">Journal</h1>

              {entries.length === 0 ? (
                <p>Your journal is still empty.</p>
              ) : (
                <div className="journal-grid">
                  {entries.map((e, i) => (
                    <div key={i} className="journal-card">
                      <div className="journal-card-header">
                        <span className="journal-icon">📝</span>
                        <span className="journal-date">Entry #{i + 1}</span>
                      </div>
                      <p className="journal-content">{e}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* 💬 REFLECT TAB */}
          {activeTab === "reflect" && (
            <section className="pane-inner center-pane">
              <div className="reflect-header">
                <h1 className="reflect-title">Reflecta</h1>
                <p className="reflect-subtitle">
                  Once you have created an entry, Reflect will help you look back at your experiences to learn and grow.
                </p>
                <p className="reflect-subtitle">
                  For now, you can talk to the support bot below.
                </p>
              </div>

              <div className="chat-box">
                <div className="chat-messages">
                  {chatMessages.map((m, i) => (
                    <div
                      key={i}
                      className={`chat-line ${m.from === "you" ? "chat-you" : "chat-ai"
                        }`}
                    >
                      <b>{m.from === "you" ? "You" : "AI"}:</b> {m.text}
                    </div>
                  ))}
                </div>

                <div className="chat-input-row">
                  <textarea
                    rows={1}
                    className="chat-input"
                    placeholder="Share what’s on your mind…"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button className="chat-send-btn" onClick={handleSendMessage}>
                    Send
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* 📊 INSIGHTS TAB */}
          {activeTab === "insights" && (
            <section className="pane-inner">
              <h1 className="page-title">Insights</h1>

              <div className="insights-grid">
                {/* 🩹 CURED / HEALING GRAPH */}
                <div className="chart-card glass-panel">
                  <div className="chart-header center-text">
                    <h3>Healing Progress</h3>
                    <p> Emotional Recovery </p>
                  </div>
                  <div className="circle-chart-container display-glow">
                    <svg viewBox="0 0 36 36" className="circular-chart emerald">
                      <path className="circle-bg"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path className="circle"
                        strokeDasharray={`${Math.min(100, entries.length > 0 ? 65 + (entries.length * 3) % 35 : 0)}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <text x="18" y="20.35" className="percentage">
                        {entries.length > 0 ? 65 + (entries.length * 3) % 35 : 0}%
                      </text>
                    </svg>
                  </div>
                </div>

                {/* 📉 STRESS RELEASE GRAPH */}
                <div className="chart-card glass-panel">
                  <div className="chart-header center-text">
                    <h3>Stress Released</h3>
                    <p>Burden Lifted</p>
                  </div>
                  <div className="circle-chart-container display-glow">
                    <svg viewBox="0 0 36 36" className="circular-chart rose">
                      <path className="circle-bg"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path className="circle"
                        strokeDasharray={`${Math.min(100, entries.length > 0 ? 25 + (entries.length * 4) % 60 : 0)}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <text x="18" y="20.35" className="percentage">
                        {entries.length > 0 ? 25 + (entries.length * 4) % 60 : 0}%
                      </text>
                    </svg>
                  </div>
                </div>

                {/* 🔥 STREAK CARD WITH GRAPH */}
                <div className="chart-card glass-panel">
                  <div className="chart-header">
                    <h3>Consistency</h3>
                    <p>Activity Log</p>
                  </div>
                  <div className="streak-content-row">
                    <div className="streak-stats">
                      <span className="streak-icon">🔥</span>
                      <span className="streak-count">{Math.min(entries.length, 5)} Days</span>
                    </div>
                    {/* Fake Activity Graph */}
                    <div className="streak-graph">
                      {[40, 70, 30, 85, 50, 90, 60].map((h, i) => (
                        <div key={i} className="graph-bar" style={{ height: `${h}%` }}></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 🔮 CURRENT VIBE CARD WITH WAVE */}
                <div className="chart-card glass-panel vibe-card">
                  <div className="vibe-bg-wave">
                    <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                      <path fill="rgba(99, 102, 241, 0.2)" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0Z"></path>
                    </svg>
                  </div>
                  <div className="chart-header relative-z">
                    <h3>Current Vibe</h3>
                    <p>Your emotional signature</p>
                  </div>
                  <div className="vibe-content relative-z">
                    <span className="vibe-emoji shimmer">✨</span>
                    <span className="vibe-text">Radiant</span>
                  </div>
                </div>
              </div>
            </section>
          )}

        </main>

        {/* ✅ FLOATING NOTIFICATION */}
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
}
