import { lazy, Suspense, useLayoutEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { readTheme, saveTheme } from './themePreference';
const SharedApp = lazy(() => import('./SharedApp'));
export default function App() {
  const [mode, setMode] = useState(readTheme);
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'dark' ? '#0a0a0a' : '#2865e8');
    saveTheme(mode);
  }, [mode]);
  return <>
    <Suspense fallback={<div className="theme-loading" role="status">Loading SmartBus...</div>}>
      <SharedApp mode={mode} />
    </Suspense>
    <div className="theme-switcher" role="group" aria-label="Color theme">
      <button type="button" aria-pressed={mode === 'light'} onClick={() => setMode('light')} title="Use light mode"><Sun size={17} aria-hidden="true" /><span>Light</span></button>
      <button type="button" aria-pressed={mode === 'dark'} onClick={() => setMode('dark')} title="Use dark mode"><Moon size={17} aria-hidden="true" /><span>Dark</span></button>
    </div>
  </>;
}
