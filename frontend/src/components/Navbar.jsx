import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">Drug Inventory</div>
      <div className="nav-links">
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/medicines">Medicine List</NavLink>
        <NavLink to="/medicines/add">Add Medicine</NavLink>
      </div>
      <button type="button" className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}
