import RouteArtwork from '../components/RouteArtwork';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Radio, Route, Bell, ArrowUpRight, BusFront } from 'lucide-react';
import Brand from '../components/Brand';
const features = [
  { icon: Radio, number: '01', title: 'Know where your bus is.', description: 'Follow the location shared by your driver on a live map. No more guessing at the bus stop.', color: 'blue' },
  { icon: Route, number: '02', title: 'Find your way around.', description: 'Explore campus routes, scheduled stops, and assigned buses before you head out.', color: 'mint' },
  { icon: Bell, number: '03', title: 'Stay in the loop.', description: 'See arrival and traffic-delay updates from your driver as your journey unfolds.', color: 'peach' }
];
export default function Landing() {
  return <div className="landing-page">
    <nav className="landing-nav"><Brand /><div className="landing-links"><a href="#features">Why SmartBus</a><a href="#how-it-works">How it works</a><Link to="/login">Sign in</Link><Link className="primary-button small-button" to="/signup">Get started <ArrowUpRight size={17} /></Link></div></nav>
    <main>
      <section className="landing-hero">
        <div className="hero-copy"><span className="eyebrow hero-eyebrow"><span className="status-dot" /> YOUR CAMPUS. IN MOTION.</span><h1>Less waiting.<br />More <span>living.</span></h1><p>Your bus, your route, your day. See your campus shuttle on the map and head out with a little more confidence.</p><div className="hero-actions"><Link to="/signup" className="primary-button">Find your next ride <ArrowRight size={19} /></Link><a href="#how-it-works" className="secondary-button">See how it works</a></div><div className="hero-caption"><span className="mini-icon"><BusFront size={19} /></span><span>Built for campus life.<br /><strong>Made for everyone on the move.</strong></span></div></div>
        <div className="hero-visual"><div className="hero-photo"><RouteArtwork /><div className="hero-photo-label"><span>THE WAY FORWARD</span><strong>A better everyday journey.</strong></div></div><div className="floating-route"><span className="route-icon"><Route size={22} /></span><div><strong>Campus, connected.</strong><span>Routes & stops in one place</span></div><ArrowUpRight size={20} /></div><div className="floating-map"><MapPin size={19} /><span>Your next stop.<strong>One glance away.</strong></span></div></div>
      </section>
      <div className="feature-strip"><span>Small details. Better commutes.</span><span><Radio size={19} /> Live location</span><span><Route size={19} /> Route schedules</span><span><Bell size={19} /> Journey updates</span></div>
      <section id="features" className="landing-section"><div className="section-heading"><div><span className="eyebrow">EVERYTHING IN ONE PLACE</span><h2>A smoother ride<br />starts here.</h2></div><p>From your first lecture to your last stop, keep the information you need close at hand.</p></div><div className="feature-cards">{features.map(({ icon: Icon, number, title, description, color }) => <article className={'feature-card ' + color} key={number}><div className="feature-card-top"><span className="feature-icon"><Icon size={25} /></span><span>{number}</span></div><h3>{title}</h3><p>{description}</p></article>)}</div></section>
      <section id="how-it-works" className="journey-section"><div><span className="eyebrow">LESS SETUP. MORE GO.</span><h2>You're three steps<br />from a smarter commute.</h2><Link to="/signup" className="text-link">Let's get you moving <ArrowRight size={18} /></Link></div><div className="journey-steps">{[['Create your account', 'Sign up as a student with your email address.'], ['Choose your route', 'Browse the schedule and find your campus bus.'], ['Track and travel', 'Open the live map and follow your journey.']].map(([title, desc], i) => <div className="journey-step" key={title}><span>{i + 1}</span><div><h3>{title}</h3><p>{desc}</p></div></div>)}</div></section>
      <section className="landing-cta"><div><span className="eyebrow">NEXT STOP: A BETTER DAY</span><h2>Campus life moves fast.<br />Keep up with SmartBus.</h2></div><Link to="/signup" className="primary-button">Get started <ArrowRight size={19} /></Link></section>
    </main><footer className="landing-footer"><Brand /><span>Made for the everyday campus journey.</span><Link to="/login">Sign in <ArrowUpRight size={15} /></Link></footer>
  </div>;
}
