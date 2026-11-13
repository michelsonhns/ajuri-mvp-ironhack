import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import '@fontsource/nunito-sans/latin-400.css';
import '@fontsource/nunito-sans/latin-600.css';
import '@fontsource/nunito-sans/latin-700.css';
import '@fontsource/nunito-sans/latin-800.css';
import { App } from './App';
import { theme } from './theme/theme';
import { DemoProvider } from './state/DemoProvider';
import { LocaleProvider } from './i18n/LocaleProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DemoProvider>
        <LocaleProvider>
          <App />
        </LocaleProvider>
      </DemoProvider>
    </ThemeProvider>
  </StrictMode>,
);
