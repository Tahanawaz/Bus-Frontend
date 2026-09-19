import { useState } from 'react';
import { BusFront } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Brand() {
  const [imageAvailable,setImageAvailable]=useState(true);
  return <Link to="/" className="brand"><span className="brand-mark">{imageAvailable?<img src="/logo.png" alt="" onError={()=>setImageAvailable(false)}/>:<BusFront size={23}/>}</span><span>Smart<span className="brand-accent">Bus</span><small>CAMPUS, CONNECTED.</small></span></Link>;
}
