import { FormInput } from '../../components/formInput';
import useSignUp from './useSignUp';

const SignUp = () => {
  const {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit
  } = useSignUp();
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