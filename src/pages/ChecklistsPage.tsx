import { useTranslation } from '../i18n/LocaleProvider';
import { Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/organisms/AppShell';
import { Panel } from '../components/atoms/Primitives';
export function ChecklistsPage() {
  const { t } = useTranslation();
  return (
    <AppShell title={t('Checklists')}>
      <Panel>
        <Stack gap={2}>
          <Typography variant="h3" component="h2">
            {t('Functions in your team')}
          </Typography>
          <Typography color="text.secondary">
            {t('Each function has its own checklist, shown to the volunteer on shift day.')}
          </Typography>
          <Button
            component={Link}
            to="/volunteer/pedro/checklist"
            variant="contained"
            sx={{
              alignSelf: 'start',
            }}
          >
            {t('Open Kitchen checklist · 7 tasks')}
          </Button>
          <Button
            component={Link}
            to="/setup/1"
            sx={{
              alignSelf: 'start',
            }}
          >
            {t('Edit team functions')}
          </Button>
        </Stack>
      </Panel>
    </AppShell>
  );
}
