import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfileModal = ({ open, onClose, showToast }) => {
  const { user, updatePassword } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updatePassword(form);
      setForm({ currentPassword: '', newPassword: '' });
      showToast('Password changed successfully.');
      onClose();
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to change password.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal panel">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Profile</p>
            <h2>{user?.name}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close profile">
            x
          </button>
        </div>
        <div className="profile-grid">
          <div><span>Student ID</span><strong>{user?.studentId}</strong></div>
          <div><span>Email</span><strong>{user?.email}</strong></div>
          <div><span>Role</span><strong>{user?.role}</strong></div>
          {user?.role === 'student' && (
            <>
              <div><span>Branch</span><strong>{user?.branch}</strong></div>
              <div><span>Semester</span><strong>{user?.semester}</strong></div>
              <div><span>Section</span><strong>{user?.section}</strong></div>
            </>
          )}
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Current Password
            <input name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} required />
          </label>
          <label>
            New Password
            <input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} required minLength="6" />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>
              Close
            </button>
            <button type="submit" className="btn primary" disabled={saving}>
              {saving ? 'Saving...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
