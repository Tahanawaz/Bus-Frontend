import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
export default function PasswordField({ label, ...props }) {
 const [visible,setVisible]=useState(false);
 return <div className="password-control"><label><span>{label}</span><span className="password-input-wrap"><input {...props} type={visible?'text':'password'}/><button type="button" aria-label={(visible?'Hide ':'Show ')+label} aria-pressed={visible} onClick={()=>setVisible(v=>!v)}>{visible?<EyeOff size={18}/>:<Eye size={18}/>}</button></span></label></div>;
}
