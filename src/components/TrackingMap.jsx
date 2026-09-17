import { Fragment, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useTheme } from '@mui/material/styles';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin } from 'lucide-react';
import { coordinates } from '../transportUtils';
const icon = L.divIcon({className:'bus-map-pin',html:'<span aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="3" width="14" height="16" rx="3"/><path d="M5 11h14M12 3v8M7 19v3M17 19v3M8 15h1m6 0h1"/></svg></span>',iconSize:[38,44],iconAnchor:[19,40],popupAnchor:[0,-38]});
function MapViewport({ position }) {
  const map=useMap();
  const lat=position?.[0],lng=position?.[1];
  useEffect(()=>{
    let frame;
    const resize=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>map.invalidateSize({pan:false}));};
    const observer=new ResizeObserver(resize);observer.observe(map.getContainer());resize();
    return()=>{observer.disconnect();cancelAnimationFrame(frame);};
  },[map]);
  useEffect(()=>{if(lat!=null&&lng!=null)map.setView([lat,lng],map.getZoom(),{animate:false});},[map,lat,lng]);
  return null;
}
export default function TrackingMap({ buses, selectedId, onSelect }) {
  const theme=useTheme();
  const selected=buses.find(b=>b.id===selectedId);
  const position=coordinates(selected);
  return <section className="tracking-map-panel">
    <header><span className="mini-icon"><MapPin size={19}/></span><div><span className="eyebrow">LIVE MAP</span><h2>{selected?.name||'Choose a bus to follow'}</h2><p>{selected?(position?'Last reported bus location':'Waiting for location from the driver'):'Select a bus from the list below or beside the map.'}</p></div></header>
    <div className="tracking-map-canvas"><MapContainer center={[31.5204,74.3587]} zoom={13} style={{height:'100%',width:'100%'}}>
      <MapViewport position={position}/>
      <TileLayer url={'https://{s}.basemaps.cartocdn.com/'+(theme.palette.mode==='dark'?'dark_all':'light_all')+'/{z}/{x}/{y}{r}.png'} attribution='&copy; OpenStreetMap contributors &copy; CARTO'/>
      {buses.filter(b=>coordinates(b)).map(bus=><Fragment key={bus.id}>
        {bus.id===selectedId&&bus.history?.length>1&&<Polyline positions={bus.history} color="#3b82f6" weight={4}/>}
        <Marker position={coordinates(bus)} icon={icon} eventHandlers={{click:()=>onSelect?.(bus.id)}}><Popup><strong>{bus.name}</strong><p>{bus.status||'No status reported'}</p><span>{bus.driver_name||'Driver not assigned'}</span></Popup></Marker>
      </Fragment>)}
    </MapContainer></div>
    <footer>{position?<a className="secondary-button" href={'https://www.google.com/maps/search/?api=1&query='+position.join(',')} target="_blank" rel="noopener noreferrer"><Navigation size={17}/>Open in Google Maps</a>:<p>No location available for the selected bus yet.</p>}</footer>
  </section>;
}
