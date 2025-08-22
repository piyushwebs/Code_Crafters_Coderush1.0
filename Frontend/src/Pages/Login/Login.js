import React, { useState } from "react";
import "./Login.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      const res = await fetch("http://localhost:4004/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("✅ Welcome back! Your wellness journey continues...");
        window.location.href = "/profile"; // Changed to profile
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="wellness-header">
          <div className="wellness-icon">🧠💚</div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Continue your mental wellness journey</p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && (
            <div className={`error-message ${errors.email ? 'show' : ''}`}>
              {errors.email}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && (
            <div className={`error-message ${errors.password ? 'show' : ''}`}>
              {errors.password}
            </div>
          )}
        </div>

        <button
          className="login-button"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Continue My Journey"}
        </button>

        <div className="wellness-features">
          <div className="feature-item">
            <span className="feature-icon">✨</span>
            Daily mood check-ins & journaling
          </div>
          <div className="feature-item">
            <span className="feature-icon">🧘</span>
            Personalized mindfulness & CBT exercises
          </div>
          <div className="feature-item">
            <span className="feature-icon">📈</span>
            Track your emotional wellbeing progress
          </div>
        </div>

        <div className="SingUp-redirect">
          New to mental wellness support?{" "}
          <a href="/signup">Start your journey here</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
