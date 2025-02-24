import "./instrument";
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import posthog from './lib/posthog'

createRoot(document.getElementById("root")!).render(<App />);

posthog.capture('my-event', { property: 'value' });
