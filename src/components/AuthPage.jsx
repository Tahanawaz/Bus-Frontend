import PasswordField from './PasswordField';
import { api } from '../api';
import RouteArtwork from './RouteArtwork';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ArrowRight, MapPin, Route, Radio, ArrowLeft } from 'lucide-react';
import Brand from './Brand';

export default function AuthPage({ signup = false }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', institute_id: '' });
  const [challenge,setChallenge]=useState(null);
  const [newPassword,setNewPassword]=useState('');
  const [confirmPassword,setConfirmPassword]=useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [institutes, setInstitutes] = useState([]);
  const [notice, setNotice] = useState(() => sessionStorage.getItem('loginNotice') || '');
  useEffect(() => {
    sessionStorage.removeItem('loginNotice');
    if(signup) api.get('/institutes/public').then(r => setInstitutes(r.data)).catch(() => setNotice('Unable to load institutes. Please refresh.'));
  }, [signup]);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if(challenge) {
        await api.post('/auth/change-initial-password',{changeToken:challenge,password:newPassword,confirmPassword});
        setChallenge(null);setNewPassword('');setConfirmPassword('');setForm({...form,password:''});setNotice('Password changed. Sign in with your new password.');return;
      }
      if (signup) {
        await axios.post('http://localhost:5001/api/auth/signup', { ...form, role: 'student' });
        sessionStorage.setItem('loginNotice', 'Account created. Your institute admin will activate access after recording your payment.');
        toast.success('Account created. Awaiting institute activation.');
        navigate('/login');
      } else {
        const { data } = await axios.post('http://localhost:5001/api/auth/login', { email: form.email, password: form.password });
        if(data.requiresPasswordChange) {
          localStorage.removeItem('token');localStorage.removeItem('user');
          setChallenge(data.changeToken);setForm({...form,password:''});setNotice('Set a new password before accessing your account.');return;
        }
        localStorage.removeItem('instituteScope');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Welcome back, ' + data.user.name + '!');
        navigate(data.user.role === 'superadmin' ? '/admin' : '/' + (['admin', 'driver'].includes(data.user.role) ? data.user.role : 'student'));
      }
    } catch (err) { setNotice(err.response?.data?.error || 'Unable to connect. Please try again.'); }
    finally { setLoading(false); }
  };
  return <div className="auth-page">
    <section className="auth-story">
      <Brand />
      <div className="auth-story-copy"><span className="eyebrow">A BETTER WAY TO CAMPUS</span><h1>Your journey.<br />A little <em>smarter.</em></h1><p>Less waiting. More knowing. Stay connected to your campus commute, wherever you are.</p></div>
      <div className="auth-photo"><RouteArtwork /><span className="photo-caption"><MapPin size={16} /> Every journey starts with a connection.</span></div>
      <div className="auth-benefits"><span><Radio size={17} /> Live bus tracking</span><span><Route size={17} /> Campus routes</span></div>
    </section>
    <section className="auth-form-panel">
      <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to home</Link>
      <div className="auth-form-card"><span className="eyebrow">{signup ? 'YOUR CAMPUS JOURNEY STARTS HERE' : 'GOOD TO SEE YOU AGAIN'}</span><h2>{challenge ? 'Set your password' : signup ? 'Make your next move.' : 'Welcome back.'}</h2><p>{signup ? 'Create a student account to find your bus and plan your day.' : 'Sign in to keep your campus commute on track.'}</p>
        {notice && <div className="login-notice" role="alert">{notice}</div>}
        <form onSubmit={submit}>
          {signup && <label htmlFor="name">Full name<input id="name" name="name" autoComplete="name" placeholder="Your full name" value={form.name} onChange={change} required /></label>}
          {signup && <label htmlFor="institute">Institute<select id="institute" name="institute_id" required value={form.institute_id} onChange={change}><option value="">Select your institute</option>{institutes.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</select></label>}
          {!challenge&&<label htmlFor="email">Email address<input id="email" name="email" type="email" autoComplete="email" placeholder="you@university.edu" value={form.email} onChange={change} required /></label>}
          {challenge?<><PasswordField label="New password" required minLength={8} autoComplete="new-password" value={newPassword} onChange={e=>setNewPassword(e.target.value)}/><PasswordField label="Confirm new password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}/><p className="form-note">Use at least 8 characters. Your temporary password cannot be reused.</p></>:<PasswordField label={signup?'Temporary password':'Password'} name="password" autoComplete={signup?'off':'current-password'} value={signup?'password123':form.password} readOnly={signup} onChange={change} required/>}
          {signup && <div className="form-note">Student registration. Driver accounts are managed by your transport office.</div>}
          <button className="primary-button auth-submit" disabled={loading}>{loading ? 'Please wait...' : challenge ? 'Save password' : signup ? 'Create account' : 'Sign in'}{!loading && <ArrowRight size={18} />}</button>
        {challenge&&<button type="button" className="secondary-button" disabled={loading} onClick={()=>{setChallenge(null);setNewPassword('');setConfirmPassword('');setNotice('');}}>Back to sign in</button>}
        </form>
        <p className="auth-switch">{signup ? 'Already part of SmartBus?' : 'New to SmartBus?'} <Link to={signup ? '/login' : '/signup'}>{signup ? 'Sign in' : 'Create an account'}</Link></p>
      </div><span className="auth-footnote">Every institute. Every route. All connected.</span>
    </section>
  </div>;
}
