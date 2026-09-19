import PasswordField from './PasswordField';
import { api } from '../api';
import RouteArtwork from './RouteArtwork';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ArrowRight, MapPin, Route, Radio, ArrowLeft, UserRound, Mail, Building2, LockKeyhole, CheckCircle2, ShieldCheck, BusFront } from 'lucide-react';
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
      <div className="auth-story-top"><Brand /><span className="auth-trust-pill"><span className="status-dot"/>Live transport network</span></div>
      <div className="auth-story-copy"><span className="eyebrow">SMARTER CAMPUS TRANSPORT</span><h1>{signup?'Join your campus.':'Welcome back.'}<br /><em>{signup?'Move with confidence.':'Your route is ready.'}</em></h1><p>{signup?'Create your student account, connect with your institute and know where your bus is before you leave.':'Sign in to manage journeys, follow live buses and keep every campus route connected.'}</p></div>
      <div className="auth-photo"><RouteArtwork /><div className="auth-route-card"><span><BusFront size={18}/></span><div><small>NEXT DEPARTURE</small><strong>Campus route · On time</strong></div><Radio size={16}/></div><span className="photo-caption"><MapPin size={16} /> Live location and schedules in one place.</span></div>
      <div className="auth-benefits"><span><Radio size={17} /> Live tracking</span><span><Route size={17} /> Route schedules</span><span><ShieldCheck size={17} /> Secure access</span></div>
    </section>
    <section className="auth-form-panel">
      <div className="auth-panel-top"><Link to="/" className="back-link"><ArrowLeft size={16} /> Back to home</Link><div className="auth-mobile-brand"><Brand /></div></div>
      <div className="auth-form-card">
        {!challenge&&<div className="auth-mode-switch" aria-label="Authentication options"><Link className={!signup?'active':''} to="/login">Sign in</Link><Link className={signup?'active':''} to="/signup">Create account</Link></div>}
        <span className="auth-card-icon">{challenge?<LockKeyhole size={21}/>:signup?<UserRound size={21}/>:<ShieldCheck size={21}/>}</span>
        <span className="eyebrow">{challenge ? 'SECURE YOUR ACCOUNT' : signup ? 'STUDENT REGISTRATION' : 'SECURE ACCOUNT ACCESS'}</span><h2>{challenge ? 'Choose a new password' : signup ? 'Create your account' : 'Sign in to SmartBus'}</h2><p>{challenge?'Replace your temporary password before entering your workspace.':signup ? 'Use your institute details to start tracking campus transport.' : 'Enter your account details to continue to your workspace.'}</p>
        {notice && <div className="login-notice" role="alert">{notice}</div>}
        <form onSubmit={submit}>
          {signup && <label htmlFor="name">Full name<span className="auth-input-wrap"><UserRound size={17}/><input id="name" name="name" autoComplete="name" placeholder="Enter your full name" value={form.name} onChange={change} required /></span></label>}
          {signup && <label htmlFor="institute">Institute<span className="auth-input-wrap"><Building2 size={17}/><select id="institute" name="institute_id" required value={form.institute_id} onChange={change}><option value="">Select your institute</option>{institutes.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</select></span></label>}
          {!challenge&&<label htmlFor="email">Email address<span className="auth-input-wrap"><Mail size={17}/><input id="email" name="email" type="email" autoComplete="email" placeholder="you@university.edu" value={form.email} onChange={change} required /></span></label>}
          {challenge?<><PasswordField icon={LockKeyhole} label="New password" required minLength={8} autoComplete="new-password" value={newPassword} onChange={e=>setNewPassword(e.target.value)}/><PasswordField icon={LockKeyhole} label="Confirm new password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}/><p className="form-note"><CheckCircle2 size={16}/>Use at least 8 characters. Your temporary password cannot be reused.</p></>:<PasswordField icon={LockKeyhole} label={signup?'Temporary password':'Password'} name="password" autoComplete={signup?'off':'current-password'} value={signup?'password123':form.password} readOnly={signup} onChange={change} required/>}
          {signup && <div className="form-note"><CheckCircle2 size={16}/>Your institute activates student access after confirming payment.</div>}
          <button className="primary-button auth-submit" disabled={loading}>{loading ? 'Please wait...' : challenge ? 'Save password' : signup ? 'Create account' : 'Sign in'}{!loading && <ArrowRight size={18} />}</button>
        {challenge&&<button type="button" className="secondary-button" disabled={loading} onClick={()=>{setChallenge(null);setNewPassword('');setConfirmPassword('');setNotice('');}}>Back to sign in</button>}
        </form>
        {!challenge&&<p className="auth-switch">{signup ? 'Already have an account?' : 'New to SmartBus?'} <Link to={signup ? '/login' : '/signup'}>{signup ? 'Sign in instead' : 'Create student account'}</Link></p>}
      </div><span className="auth-footnote"><ShieldCheck size={13}/>Protected account access · SmartBus Campus</span>
    </section>
  </div>;
}
