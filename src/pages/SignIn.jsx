// src/pages/SignIn.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '../components/FormInput';
import '../styles/auth/main.scss';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Signing in with:', formData);
      setIsLoading(false);
      // navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="auth__container">
      <div className="auth__left">
        <h1 className="auth__left-title">Welcome Back</h1>
        <p className="auth__left-subtitle">
          Sign in to access your learning dashboard and continue your educational journey.
        </p>
      </div>
      <div className="auth__right">
        <div className="auth__form">
          <h2 className="auth__form-title">Sign In</h2>
          <form onSubmit={handleSubmit}>
            <FormInput
              id="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              error={errors.email}
            />
            <FormInput
              id="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              error={errors.password}
            />
            <div className="auth__group" style={{ textAlign: 'right' }}>
              <a href="/forgot-password" className="auth__link">
                Forgot password?
              </a>
            </div>
            <button 
              type="submit" 
              className="auth__button auth__button--primary"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="auth__divider">
            <span>OR</span>
          </div>
          <div className="auth__footer">
            <p>
              Don't have an account?{' '}
              <a href="/signup" className="auth__link">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;