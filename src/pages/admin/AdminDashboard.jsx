import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { Bus, Users, GraduationCap, Route, ArrowUpRight, Plus, MapPin } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
    const load = async () => {
      try {
        const [stats, buses] = await Promise.all([
          axios.get('http://localhost:5001/api/buses/analytics', { headers }),
          axios.get('http://localhost:5001/api/buses', { headers })
        ]);
        if (active) { setData({ ...stats.data, buses: buses.data }); setError(''); }
      } catch { if (active) setError('Unable to load your fleet. Please refresh to try again.'); }
    };
    load();
    const socket = io('http://localhost:5001');
    socket.on('connect', load);
    socket.on('statusUpdate', load);
    socket.on('busUpdated', load);
    return () => { active = false; socket.disconnect(); };
  }, []);
  const cards = [
    { title: 'Total buses', value: data?.totalBuses, caption: 'In your campus fleet', icon: Bus, color: 'blue', category: 'FLEET', unit: 'buses', path: '/admin/buses', action: 'View fleet' },
    { title: 'Active status', value: data?.activeBuses, caption: 'Based on reported bus status', icon: MapPin, color: 'mint', category: 'OPERATIONS', unit: 'active', path: '/admin/buses', action: 'View bus statuses' },
    { title: 'Drivers', value: data?.totalDrivers, caption: 'Registered driver accounts', icon: Users, color: 'amber', category: 'YOUR TEAM', unit: 'drivers', path: '/admin/drivers', action: 'Manage drivers' },
    { title: 'Students', value: data?.totalStudents, caption: 'Connected to your campus', icon: GraduationCap, color: 'violet', category: 'COMMUNITY', unit: 'students', path: '/admin/students', action: 'View students' }
  ];
  return <div>
    <div className="overview-heading"><div><span className="overview-kicker">YOUR CAMPUS AT A GLANCE</span><h1>A clearer view. A better journey.</h1><p>Keep your fleet, people, and campus routes moving together.</p></div><Link to="/admin/buses" className="secondary-button"><Plus size={16} /> Manage fleet</Link></div>
    {error && <div className="error-notice" role="alert">{error}</div>}
    <div className="overview-stats" aria-label="Campus statistics">
      {cards.map(({ title, value, caption, icon: Icon, color, category, unit, path, action }) => (
        <Link className={'stat-card metric-card metric-' + color} to={path} key={title} aria-label={title + ': ' + (value ?? (error ? 'unavailable' : 'loading')) + '. ' + action}>
          <Icon className="metric-watermark" size={118} strokeWidth={1} aria-hidden="true" />
          <div className="metric-heading">
            <span className="metric-icon"><Icon size={23} strokeWidth={1.8} aria-hidden="true" /></span>
            <div><span className="metric-category">{category}</span><h2>{title}</h2></div>
          </div>
          <div className="metric-value-row">
            {value == null ? <span className={error ? 'metric-unavailable' : 'metric-skeleton'}>{error ? '--' : <span className="sr-only">Loading</span>}</span> : <strong className="metric-value" key={value}>{value.toLocaleString()}</strong>}
            <span className="metric-unit">{unit}</span>
          </div>
          <p className="metric-description">{caption}</p>
          <div className="metric-footer"><span><i aria-hidden="true" />{action}</span><ArrowUpRight size={17} aria-hidden="true" /></div>
        </Link>
      ))}
    </div>
    <div className="overview-columns"><section className="overview-panel"><div className="panel-title"><h2>Fleet overview</h2><Link to="/admin/buses">View all buses ?</Link></div>{!data ? <p className="empty-state">{error ? 'Fleet unavailable' : 'Loading your fleet?'}</p> : !data.buses.length ? <p className="empty-state">Your fleet starts here. Add your first bus to get moving.</p> : data.buses.slice(0, 5).map(bus => <div className="bus-overview-row" key={bus.id}><span className="mini-icon"><Bus size={20} /></span><div><strong>{bus.name}</strong><p>{bus.number_plate} ? {bus.route || 'Route unassigned'}</p></div><span className="status-pill">{bus.status || 'No status'}</span></div>)}</section>
    <section className="overview-panel"><div className="panel-title"><h2>Your workspace</h2><span className="overview-kicker">QUICK ACCESS</span></div>{[
      { title: 'Plan your routes', desc: 'Manage stops and scheduled times', path: '/admin/routes', icon: Route },
      { title: 'Manage your drivers', desc: 'Keep your transport team connected', path: '/admin/drivers', icon: Users },
      { title: 'Student community', desc: 'View and manage student accounts', path: '/admin/students', icon: GraduationCap }
    ].map(({ title, desc, path, icon: Icon }) => <Link to={path} className="quick-action" key={path}><span className="mini-icon"><Icon size={19} /></span><div><strong>{title}</strong><p>{desc}</p></div><ArrowUpRight size={18} /></Link>)}</section></div>
    <div className="overview-banner"><Route size={35} /><div><h3>Good journeys start with a little planning.</h3><p>Assign a driver and route to each bus so your campus community knows which way to go.</p></div></div>
  </div>;
}
