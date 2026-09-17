import { BusFront } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Brand() {
  return <Link to="/" className="brand"><span className="brand-mark"><BusFront size={23} /></span><span>Smart<span className="brand-accent">Bus</span><small>CAMPUS, CONNECTED.</small></span></Link>;
}
