import { useMemo, useState } from 'react';
import { GoogleMap, InfoWindowF, MarkerF, PolylineF, useJsApiLoader } from '@react-google-maps/api';
import { Fragment, useEffect } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import { useTheme } from '@mui/material/styles';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin } from 'lucide-react';
import { coordinates } from '../transportUtils';

const DEFAULT_CENTER = { lat: 31.5204, lng: 74.3587 };
const mapContainerStyle = { width: '100%', height: '100%' };
const darkMapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#161922' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#161922' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#a7afc0' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#343a49' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#20242d' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#8e97aa' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2b303b' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#171a21' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3b4250' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#242936' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d2638' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#6d8294' }] },
];
const leafletIcon = L.divIcon({
  className: 'bus-map-pin',
  html: '<span aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="3" width="14" height="16" rx="3"/><path d="M5 11h14M12 3v8M7 19v3M17 19v3M8 15h1m6 0h1"/></svg></span>',
  iconSize: [38, 44],
  iconAnchor: [19, 40],
  popupAnchor: [0, -38],
});

function toPoint(value) {
  const point = coordinates(value);
  return point ? { lat: point[0], lng: point[1] } : null;
}

function LeafletViewport({ position, buses, fitAll }) {
  const map = useMap();
  useEffect(() => {
    const frame = requestAnimationFrame(() => map.invalidateSize({ pan: false }));
    return () => cancelAnimationFrame(frame);
  }, [map]);
  useEffect(() => {
    const points=buses.map(coordinates).filter(Boolean);
    if(fitAll&&points.length)map.fitBounds(points,{padding:[38,38],maxZoom:15,animate:false});
    else if (position) map.setView([position.lat, position.lng], map.getZoom(), { animate: false });
  }, [map, position, buses, fitAll]);
  return null;
}

function OpenStreetMap({ buses, onSelect, position, selected, theme, fitAll }) {
  const configuredTileUrl = import.meta.env.VITE_OSM_TILE_URL;
  const tileUrl = configuredTileUrl || ('https://{s}.basemaps.cartocdn.com/' + (theme.palette.mode === 'dark' ? 'dark_all' : 'light_all') + '/{z}/{x}/{y}{r}.png');
  return <MapContainer center={[position?.lat || DEFAULT_CENTER.lat, position?.lng || DEFAULT_CENTER.lng]} zoom={position ? 15 : 12} style={mapContainerStyle}>
    <LeafletViewport position={position} buses={buses} fitAll={fitAll}/>
    <TileLayer
      url={tileUrl}
      attribution='&copy; OpenStreetMap contributors &copy; CARTO'
    />
    {selected?.history?.length > 1 && <Polyline positions={selected.history} color="#2865e8" weight={5}/>}
    {buses.filter(bus => coordinates(bus)).map(bus => <Fragment key={bus.id}>
      <Marker position={coordinates(bus)} icon={leafletIcon} eventHandlers={{ click: () => onSelect?.(bus.id) }}>
        <Popup><div className="google-map-popup"><strong>{bus.name}</strong><span>{bus.number_plate}</span><p>{bus.status || 'No status reported'}</p><small>{bus.driver_name || 'Driver not assigned'}</small>{bus.institute_name&&<small>{bus.institute_name}</small>}</div></Popup>
      </Marker>
    </Fragment>)}
  </MapContainer>;
}

function GoogleTrackingMap({ apiKey, buses, selectedId, onSelect, selected, position, theme, fitAll }) {
  const [popupId, setPopupId] = useState(null);
  const [map, setMap] = useState(null);
  const { isLoaded, loadError } = useJsApiLoader({ id: 'smartbus-google-map', googleMapsApiKey: apiKey || '' });
  const center = position || DEFAULT_CENTER;
  const visibleBuses = useMemo(() => buses.map(bus => ({ bus, position: toPoint(bus) })).filter(item => item.position), [buses]);
  const history = (selected?.history || []).map(([lat, lng]) => ({ lat, lng }));
  const options = useMemo(() => ({
    styles: theme.palette.mode === 'dark' ? darkMapStyles : undefined,
    mapTypeControl: false, streetViewControl: false, fullscreenControl: true,
    clickableIcons: false, gestureHandling: 'greedy',
  }), [theme.palette.mode]);
  useEffect(() => {
    if (!map || !fitAll || !visibleBuses.length || !window.google) return;
    const bounds = new window.google.maps.LatLngBounds();
    visibleBuses.forEach(item => bounds.extend(item.position));
    map.fitBounds(bounds);
  }, [map, fitAll, visibleBuses]);

  if (!apiKey) return <div className="map-load-state" role="alert">Google Maps API key is not configured.</div>;
  if (loadError) return <div className="map-load-state" role="alert">Google Maps could not load. Check billing, key restrictions and Maps JavaScript API.</div>;
  if (!isLoaded) return <div className="map-load-state" role="status">Loading Google Maps...</div>;
  return <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={position ? 15 : 12} options={options} onLoad={setMap} onUnmount={()=>setMap(null)}>
    {history.length > 1 && <PolylineF path={history} options={{ strokeColor: '#2865e8', strokeOpacity: .9, strokeWeight: 5 }} />}
    {visibleBuses.map(({ bus, position: busPosition }) => <MarkerF key={bus.id} position={busPosition} title={bus.name}
      onClick={() => { setPopupId(bus.id); onSelect?.(bus.id); }}
      icon={{ path: window.google.maps.SymbolPath.CIRCLE, fillColor: bus.id === selectedId ? '#2865e8' : '#68778c', fillOpacity: 1, strokeColor: '#ffffff', strokeWeight: 3, scale: bus.id === selectedId ? 11 : 9 }}>
      {popupId === bus.id && <InfoWindowF position={busPosition} onCloseClick={() => setPopupId(null)}><div className="google-map-popup"><strong>{bus.name}</strong><span>{bus.number_plate}</span><p>{bus.status || 'No status reported'}</p><small>{bus.driver_name || 'Driver not assigned'}</small></div></InfoWindowF>}
    </MarkerF>)}
  </GoogleMap>;
}

export default function TrackingMap({ buses, selectedId, onSelect, fitAll=false, title }) {
  const theme = useTheme();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const provider = import.meta.env.VITE_MAP_PROVIDER || 'osm';
  const selected = buses.find(bus => bus.id === selectedId);
  const position = toPoint(selected);
  const mapBody = provider === 'google'
    ? <GoogleTrackingMap apiKey={apiKey} buses={buses} selectedId={selectedId} onSelect={onSelect} selected={selected} position={position} theme={theme} fitAll={fitAll}/>
    : <OpenStreetMap buses={buses} onSelect={onSelect} selected={selected} position={position} theme={theme} fitAll={fitAll}/>;

  return <section className="tracking-map-panel">
    <header><span className="mini-icon"><MapPin size={19}/></span><div><span className="eyebrow">LIVE MAP</span><h2>{title || selected?.name || 'Choose a bus to follow'}</h2><p>{fitAll ? `${buses.filter(bus=>coordinates(bus)).length} of ${buses.length} buses are reporting a location.` : selected ? (position ? 'Live location reported by the driver GPS' : 'Waiting for location from the driver') : 'Select a bus from the list below or beside the map.'}</p></div></header>
    <div className="tracking-map-canvas">{mapBody}</div>
    <footer>{position ? <a className="secondary-button" href={'https://www.google.com/maps/search/?api=1&query=' + position.lat + ',' + position.lng} target="_blank" rel="noopener noreferrer"><Navigation size={17}/>Open in Google Maps</a> : <p>No location available for the selected bus yet.</p>}</footer>
  </section>;
}
