import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!username.trim()) {
      nextErrors.username = 'Username is required.';
    }

    if (!password.trim()) {
      nextErrors.password = 'Password is required.';
    }

    setErrors(nextErrors);
    setAuthError('');

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const success = login(username.trim(), password);

    if (!success) {
      setAuthError('Invalid username or password.');
      return;
    }

    const redirectPath = location.state?.from || '/home';
    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Pharmacist Login</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {authError && <p className="error-message">{authError}</p>}

          <button type="submit" className="primary-button full-width">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
