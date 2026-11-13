import { useTranslation } from '../i18n/LocaleProvider';
import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  LinearProgress,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Checkbox,
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DesignIcon, Panel } from '../components/atoms/Primitives';
import { ShiftCard } from '../components/molecules/ShiftCard';
import { useDemo } from '../state/DemoProvider';
import { tokens } from '../theme/tokens';
export function VolunteerPage({
  screen = 'shifts',
}: {
  screen?: 'shifts' | 'absence' | 'sent' | 'request' | 'accepted' | 'declined' | 'checklist';
}) {
  const { t } = useTranslation();
  const { role = 'pedro' } = useParams();
  const { state, update } = useDemo();
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);
  const [swapName, setSwapName] = useState('');
  const ana = role === 'ana';
  const name = ana ? state.candidate.split(' ')[0] : 'Pedro';
  const base = `/volunteer/${role}`;
  const title =
    screen === 'checklist'
      ? 'Kitchen checklist'
      : screen === 'absence'
        ? 'I can’t come'
        : screen === 'request' || screen === 'accepted' || screen === 'declined'
          ? 'My requests'
          : 'My shifts';
  const done = state.checklist.filter(Boolean).length;
  const submitAbsence = () => {
    if (!navigator.onLine) {
      setFailed(true);
      return;
    }
    update({
      absence: true,
      request: 'none',
    });
    navigate(`${base}/sent`);
  };
  return (
    <Box
      sx={{
        maxWidth: 390,
        minHeight: 'calc(100dvh - var(--tester-instructions-height, 0px))',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        component="header"
        sx={{
          px: 2,
          height: 64,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h2" component="h1" color="primary">
          {t(title)}
        </Typography>
      </Box>
      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        sx={{
          p: 2,
          pt: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          outline: 'none',
        }}
      >
        {screen === 'shifts' && (
          <>
            <Typography variant="h2" component="h2">
              {t('Hi ')}
              {t(name)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('Your shifts across all your teams')}
            </Typography>
            <Box
              sx={{
                bgcolor: tokens.color.infoContainer,
                borderRadius: '20px',
                p: 2,
              }}
            >
              <Typography variant="caption" color="info.main" display="block" mb={1}>
                {t('Reminder · tomorrow')}
              </Typography>
              <ShiftCard
                status={!ana && state.absence ? 'Change' : 'Confirmed'}
                detail={
                  ana ? 'Kitchen · Catering Team' : 'Kitchen · Catering Team · with Ana and João'
                }
              />
              <Stack direction="row" gap={1} mt={1.5}>
                <Button
                  variant="contained"
                  component={Link}
                  to={`${base}/checklist`}
                  sx={{
                    bgcolor: tokens.color.secondary,
                    color: 'primary.main',
                    flex: 1,
                    px: 1,
                    '&:hover': {
                      bgcolor: '#d3d4f2',
                    },
                  }}
                >
                  {t('See checklist')}
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  to={`${base}/absence`}
                  sx={{
                    flex: 1,
                    px: 1,
                  }}
                >
                  {t('I can’t come')}
                </Button>
              </Stack>
            </Box>
            <Typography fontWeight={700} component="h2">
              {t('Next shifts')}
            </Typography>
            <ShiftCard
              team="Safety Host Team"
              time="Thu 19 Nov · 18:00 – 21:00"
              detail="Reception · Safety Host Team"
            />
            <ShiftCard status="Pending" time="Sat 28 Nov · 12:00 – 15:00" />
          </>
        )}
        {screen === 'absence' && (
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              submitAbsence();
            }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              flex: 1,
            }}
          >
            {failed && (
              <Alert severity="error">
                <Typography fontWeight={700}>{t('Your message wasn’t sent')}</Typography>
                {t('Check your connection and try again. Your answers are kept.')}
              </Alert>
            )}
            <ShiftCard />
            <Typography component="h2" fontWeight={700}>
              {t('Reason (optional)')}
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={state.reason}
              onChange={(_, value: string | null) =>
                update({
                  reason: value ?? '',
                })
              }
              aria-label={t('Reason for absence')}
              sx={{
                gap: 1,
                flexWrap: 'wrap',
                '& .MuiToggleButton-root': {
                  border: '1px solid',
                  borderColor: 'secondary.main',
                  borderRadius: '8px !important',
                  px: 2,
                },
              }}
            >
              {['Sick', 'Work', 'Family', 'Other'].map((r) => (
                <ToggleButton value={r} key={r}>
                  {t(r)}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <TextField
              label={t('Message to Camila (optional)')}
              multiline
              minRows={1}
              value={t(state.message)}
              onChange={(e) =>
                update({
                  message: e.target.value,
                })
              }
              helperText={t('Only Camila will see it')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={state.swap}
                  onChange={(_, checked) =>
                    update({
                      swap: checked,
                    })
                  }
                />
              }
              label={t('I found someone to swap with')}
            />
            {state.swap && (
              <TextField
                required
                label={t('Volunteer’s name')}
                value={t(swapName)}
                onChange={(e) => setSwapName(e.target.value)}
              />
            )}
            <Typography variant="body2" color="text.secondary">
              {t('Camila will be told right away. You don’t need to find someone yourself.')}
            </Typography>
            <Box
              sx={{
                flex: 1,
                minHeight: 100,
              }}
            />
            <Button variant="contained" type="submit">
              {t(failed ? 'Try again' : 'Tell Camila I can’t come')}
            </Button>
          </Box>
        )}
        {screen === 'sent' && (
          <>
            <Box
              sx={{
                textAlign: 'center',
                py: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <DesignIcon name="success-large" />
              </Box>
              <Typography variant="h2" component="h2">
                {t('Camila has been told')}
              </Typography>
              <Typography color="text.secondary" variant="body2" mt={2}>
                {t(
                  'You don’t need to find someone yourself. We’ll let you know when your shift is covered.',
                )}
              </Typography>
            </Box>
            <ShiftCard
              status="Change"
              detail="Kitchen · Catering Team · absence reported at 07:42"
            />
            <Box
              sx={{
                flex: 1,
                minHeight: 100,
              }}
            />
            <Button variant="contained" component={Link} to={base}>
              {t('Back to my shifts')}
            </Button>
            <Button
              onClick={() => {
                update({
                  absence: false,
                  request: 'none',
                });
                navigate(base);
              }}
            >
              {t('Withdraw my absence report')}
            </Button>
          </>
        )}
        {screen === 'request' && (
          <>
            <Typography variant="h2" component="h2">
              {t('Hi ')}
              {t(name)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('Camila Ferreira needs a hand')}
            </Typography>
            <Panel
              sx={{
                bgcolor: tokens.color.secondary,
                border: 0,
                p: 2,
              }}
            >
              <Typography variant="h4" component="h2" mb={2}>
                {t('Can you cover this shift?')}
              </Typography>
              <ShiftCard
                status="Open position"
                detail="Kitchen · Catering Team · replaces Pedro (sick)"
              />
              <Typography variant="caption" display="block" mt={2}>
                {t('Your load this month: 1 / 4 shifts → 2 / 4 if you accept')}
              </Typography>
            </Panel>
            <Box
              sx={{
                flex: 1,
                minHeight: 100,
              }}
            />
            <Button
              variant="contained"
              onClick={() => {
                update({
                  absence: true,
                  request: 'accepted',
                });
                navigate(`${base}/accepted`);
              }}
            >
              {t('Accept replacement')}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                update({
                  absence: true,
                  request: 'declined',
                });
                navigate(`${base}/declined`);
              }}
            >
              {t('I can’t this time')}
            </Button>
          </>
        )}
        {screen === 'accepted' && (
          <>
            <Typography variant="h2" component="h2" align="center">
              {t('Thank you, ')}
              {t(name)}
              {t('!')}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {t('This shift is now in your schedule. Camila has been told.')}
            </Typography>
            <ShiftCard />
            <Box
              sx={{
                flex: 1,
                minHeight: 100,
              }}
            />
            <Button variant="contained" component={Link} to={`${base}/checklist`}>
              {t('See my Kitchen checklist')}
            </Button>
            <Button component={Link} to={base}>
              {t('View my shifts')}
            </Button>
          </>
        )}
        {screen === 'declined' && (
          <>
            <Alert severity="info">
              {t(
                'Camila has been told you can’t take this shift. You don’t need to do anything else.',
              )}
            </Alert>
            <Button component={Link} to={base}>
              {t('View my shifts')}
            </Button>
            <Button component={Link} to="/replacements">
              {t('Continue as Camila')}
            </Button>
          </>
        )}
        {screen === 'checklist' && (
          <>
            <Typography variant="body2" color="text.secondary">
              {t('Sat 14 Nov · 12:00 – 15:00 · Catering Team')}
            </Typography>
            <Panel
              sx={{
                bgcolor: '#f8f7fc',
                border: 0,
                p: 1.5,
              }}
            >
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography fontWeight={700}>{t('Kitchen')}</Typography>
                <Typography variant="body2" color="primary" aria-live="polite">
                  {t(done)}
                  {t(' / 7 done')}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={(done / 7) * 100}
                aria-label={t('Kitchen checklist completion')}
              />
            </Panel>
            {[
              ['BEFORE', 0, 3],
              ['DURING', 3, 5],
              ['AFTER', 5, 7],
            ].map(([label, start, end]) => (
              <Box
                component="fieldset"
                key={label}
                sx={{
                  border: 0,
                  m: 0,
                  p: 0,
                }}
              >
                <Typography component="legend" variant="caption" color="text.secondary" mb={1}>
                  {t(label)}
                </Typography>
                {state.checklistLabels.slice(Number(start), Number(end)).map((task, i) => (
                  <FormControlLabel
                    key={task}
                    sx={{
                      minHeight: 52,
                      ml: 0,
                      mr: 0,
                      display: 'flex',
                      '& .MuiCheckbox-root': {
                        mr: 1,
                      },
                    }}
                    control={
                      <Checkbox
                        checked={state.checklist[Number(start) + i]}
                        onChange={(_, checked) =>
                          update({
                            checklist: state.checklist.map((v, index) =>
                              index === Number(start) + i ? checked : v,
                            ),
                          })
                        }
                      />
                    }
                    label={t(task)}
                  />
                ))}
              </Box>
            ))}
            <Box
              sx={{
                flex: 1,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {t('Each function has its own checklist, written by your coordinator.')}
            </Typography>
            <Button component={Link} to={base}>
              {t('Back to my shifts')}
            </Button>
          </>
        )}
      </Box>
      <Box
        component="footer"
        sx={{
          textAlign: 'center',
          py: 1,
        }}
      >
        <Button
          component={Link}
          to="/"
          size="small"
          sx={{
            fontSize: 12,
          }}
        >
          {t('Test roles')}
        </Button>
      </Box>
    </Box>
  );
}
