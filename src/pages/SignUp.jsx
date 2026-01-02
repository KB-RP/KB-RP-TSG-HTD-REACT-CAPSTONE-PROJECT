// src/pages/SignUp.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '../components/FormInput';
import '../styles/auth/main.scss';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      console.log('Signing up with:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });
      setIsLoading(false);
      // navigate('/signin');
    }, 1500);
  };

  return (
    <div className="auth__container">
      <div className="auth__left">
        <h1 className="auth__left-title">Join Our Learning Community</h1>
        <p className="auth__left-subtitle">
          Create an account to access exclusive courses and track your learning progress.
        </p>
      </div>
      <div className="auth__right">
        <div className="auth__form">
          <h2 className="auth__form-title">Create Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="auth__group auth__group--inline">
              <div style={{ flex: 1 }}>
                <FormInput
                  id="firstName"
                  label="First Name"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                  error={errors.firstName}
                />
              </div>
              <div style={{ flex: 1 }}>
                <FormInput
                  id="lastName"
                  label="Last Name"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                  error={errors.lastName}
                />
              </div>
            </div>
            
            <FormInput
              id="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
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
            
            <FormInput
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              error={errors.confirmPassword}
            />
            
            <button 
              type="submit" 
              className="auth__button auth__button--primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          
          <div className="auth__divider">
            <span>OR</span>
          </div>
          
          <div className="auth__footer">
            <p>
              Already have an account?{' '}
              <a href="/signin" className="auth__link">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;