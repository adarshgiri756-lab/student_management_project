import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileModal from './ProfileModal';

const Navbar = ({ onMenuClick, showToast }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <header className="topbar">
        <button type="button" className="icon-button menu-button" onClick={onMenuClick} aria-label="Open menu">
          =
        </button>
        <div>
          <p className="eyebrow">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
          <h1>Welcome {user?.role === 'admin' ? 'Admin' : user?.name}</h1>
        </div>
        <div className="topbar-actions">
          <button type="button" className="btn secondary" onClick={() => setProfileOpen(true)}>
            Profile
          </button>
          <button type="button" className="btn primary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} showToast={showToast} />
    </>
  );
};

export default Navbar;
