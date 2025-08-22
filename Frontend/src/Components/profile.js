import React, { useState, useEffect } from 'react';
import './Profile.css';
import Navbar from '../Components/NavBar';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [edfFile, setEdfFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      message: 'Hello! I\'m your AI wellness companion. How are you feeling today?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Redirect to login if no user data
      window.location.href = '/login';
    }
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.edf')) {
      setEdfFile(file);
      setIsUploading(true);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Add success message
          setChatMessages(prev => [...prev, {
            id: Date.now(),
            sender: 'bot',
            message: `Great! I've successfully analyzed your EDF file "${file.name}". Based on the data, I can provide more personalized wellness recommendations. Would you like to discuss what I found?`,
            timestamp: new Date().toLocaleTimeString()
          }]);
        }
      }, 200);
    } else {
      alert('Please upload a valid EDF file');
    }
  };

 const sendMessage = async () => {
  if (!currentMessage.trim()) return;

  // Create user message
  const userMessage = {
    id: Date.now(),
    sender: 'user',
    message: currentMessage,
    timestamp: new Date().toLocaleTimeString()
  };

  // Add user message to chat
  setChatMessages(prev => [...prev, userMessage]);
  
  // Store the current message before clearing it
  const messageToSend = currentMessage;
  setCurrentMessage('');
  setIsTyping(true);

  try {
    // Make API call to backend
    const response = await fetch('http://localhost:4004/api/route/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: messageToSend,
        timestamp: new Date().toISOString(),
        sessionId: Date.now(), // Optional: for conversation tracking
      })
    });
    console.log(response)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Create bot response message
    const botMessage = {
      id: Date.now() + 1,
      sender: 'bot',
      message: data.message || data.response, // Adjust based on your backend response structure
      timestamp: new Date().toLocaleTimeString()
    };

    // Add bot message to chat
    setChatMessages(prev => [...prev, botMessage]);

  } catch (error) {
    console.error('Error fetching bot response:', error);
    
    // Fallback bot message in case of error
    const errorBotMessage = {
      id: Date.now() + 1,
      sender: 'bot',
      message: "I'm sorry, I'm having trouble responding right now. Please try again.",
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, errorBotMessage]);
  } finally {
    // Always stop typing indicator
    setIsTyping(false);
  }
};


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
              <span className="avatar-text">{user.name?.charAt(0) || 'U'}</span>
            </div>
            <h2>Welcome, {user.firstName || user.name?.split(' ')[0] || 'User'}!</h2>
            <p className="user-subtitle">Your wellness journey continues...</p>
          </div>

          <nav className="profile-nav">
            <button 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="nav-icon">📊</span>
              Dashboard
            </button>
            <button 
              className={`nav-item ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              <span className="nav-icon">📁</span>
              EDF Upload
            </button>
            <button 
              className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <span className="nav-icon">💬</span>
              AI Companion
            </button>
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="nav-icon">⚙️</span>
              Settings
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-content">
              <div className="welcome-section">
                <h1>Your Mental Wellness Hub</h1>
                <p>Track your progress, upload EDF files, and chat with your AI companion</p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🧠</div>
                  <div className="stat-content">
                    <h3>EDF Files Analyzed</h3>
                    <p className="stat-number">{edfFile ? 1 : 0}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💬</div>
                  <div className="stat-content">
                    <h3>Chat Sessions</h3>
                    <p className="stat-number">{Math.floor(chatMessages.length / 2)}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-content">
                    <h3>Days Active</h3>
                    <p className="stat-number">1</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-content">
                    <h3>Wellness Score</h3>
                    <p className="stat-number">85%</p>
                  </div>
                </div>
              </div>

              <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                  <button onClick={() => setActiveTab('upload')} className="action-btn">
                    <span className="action-icon">📁</span>
                    Upload EDF File
                  </button>
                  <button onClick={() => setActiveTab('chat')} className="action-btn">
                    <span className="action-icon">💬</span>
                    Chat with AI
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="upload-content">
              <div className="upload-header">
                <h1>Upload EDF File</h1>
                <p>Upload your EEG data file to get personalized insights and recommendations</p>
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
                    <p>Your EDF data has been analyzed and integrated into your wellness profile.</p>
                  </div>
                )}
              </div>

              <div className="upload-info">
                <h2>About EDF Files</h2>
                <div className="info-grid">
                  <div className="info-card">
                    <h4>🔒 Privacy First</h4>
                    <p>Your EDF files are encrypted and stored securely. Only you have access to your data.</p>
                  </div>
                  <div className="info-card">
                    <h4>🧠 AI Analysis</h4>
                    <p>Our AI analyzes your EEG patterns to provide personalized wellness recommendations.</p>
                  </div>
                  <div className="info-card">
                    <h4>📊 Insights</h4>
                    <p>Get detailed insights about your mental state and suggested coping strategies.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="chat-content">
              <div className="chat-header">
                <h1>AI Wellness Companion</h1>
                <p>Your personal mental health support assistant</p>
              </div>

              <div className="chat-container">
                <div className="chat-messages">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`message ${msg.sender}`}>
                      <div className="message-avatar">
                        {msg.sender === 'bot' ? '🤖' : '👤'}
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
          {activeTab === 'settings' && (
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
                    <input type="text" value={user.name || ''} readOnly />
                  </div>
                  <div className="setting-item">
                    <label>Email</label>
                    <input type="email" value={user.email || ''} readOnly />
                  </div>
                </div>

                <div className="settings-section">
                  <h2>Privacy & Data</h2>
                  <div className="setting-item checkbox">
                    <input type="checkbox" id="data-sharing" defaultChecked={false} />
                    <label htmlFor="data-sharing">Allow anonymous data sharing for research</label>
                  </div>
                  <div className="setting-item checkbox">
                    <input type="checkbox" id="notifications" defaultChecked={true} />
                    <label htmlFor="notifications">Receive wellness reminders</label>
                  </div>
                </div>

                <div className="settings-section">
                  <h2>Account Actions</h2>
                  <div className="action-buttons">
                    <button className="btn-secondary">Change Password</button>
                    <button className="btn-danger">Delete Account</button>
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