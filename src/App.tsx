import { useEffect } from 'react';
import { HashRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { StartPage } from './pages/StartPage';
import { BoardPage } from './pages/BoardPage';
import { ReplacementPage } from './pages/ReplacementPage';
import { VolunteerPage } from './pages/VolunteerPage';
import { SetupPage } from './pages/SetupPage';
import { TeamPage } from './pages/TeamPage';
import { ChecklistsPage } from './pages/ChecklistsPage';
import { TesterInstructions } from './components/organisms/TesterInstructions';

function RouteFocus() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = `${document.querySelector('h1')?.textContent ?? 'Prototype'} · Ajuri`;
    window.scrollTo(0, 0);
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [pathname]);
  return null;
}
export function App() {
  return (
    <HashRouter>
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        Skip to main content
      </a>
      <RouteFocus />
      <Box sx={{ pb: 'var(--tester-instructions-height, 0px)' }}>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/coordinator" element={<BoardPage />} />
          <Route path="/schedule" element={<BoardPage schedule />} />
          <Route path="/replacements" element={<ReplacementPage />} />
          <Route path="/setup/:step" element={<SetupPage />} />
          <Route path="/volunteers" element={<TeamPage />} />
          <Route path="/checklists" element={<ChecklistsPage />} />
          <Route path="/volunteer/:role" element={<VolunteerPage />} />
          {(['absence', 'sent', 'request', 'accepted', 'declined', 'checklist'] as const).map(
            (screen) => (
              <Route
                key={screen}
                path={`/volunteer/:role/${screen}`}
                element={<VolunteerPage screen={screen} />}
              />
            ),
          )}
          <Route
            path="*"
            element={
              <Box component="main" id="main-content" tabIndex={-1} sx={{ p: 4 }}>
                <Typography component="h1" variant="h1">
                  Page not found
                </Typography>
                <Button component={Link} to="/">
                  Back to test roles
                </Button>
              </Box>
            }
          />
        </Routes>
      </Box>
      <TesterInstructions />
    </HashRouter>
  );
}
