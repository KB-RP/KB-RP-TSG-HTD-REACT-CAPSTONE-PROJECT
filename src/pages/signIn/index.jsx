import { FormInput } from '../../components/FormInput';
import '../../styles/auth/main.scss';
import useSignIn from './useSignIn';

const SignIn = () => {
  const {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit
  } = useSignIn();

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