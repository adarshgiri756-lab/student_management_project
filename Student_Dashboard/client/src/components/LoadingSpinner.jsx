const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="loading-state">
    <span className="spinner" aria-hidden="true"></span>
    <span>{label}</span>
  </div>
);

export default LoadingSpinner;
