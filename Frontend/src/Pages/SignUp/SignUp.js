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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Calculate password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

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
      // Prepare payload
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password
      };

      const res = await fetch("http://localhost:4004/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("🎉 Account created successfully!");
        window.location.href = "/profile";
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'weak': return 'Weak password';
      case 'medium': return 'Medium strength';
      case 'strong': return 'Strong password!';
      default: return '';
    }
  };

  return (
    <>
      <div className="signup-container">
        <div className="signup-form">
          <h2 className="signup-title">Create Account</h2>
          <p className="signup-subtitle">Join us today and start your journey!</p>
          
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
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
              />
              {errors.firstName && (
                <div className={`error-message ${errors.firstName ? 'show' : ''}`}>
                  {errors.firstName}
                </div>
              )}
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
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
              />
              {errors.lastName && (
                <div className={`error-message ${errors.lastName ? 'show' : ''}`}>
                  {errors.lastName}
                </div>
              )}
            </div>
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
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john.doe@example.com"
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
              className={`form-input ${errors.password ? 'error' : passwordStrength === 'strong' ? 'success' : ''}`}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a strong password"
            />
            {formData.password && (
              <div className={`password-strength strength-${passwordStrength} show`}>
                {getPasswordStrengthText()}
              </div>
            )}
            {errors.password && (
              <div className={`error-message ${errors.password ? 'show' : ''}`}>
                {errors.password}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`form-input ${errors.confirmPassword ? 'error' : formData.confirmPassword && formData.password === formData.confirmPassword ? 'success' : ''}`}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <div className={`error-message ${errors.confirmPassword ? 'show' : ''}`}>
                {errors.confirmPassword}
              </div>
            )}
            {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
              <div className="success-message show">
                Passwords match!
              </div>
            )}
          </div>

          {errors.agreeToTerms && (
            <div className={`error-message ${errors.agreeToTerms ? 'show' : ''}`} style={{ marginTop: '-1rem', marginBottom: '1rem' }}>
              {errors.agreeToTerms}
            </div>
          )}

          <button 
            type="button" 
            className={`signup-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="login-redirect">
            Already have an account? <a href="/Login">Login</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;