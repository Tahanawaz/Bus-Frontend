import { Link } from 'react-router-dom';
export default function Brand() {
  return <Link to="/" className="brand" aria-label="SmartTrack home"><img className="brand-logo" src="/logo.png?v=3" alt="SmartTrack" /></Link>;
}
