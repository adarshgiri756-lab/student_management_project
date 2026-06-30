import { Link } from 'react-router-dom';

const NotFound = () => (
  <main className="center-page">
    <section className="panel compact-panel">
      <p className="eyebrow">404</p>
      <h1>Page Not Found</h1>
      <p className="muted">The page you requested does not exist.</p>
      <Link className="btn primary" to="/">Back to Dashboard</Link>
    </section>
  </main>
);

export default NotFound;
