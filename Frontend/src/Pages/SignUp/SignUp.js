import React, { useState } from 'react';
import './SignUp.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  // 🔹 Password Strength Calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  };

  // 🔹 Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue
    }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 🔹 Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }

    return newErrors;
  };

  // 🔹 Handle Submit
  const handleSubmit = async () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password
      };

      const res = await fetch('http://localhost:4004/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        alert('🎉 Account created successfully!');
        window.location.href = '/profile';
      } else {
        alert(data.error || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'Weak password';
      case 'medium':
        return 'Medium strength';
      case 'strong':
        return 'Strong password!';
      default:
        return '';
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <div className="wellness-header">
          <div className="wellness-icon">🌱🧠</div>
          <h1 className="signup-title">Start Your Wellness Journey</h1>
          <p className="signup-subtitle">Take the first step towards better mental health</p>
        </div>

        {/* First & Last Name */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="firstName">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className={`form-input ${errors.firstName ? 'error' : ''}`}
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            {errors.firstName && <div className="error-message show">{errors.firstName}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="lastName">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className={`form-input ${errors.lastName ? 'error' : ''}`}
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            {errors.lastName && <div className="error-message show">{errors.lastName}</div>}
          </div>
        </div>

        {/* Email */}
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
          {errors.email && <div className="error-message show">{errors.email}</div>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className={`form-input ${errors.password ? 'error' : passwordStrength === 'strong' ? 'success' : ''}`}
            placeholder="Create a secure password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {formData.password && (
            <div className={`password-strength strength-${passwordStrength}`}>
              {getPasswordStrengthText()}
            </div>
          )}
          {errors.password && <div className="error-message show">{errors.password}</div>}
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={`form-input ${errors.confirmPassword ? 'error' : formData.confirmPassword && formData.password === formData.confirmPassword ? 'success' : ''}`}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          {errors.confirmPassword && <div className="error-message show">{errors.confirmPassword}</div>}
          {formData.confirmPassword &&
            formData.password === formData.confirmPassword &&
            !errors.confirmPassword && (
              <div className="success-message show">Passwords match!</div>
            )}
        </div>

        {/* Commitment Section */}
        <div className="wellness-commitment">
          <div className="commitment-title">Your Mental Health Commitment:</div>
          <div className="commitment-item">
            <span className="commitment-icon">🛡</span>
            Your data is private and secure
          </div>
          <div className="commitment-item">
            <span className="commitment-icon">💝</span>
            Non-judgmental, supportive environment
          </div>
          <div className="commitment-item">
            <span className="commitment-icon">📱</span>
            Tools for daily emotional wellbeing
          </div>
        </div>

        {/* Terms */}
        <div className="form-group">
          <label className="form-label">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              style={{ marginRight: '0.5rem' }}
            />
            I agree to the privacy terms and wellness guidelines
          </label>
          {errors.agreeToTerms && <div className="error-message show">{errors.agreeToTerms}</div>}
        </div>

        {/* Submit */}
        <button
          className={`signup-button ${isLoading ? 'loading' : ''}`}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Your Account...' : 'Begin My Wellness Journey'}
        </button>

        {/* Redirect */}
        <div className="login-redirect">
          Already supporting your mental health? <a href="/login">Continue your journey</a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
