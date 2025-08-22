import React, { useState, useEffect } from 'react';
import './HomePage.css';
import Navbar from '../Components/NavBar'; // Adjust path as needed
import Footer from '../Components/Footer/footer';

const HomePage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Priya S.",
      role: "Engineering Student",
      text: "This app helped me manage my exam anxiety with daily check-ins and breathing exercises. The CBT techniques really work!",
      rating: 5
    },
    {
      name: "Rahul M.",
      role: "Software Developer",
      text: "Working from home was affecting my mental health. The mindfulness prompts and mood tracking changed everything.",
      rating: 5
    },
    {
      name: "Ananya K.",
      role: "Graduate Student",
      text: "Finally, a safe space to journal my thoughts without judgment. The personalized coping strategies are amazing.",
      rating: 5
    }
  ];

  const features = [
    {
      icon: "🧠",
      title: "AI-Powered CBT Support",
      description: "Cognitive Behavioral Therapy techniques adapted for daily challenges and personalized to your needs."
    },
    {
      icon: "📝",
      title: "Mood Journaling",
      description: "Track your emotional patterns with guided prompts and insights to understand your mental health journey."
    },
    {
      icon: "🧘‍♀",
      title: "Mindfulness Practices",
      description: "Breathing exercises, meditation, and grounding techniques for stress relief and emotional balance."
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description: "Visualize your emotional wellbeing trends and celebrate your mental health victories."
    },
    {
      icon: "🤖",
      title: "24/7 Supportive Chat",
      description: "Your AI wellness companion is always available for empathetic conversations and guidance."
    },
    {
      icon: "🛡",
      title: "Privacy & Safety",
      description: "Your mental health data is encrypted and private. Crisis support resources are always available."
    }
  ];

  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      clearInterval(testimonialTimer);
    };
  }, []);

  const scrollToFeatures = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="homepage">
      {/* Include Navbar Component */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-text">AI-Powered Mental Wellness</span>
            </div>
            <h1 className="hero-title">
              Your Mental Health Journey
              <span className="highlight"> Starts Here</span>
            </h1>
            <p className="hero-description">
              Break the stigma. Manage anxiety, depression, and burnout with our AI companion 
              trained on CBT and mindfulness practices. Available 24/7 for students and professionals.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Available Support</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Private & Secure</span>
              </div>
              <div className="stat">
                <span className="stat-number">CBT</span>
                <span className="stat-label">Evidence-Based</span>
              </div>
            </div>
            <div className="hero-buttons">
              <a href="/signup" className="cta-button primary">
                Start Your Wellness Journey
                <span className="button-icon">→</span>
              </a>
              <button onClick={scrollToFeatures} className="cta-button secondary">
                Learn More
                <span className="button-icon">⬇</span>
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="wellness-illustration">
              <div className="floating-element brain">🧠</div>
              <div className="floating-element heart">💚</div>
              <div className="floating-element mindful">🧘‍♀</div>
              <div className="floating-element growth">🌱</div>
              <div className="central-circle">
                <span className="circle-text">Your Mental<br/>Wellness Hub</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="problem-section">
        <div className="container">
          <div className="problem-content">
            <h2 className="section-title">The Mental Health Crisis</h2>
            <div className="problem-grid">
              <div className="problem-card">
                <div className="problem-icon">😔</div>
                <h3>Post-Pandemic Impact</h3>
                <p>Anxiety, depression, and burnout have spiked among students and professionals worldwide.</p>
              </div>
              <div className="problem-card">
                <div className="problem-icon">🤐</div>
                <h3>Stigma Barrier</h3>
                <p>Fear of judgment prevents people from seeking the mental health support they desperately need.</p>
              </div>
              <div className="problem-card">
                <div className="problem-icon">⏰</div>
                <h3>Limited Access</h3>
                <p>Traditional therapy is expensive, time-consuming, and not available when you need it most.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Your Complete Wellness Toolkit</h2>
            <p className="section-subtitle">
              Evidence-based features designed to support your mental health journey
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="workflow-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="workflow-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Daily Check-in</h3>
                <p>Rate your mood and share what's on your mind in a safe, judgment-free space</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>AI Analysis</h3>
                <p>Our AI detects emotions and suggests personalized CBT exercises and mindfulness practices</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Guided Support</h3>
                <p>Practice coping strategies, breathing exercises, and journal your progress</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Track Progress</h3>
                <p>See your emotional patterns and celebrate your mental wellness milestones</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Stories of Healing</h2>
          <div className="testimonial-slider">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">"</div>
                <p className="testimonial-text">{testimonials[currentTestimonial].text}</p>
                <div className="testimonial-rating">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
                <div className="testimonial-author">
                  <strong>{testimonials[currentTestimonial].name}</strong>
                  <span>{testimonials[currentTestimonial].role}</span>
                </div>
              </div>
            </div>
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Privacy */}
      <section className="safety-section">
        <div className="container">
          <div className="safety-content">
            <div className="safety-text">
              <h2>Your Safety is Our Priority</h2>
              <div className="safety-features">
                <div className="safety-item">
                  <span className="safety-icon">🔒</span>
                  <div>
                    <h4>End-to-End Encryption</h4>
                    <p>Your conversations and journal entries are completely private</p>
                  </div>
                </div>
                <div className="safety-item">
                  <span className="safety-icon">🚨</span>
                  <div>
                    <h4>Crisis Support</h4>
                    <p>Immediate access to professional helplines and emergency resources</p>
                  </div>
                </div>
                <div className="safety-item">
                  <span className="safety-icon">👨‍⚕</span>
                  <div>
                    <h4>Clinically Reviewed</h4>
                    <p>Our CBT and mindfulness content is validated by mental health professionals</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="safety-visual">
              <div className="safety-badge">
                <span className="badge-icon">🛡</span>
                <span className="badge-text">Trusted & Secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Prioritize Your Mental Health?</h2>
            <p>Join thousands of students and professionals who've taken the first step toward emotional wellbeing</p>
            <div className="cta-buttons">
              <a href="/signup" className="cta-button primary large">
                Start Your Free Journey Today
                <span className="button-icon">✨</span>
              </a>
            </div>
            <p className="cta-note">
              💚 Free to start • 🔒 Completely private • 🧠 Evidence-based support
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default HomePage;