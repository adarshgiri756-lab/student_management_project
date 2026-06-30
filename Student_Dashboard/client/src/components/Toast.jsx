const Toast = ({ toast, onClose }) => {
  if (!toast?.message) return null;

  return (
    <div className={`toast toast-${toast.type || 'success'}`} role="status">
      <span>{toast.message}</span>
      <button type="button" className="icon-button" onClick={onClose} aria-label="Close notification">
        x
      </button>
    </div>
  );
};

export default Toast;
