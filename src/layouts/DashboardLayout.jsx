import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Map, Bus, Users, Route, LayoutDashboard, Menu, LogOut, X, ArrowUpRight, GraduationCap } from 'lucide-react';
import Brand from '../components/Brand';
const menus = {
  admin: [['Overview', LayoutDashboard, '/admin'], ['Bus fleet', Bus, '/admin/buses'], ['Drivers', Users, '/admin/drivers'], ['Students', GraduationCap, '/admin/students'], ['Routes & stops', Route, '/admin/routes']],
  student: [['Live tracking', Map, '/student'], ['Routes & schedules', Route, '/student/buses']],
  driver: [['My journey', Bus, '/driver']]
};
export default function DashboardLayout({ role }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); };
  return <div className="dashboard-shell">
    {open && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setOpen(false)} />}
    <aside className={'sidebar ' + (open ? 'is-open' : '')}><div className="sidebar-brand"><Brand /><button className="icon-button mobile-only" aria-label="Close navigation" onClick={() => setOpen(false)}><X size={20} /></button></div><span className="sidebar-label">{role === 'admin' ? 'WORKSPACE' : 'YOUR CAMPUS'}</span><nav aria-label="Main navigation">{menus[role].map(([title, Icon, path]) => <Link key={path} to={path} onClick={() => setOpen(false)} aria-current={pathname === path ? 'page' : undefined} className={'sidebar-link ' + (pathname === path ? 'active' : '')}><Icon size={20} /><span>{title}</span>{pathname === path && <span className="nav-indicator" />}</Link>)}</nav><div className="sidebar-bottom"><div className="sidebar-tip"><span className="mini-icon"><Route size={21} /></span><strong>Every route, connected.</strong><p>Your campus journey, all in one place.</p><Link to="/">Explore SmartBus <ArrowUpRight size={15} /></Link></div><button className="logout-button" onClick={logout}><LogOut size={18} /> Sign out</button></div></aside>
    <div className="dashboard-body"><header className="dashboard-topbar"><div className="topbar-breadcrumb"><button className="icon-button mobile-only" aria-label="Open navigation" onClick={() => setOpen(true)}><Menu size={21} /></button><span className="role-label">{role} workspace</span><span className="breadcrumb-divider">/</span><strong>{menus[role].find(([, , path]) => path === pathname)?.[0]}</strong></div><div className="user-profile"><span className="user-avatar">{user?.name?.charAt(0) || 'U'}</span><div><strong>{user?.name}</strong><span>{role === 'admin' ? 'Transport administrator' : role + ' account'}</span></div></div></header><main className="dashboard-content"><div className="page-enter" key={pathname}><Outlet /></div></main></div>
  </div>;
}
