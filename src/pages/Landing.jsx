import RouteArtwork from '../components/RouteArtwork';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Radio, Route, Bell, ArrowUpRight, BusFront, CircleCheck, Headphones, LockKeyhole, ShieldCheck } from 'lucide-react';
import Brand from '../components/Brand';
import { useEffect, useState } from 'react';
import { api, API_URL } from '../api';
const features = [
  { icon: Radio, number: '01', title: 'Know where your bus is.', description: 'Follow the location shared by your driver on a live map. No more guessing at the bus stop.', color: 'blue' },
  { icon: Route, number: '02', title: 'Find your way around.', description: 'Explore campus routes, scheduled stops, and assigned buses before you head out.', color: 'mint' },
  { icon: Bell, number: '03', title: 'Stay in the loop.', description: 'See arrival and traffic-delay updates from your driver as your journey unfolds.', color: 'peach' }
];
export default function Landing() {
  const [policies,setPolicies]=useState({});
  useEffect(()=>{api.get('/policies').then(({data})=>setPolicies(Object.fromEntries(data.map(item=>[item.type,item])))).catch(()=>{});},[]);
  const policyUrl=type=>policies[type]?`${API_URL}/api/policies/${type}/pdf`:null;
  return <div className="landing-page">
    <nav className="landing-nav"><Brand /><div className="landing-links"><a href="#features">Why SmartBus</a><a href="#how-it-works">How it works</a><Link className="primary-button small-button" to="/login">Sign in <ArrowUpRight size={17} /></Link></div></nav>
    <main>
      <section className="landing-hero">
        <div className="hero-copy"><span className="eyebrow hero-eyebrow"><span className="status-dot" /> YOUR CAMPUS. IN MOTION.</span><h1>Less waiting.<br />More <span>living.</span></h1><p>Your bus, your route, your day. See your campus shuttle on the map and head out with a little more confidence.</p><div className="hero-actions"><Link to="/login" className="primary-button">Sign in <ArrowRight size={19} /></Link><a href="#how-it-works" className="secondary-button">See how it works</a></div><div className="hero-caption"><span className="mini-icon"><BusFront size={19} /></span><span>Built for campus life.<br /><strong>Made for everyone on the move.</strong></span></div></div>
        <div className="hero-visual"><div className="hero-photo"><RouteArtwork /><div className="hero-photo-label"><span>THE WAY FORWARD</span><strong>A better everyday journey.</strong></div></div><div className="floating-route"><span className="route-icon"><Route size={22} /></span><div><strong>Campus, connected.</strong><span>Routes & stops in one place</span></div><ArrowUpRight size={20} /></div><div className="floating-map"><MapPin size={19} /><span>Your next stop.<strong>One glance away.</strong></span></div></div>
      </section>
      <div className="feature-strip"><span>Small details. Better commutes.</span><span><Radio size={19} /> Live location</span><span><Route size={19} /> Route schedules</span><span><Bell size={19} /> Journey updates</span></div>
      <section id="features" className="landing-section"><div className="section-heading"><div><span className="eyebrow">EVERYTHING IN ONE PLACE</span><h2>A smoother ride<br />starts here.</h2></div><p>From your first lecture to your last stop, keep the information you need close at hand.</p></div><div className="feature-cards">{features.map(({ icon: Icon, number, title, description, color }) => <article className={'feature-card ' + color} key={number}><div className="feature-card-top"><span className="feature-icon"><Icon size={25} /></span><span>{number}</span></div><h3>{title}</h3><p>{description}</p></article>)}</div></section>
      <section id="how-it-works" className="journey-section"><div><span className="eyebrow">LESS SETUP. MORE GO.</span><h2>You're three steps<br />from a smarter commute.</h2><Link to="/login" className="text-link">Sign in <ArrowRight size={18} /></Link></div><div className="journey-steps">{[['Get access', 'Your institute administrator creates and activates your student account.'], ['Choose your route', 'Browse the schedule and find your campus bus.'], ['Track and travel', 'Open the live map and follow your journey.']].map(([title, desc], i) => <div className="journey-step" key={title}><span>{i + 1}</span><div><h3>{title}</h3><p>{desc}</p></div></div>)}</div></section>
      <section className="landing-cta"><div><span className="eyebrow">NEXT STOP: A BETTER DAY</span><h2>Campus life moves fast.<br />Keep up with SmartBus.</h2></div><Link to="/login" className="primary-button">Sign in <ArrowRight size={19} /></Link></section>
    </main><footer className="site-footer">
      <div className="footer-main">
        <section className="footer-brand-column" aria-label="About SmartTrack"><Brand/><p>Real-time campus transport tracking for safer, smarter everyday journeys.</p><span className="footer-status"><span className="status-dot"/>Live transport platform</span></section>
        <nav className="footer-column" aria-label="Explore SmartTrack"><h3>Explore</h3><a href="#features">Why SmartTrack</a><a href="#how-it-works">How it works</a><Link to="/login">Live bus tracking</Link></nav>
        <nav className="footer-column" aria-label="Transport portals"><h3>Transport portal</h3><Link to="/login">Student access</Link><Link to="/login">Driver access</Link><Link to="/login">Admin access</Link></nav>
        <section className="footer-column footer-support"><h3>Support</h3><Link to="/login"><LockKeyhole size={15}/>Account access</Link><a href="#how-it-works"><Headphones size={15}/>Tracking help</a><span><CircleCheck size={15}/>Account issues are handled by your institute administrator.</span></section>
      </div>
      <div className="footer-policies">
        <details id="location-privacy"><summary><ShieldCheck size={15}/>Location privacy</summary><p>Live bus location is used for transport tracking and is visible only through authorised SmartTrack accounts. Drivers control mobile GPS sharing.</p>{policyUrl('privacy')&&<a href={policyUrl('privacy')} target="_blank" rel="noreferrer">Read the full Privacy Policy <ArrowUpRight size={14}/></a>}</details>
        <details id="terms"><summary>Terms of use</summary><p>Use SmartTrack only for authorised campus transport operations. Account access is issued and managed by participating institutes.</p>{policyUrl('terms')&&<a href={policyUrl('terms')} target="_blank" rel="noreferrer">Read the full Terms of Use <ArrowUpRight size={14}/></a>}</details>
      </div>
      <div className="footer-bottom"><div><a href={policyUrl('privacy')||'#location-privacy'} target={policyUrl('privacy')?'_blank':undefined} rel={policyUrl('privacy')?'noreferrer':undefined}>Privacy</a><a href={policyUrl('terms')||'#terms'} target={policyUrl('terms')?'_blank':undefined} rel={policyUrl('terms')?'noreferrer':undefined}>Terms</a></div><span className="footer-copyright">© {new Date().getFullYear()} SmartTrack. All rights reserved.</span><span className="footer-made">Built for campus transport.</span></div>
    </footer>
  </div>;
}
