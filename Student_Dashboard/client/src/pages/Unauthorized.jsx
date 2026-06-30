import { Link } from 'react-router-dom';

const Unauthorized = () => (
  <main className="center-page">
    <section className="panel compact-panel">
      <p className="eyebrow">403</p>
      <h1>Unauthorized</h1>
      <p className="muted">You do not have permission to open this page.</p>
      <Link className="btn primary" to="/">Back to Dashboard</Link>
    </section>
  </main>
);

export default Unauthorized;
