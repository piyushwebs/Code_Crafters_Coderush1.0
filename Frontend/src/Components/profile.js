import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./Profile.css";
import Navbar from "../Components/NavBar";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [edfFiles,setEdfFiles] = useState(0);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [edfFile, setEdfFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "bot",
      message:
        "Hello! I'm your AI wellness companion. How are you feeling today?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    console.log(userData);
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Redirect to login if no user data
      window.location.href = "/login";
    }
  }, []);
  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    // Add user's message
    const userMessage = {
      id: Date.now(),
      sender: "user",
      message: currentMessage,
      timestamp: new Date().toLocaleTimeString(),
    };
    setChatMessages((prev) => [...prev, userMessage]);

    // Clear input
    setCurrentMessage("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:4004/api/route/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: userMessage.message }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          message: data.value || "⚠️ No response received from server.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file || !file.name.endsWith(".edf")) {
      alert("Please upload a valid EDF file");
      return;
    }
    setEdfFiles(edfFiles+1);
    setEdfFile(file);
    setUploadProgress(100); // file ready
    setIsUploading(false); // show Analyze button
  };

  const handleAnalyze = async () => {
    if (!edfFile) return;

    setIsTyping(true);

    try {
      const formData = new FormData();
      formData.append("edffile", edfFile); // must match backend

      const response = await fetch("http://localhost:4004/api/route/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`EEG Server Error: ${response.status}`);

      const result = await response.json();
      console.log("EEG Analysis Result:", result);

      // Render in chatbot
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "bot",
          message: `🤖 EEG Analysis Result:\nPrediction: ${result.prediction}\nSch Votes: ${result.sch_votes}\nControl Votes: ${result.control_votes}\nTotal Segments: ${result.total_segments}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      setActiveTab("chat"); // switch to chat automatically
    } catch (error) {
      console.error("Error analyzing EDF:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "bot",
          message: "⚠️ Sorry, I couldn't analyze your file. Please try again.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4004/api/route/users/${id}`);
        navigate("/"); // Update state after deletion
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  if (!user) {
    return <div className="loading">Loading your wellness dashboard...</div>;
  }

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-container">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="user-info">
            <div className="avatar">
              <span className="avatar-text">{user.name?.charAt(0) || "U"}</span>
            </div>
            <h2>
              Welcome, {user.firstName || user.name?.split(" ")[0] || "User"}!
            </h2>
            <p className="user-subtitle">Your wellness journey continues...</p>
          </div>

          <nav className="profile-nav">
            <button
              className={`nav-item ${
                activeTab === "dashboard" ? "active" : ""
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <span className="nav-icon">📊</span>
              Dashboard
            </button>
            <button
              className={`nav-item ${activeTab === "upload" ? "active" : ""}`}
              onClick={() => setActiveTab("upload")}
            >
              <span className="nav-icon">📁</span>
              EDF Upload
            </button>
            <button
              className={`nav-item ${activeTab === "chat" ? "active" : ""}`}
              onClick={() => setActiveTab("chat")}
            >
              <span className="nav-icon">💬</span>
              AI Companion
            </button>
            <button
              className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <span className="nav-icon">⚙️</span>
              Settings
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="dashboard-content">
              <div className="welcome-section">
                <h1>Your Mental Wellness Hub</h1>
                <p>
                  Track your progress, upload EDF files, and chat with your AI
                  companion
                </p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🧠</div>
                  <div className="stat-content">
                    <h3>EDF Files Analyzed</h3>
                    <p className="stat-number">{edfFiles}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💬</div>
                  <div className="stat-content">
                    <h3>Chat Sessions</h3>
                    <p className="stat-number">
                      {Math.floor(chatMessages.length / 2)}
                    </p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-content">
                    <h3>Days Active</h3>
                    <p className="stat-number">1</p>
                  </div>
                </div>
              </div>

              <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="action-btn"
                  >
                    <span className="action-icon">📁</span>
                    Upload EDF File
                  </button>
                  <button
                    onClick={() => setActiveTab("chat")}
                    className="action-btn"
                  >
                    <span className="action-icon">💬</span>
                    Chat with AI
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === "upload" && (
            <div className="upload-content">
              <div className="upload-header">
                <h1>Upload EDF File</h1>
                <p>
                  Upload your EEG data file to get personalized insights and
                  recommendations
                </p>
              </div>

              <div className="upload-section">
                <div className="upload-area">
                  <input
                    type="file"
                    id="edf-upload"
                    accept=".edf"
                    onChange={handleFileUpload}
                    className="file-input"
                  />
                  <label htmlFor="edf-upload" className="upload-label">
                    <div className="upload-icon">📁</div>
                    <h3>Drop your EDF file here or click to browse</h3>
                    <p>Supports .edf files up to 100MB</p>
                  </label>
                </div>

                {isUploading && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p>Uploading... {uploadProgress}%</p>
                  </div>
                )}

                {edfFile && !isUploading && (
                  <div className="upload-success">
                    <div className="success-icon">✅</div>
                    <h3>File uploaded successfully!</h3>
                    <p>File: {edfFile.name}</p>
                    <p>Your EDF data is ready for analysis.</p>

                    {/* 🔹 Show Analyze Button */}
                    <button className="analyze-btn" onClick={handleAnalyze}>
                      🔍 Analyze EDF File
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === "chat" && (
            <div className="chat-content">
              <div className="chat-header">
                <h1>AI Wellness Companion</h1>
                <p>Your personal mental health support assistant</p>
              </div>

              <div className="chat-container">
                <div className="chat-messages">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.sender}`}>
                      <div className="message-avatar">
                        {msg.sender === "bot" ? "🤖" : "👤"}
                      </div>
                      <div className="message-content">
                        <p>{msg.message}</p>
                        <span className="message-time">{msg.timestamp}</span>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="message bot typing">
                      <div className="message-avatar">🤖</div>
                      <div className="message-content">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="chat-input-area">
                  <div className="input-container">
                    <textarea
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message here... Press Enter to send"
                      className="chat-input"
                      rows="3"
                    />
                    <button onClick={sendMessage} className="send-button">
                      <span>Send</span>
                      <span className="send-icon">➤</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="settings-content">
              <div className="settings-header">
                <h1>Settings</h1>
                <p>Customize your wellness experience</p>
              </div>

              <div className="settings-sections">
                <div className="settings-section">
                  <h2>Profile Information</h2>
                  <div className="setting-item">
                    <label>Full Name</label>
                    <input type="text" value={user.name || ""} readOnly />
                  </div>
                  <div className="setting-item">
                    <label>Email</label>
                    <input type="email" value={user.email || ""} readOnly />
                  </div>
                </div>

                <div className="settings-section">
                  <h2>Privacy & Data</h2>
                  <div className="setting-item checkbox">
                    <input
                      type="checkbox"
                      id="data-sharing"
                      defaultChecked={false}
                    />
                    <label htmlFor="data-sharing">
                      Allow anonymous data sharing for research
                    </label>
                  </div>
                  <div className="setting-item checkbox">
                    <input
                      type="checkbox"
                      id="notifications"
                      defaultChecked={true}
                    />
                    <label htmlFor="notifications">
                      Receive wellness reminders
                    </label>
                  </div>
                </div>

                <div className="settings-section">
                  <h2>Account Actions</h2>
                  <div className="action-buttons">       
                    <button  className="btn-danger" onClick={() => handleDelete(user.id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
