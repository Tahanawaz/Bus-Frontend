import { useCallback, useEffect, useRef, useState } from 'react';
import { FileText, Upload, ExternalLink, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { api, API_URL } from '../../api';

const policyTypes = [
  { type: 'privacy', title: 'Privacy Policy', description: 'Explain how SmartTrack collects, uses, and protects account and live-location data.' },
  { type: 'terms', title: 'Terms of Use', description: 'Publish the rules and responsibilities that apply to SmartTrack users.' }
];

export default function Policies() {
  const [documents,setDocuments]=useState([]);
  const [busy,setBusy]=useState('');
  const inputs=useRef({});
  const load=useCallback(async()=>{
    try{setDocuments((await api.get('/policies')).data);}catch(err){toast.error(err.response?.data?.error||'Unable to load policy documents.');}
  },[]);
  // Load server state after mount; updates occur after the asynchronous request.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{load();},[load]);
  const upload=async(type,file)=>{
    if(!file)return;
    if(file.type!=='application/pdf'&&!file.name.toLowerCase().endsWith('.pdf'))return toast.error('Choose a PDF file.');
    if(file.size>10*1024*1024)return toast.error('PDF must be 10 MB or smaller.');
    setBusy(type);
    try{
      await api.put('/policies/'+type,await file.arrayBuffer(),{headers:{'Content-Type':'application/pdf','X-File-Name':encodeURIComponent(file.name)}});
      toast.success('Policy PDF uploaded.');await load();
    }catch(err){toast.error(err.response?.data?.error||'Unable to upload the PDF.');}
    finally{setBusy('');if(inputs.current[type])inputs.current[type].value='';}
  };
  const remove=async(type,title)=>{
    if(!window.confirm('Remove the uploaded '+title+' PDF?'))return;
    setBusy(type);
    try{await api.delete('/policies/'+type);toast.success(title+' removed.');await load();}
    catch(err){toast.error(err.response?.data?.error||'Unable to remove the PDF.');}finally{setBusy('');}
  };
  return <div className="management-page">
    <header className="management-heading"><div><span className="eyebrow">LEGAL DOCUMENTS</span><h1>Policies</h1><p>Upload the official PDFs shown to visitors in the SmartTrack footer.</p></div></header>
    <div className="policy-grid">{policyTypes.map(item=>{
      const document=documents.find(entry=>entry.type===item.type);
      return <section className="management-panel policy-card" key={item.type}>
        <span className="policy-icon"><FileText size={24}/></span><div><h2>{item.title}</h2><p>{item.description}</p></div>
        {document?<div className="policy-file"><div><strong>{document.original_name}</strong><span>{(document.size/1024/1024).toFixed(2)} MB · Updated {new Date(document.updated_at).toLocaleString()}</span></div><a className="secondary-button" href={`${API_URL}/api/policies/${item.type}/pdf`} target="_blank" rel="noreferrer"><ExternalLink size={16}/>View PDF</a></div>:<p className="policy-empty">No PDF uploaded yet. The website will show its short built-in notice.</p>}
        <div className="form-actions"><input ref={node=>{inputs.current[item.type]=node;}} hidden type="file" accept="application/pdf,.pdf" onChange={event=>upload(item.type,event.target.files?.[0])}/><button className="primary-button" disabled={!!busy} onClick={()=>inputs.current[item.type]?.click()}><Upload size={17}/>{document?'Replace PDF':'Upload PDF'}</button>{document&&<button className="danger-button" disabled={!!busy} onClick={()=>remove(item.type,item.title)}><Trash2 size={16}/>Remove</button>}</div>
      </section>;
    })}</div>
    <p className="table-note">PDF only · maximum 10 MB per document. Replacing a document updates the public link immediately.</p>
  </div>;
}
