import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { ThemeProvider } from './app/ThemeProvider';
import { App } from './ui/App';
import { applyTheme, readThemePreference } from './app/theme';

applyTheme(readThemePreference());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
