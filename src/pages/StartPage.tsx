import { useTranslation } from '../i18n/LocaleProvider';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Logo, Panel } from '../components/atoms/Primitives';
import { useDemo } from '../state/DemoProvider';
export function StartPage() {
  const { t } = useTranslation();
  const { reset } = useDemo();
  return (
    <>
      <Box
        component="header"
        sx={{
          p: 3,
        }}
      >
        <Logo full />
      </Box>
      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        sx={{
          maxWidth: 1008,
          px: 3,
          mx: 'auto',
          pt: 5,
        }}
      >
        <Typography component="h1" variant="h1" mb={3}>
          {t('Thank you for testing Ajuri!')}
        </Typography>
        <Typography color="text.secondary" mb={3}>
          {t(
            'This is a prototype: not everything works, and that’s fine. There are no wrong answers, we are testing the design, not you. Please think out loud while you click.',
          )}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {[
            [
              'TASKS 1 AND 3',
              'Coordinator',
              'You are Camila, coordinator of the Catering Team. It’s Saturday morning.',
              'Camila',
              '/coordinator',
            ],
            [
              'TASK 2',
              'Volunteer · Pedro',
              'You are Pedro. You are sick and can’t come to your shift today.',
              'Pedro',
              '/volunteer/pedro',
            ],
            [
              'TASK 4',
              'Volunteer · Ana',
              'You are Ana. You just got a notification from Camila.',
              'Ana',
              '/volunteer/ana/request',
            ],
          ].map(([task, title, text, name, to]) => (
            <Panel key={name}>
              <Stack
                gap={1.5}
                sx={{
                  height: '100%',
                  minHeight: 166,
                }}
              >
                <Typography variant="overline" color="text.secondary" lineHeight="16px">
                  {t(task)}
                </Typography>
                <Typography variant="h4" component="h2">
                  {t(title)}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    flex: 1,
                  }}
                >
                  {t(text)}
                </Typography>
                <Button component={Link} to={to} variant="contained">
                  {t('Start as ')}
                  {t(name)}
                </Button>
              </Stack>
            </Panel>
          ))}
        </Box>
        <Alert
          severity="info"
          icon={false}
          sx={{
            mt: 3,
          }}
        >
          {t(
            'The facilitator will tell you which role to start with. Names and teams are fictional.',
          )}
        </Alert>
        <Panel
          sx={{
            mt: 3,
          }}
        >
          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            gap={2}
            alignItems={{
              sm: 'center',
            }}
          >
            <Box
              sx={{
                flex: 1,
              }}
            >
              <Typography component="h2" variant="h4">
                {t('Finished testing?')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('Share your ratings and comments in one short questionnaire.')}
              </Typography>
            </Box>
            <Button component={Link} to="/feedback" variant="outlined">
              {t('Give feedback')}
            </Button>
          </Stack>
        </Panel>
        <Stack direction="row" mt={3} gap={1} flexWrap="wrap">
          <Button component={Link} to="/setup/1">
            {t('Set up a team')}
          </Button>
          <Button onClick={reset}>{t('Reset prototype data')}</Button>
        </Stack>
      </Box>
    </>
  );
}
