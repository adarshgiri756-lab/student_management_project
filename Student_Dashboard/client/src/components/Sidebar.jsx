import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const adminLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/students', label: 'Students' },
    { to: '/tasks', label: 'Tasks' }
  ];
  const studentLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/my-tasks', label: 'My Tasks' }
  ];
  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand">
        <div className="brand-mark">SD</div>
        <div>
          <strong>Student Desk</strong>
          <span>{user?.role === 'admin' ? 'Admin Portal' : 'Student Portal'}</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} onClick={onClose}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
