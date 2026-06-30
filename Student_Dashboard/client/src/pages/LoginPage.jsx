import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ studentId: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/');
    } catch (requestError) {
      if (!requestError.response) {
        setError('Server is not running. Start the backend and MongoDB, then try again.');
      } else {
        setError(requestError.response?.data?.message || 'Invalid Student ID or Password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-copy">
          <div className="brand-mark large">SD</div>
          <p className="eyebrow">Student Task Dashboard</p>
          <h1>Stay current with every class task.</h1>
          <p>Secure dashboards for administrators and students with task progress, deadlines, and activity in one place.</p>
        </div>
        <form className="login-card" onSubmit={handleSubmit}>
          <h2>Login</h2>
          {error && <div className="alert error">{error}</div>}
          <label>
            Student ID
            <input name="studentId" value={form.studentId} onChange={handleChange} autoComplete="username" required />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} autoComplete="current-password" required />
          </label>
          <button type="submit" className="btn primary full" disabled={loading}>
            {loading ? <LoadingSpinner label="Signing in..." /> : 'Open Dashboard'}
          </button>
          <p className="muted small">Default admin: 1001 / 123456</p>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
