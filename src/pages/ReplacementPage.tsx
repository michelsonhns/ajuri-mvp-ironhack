import { useTranslation } from '../i18n/LocaleProvider';
import { useState } from 'react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/organisms/AppShell';
import { Initials, Panel, StatusTag, TeamTag } from '../components/atoms/Primitives';
import { LoadBar } from '../components/molecules/LoadBar';
import { candidates } from '../domain/model';
import { useDemo } from '../state/DemoProvider';
export function ReplacementPage() {
  const { t } = useTranslation();
  const { state, update } = useDemo();
  const [showAll, setShowAll] = useState(false);
  const active = state.absence && state.request !== 'accepted';
  return (
    <AppShell title={t('Find a replacement')}>
      <Stack gap={3}>
        {!active ? (
          <Panel>
            <Typography component="h2" variant="h3">
              {t(state.request === 'accepted' ? 'The shift is covered' : 'No absence to replace')}
            </Typography>
            <Typography mt={2} color="text.secondary">
              {t(
                state.request === 'accepted'
                  ? `${state.candidate} accepted the Kitchen shift.`
                  : 'Everything is up to date. You’ll find replacement suggestions here when someone reports an absence.',
              )}
            </Typography>
            <Stack direction="row" mt={3} gap={2} flexWrap="wrap">
              <Button component={Link} to="/coordinator" variant="contained">
                {t('Back to Live board')}
              </Button>
              <Button
                onClick={() =>
                  update({
                    absence: true,
                    request: 'none',
                  })
                }
              >
                {t('Simulate Pedro’s absence')}
              </Button>
            </Stack>
          </Panel>
        ) : (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  lg: '320px 1fr',
                },
                gap: 3,
                alignItems: 'start',
              }}
            >
              <Panel>
                <Stack gap={1}>
                  <Stack direction="row" gap={1} flexWrap="wrap">
                    <TeamTag />
                    <StatusTag status={state.request === 'pending' ? 'Pending' : 'Cancelled'} />
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {t('Absence')}
                  </Typography>
                  <Typography variant="h3" component="h2">
                    {t('Pedro Santos')}
                  </Typography>
                  <Typography variant="body2">{t('Sat 14 Nov · 12:00 – 15:00')}</Typography>
                  <Typography variant="body2">
                    {t('Kitchen · ')}
                    {t(state.teamName)}
                  </Typography>
                  <Typography variant="body2">
                    {t('Reported at 07:42 · reason: ')}
                    {t(state.reason.toLowerCase())}
                  </Typography>
                  <Typography variant="body2">{t('Shift starts in 4 h 18 min')}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t(state.swap ? 'Pedro proposed a swap.' : 'Pedro didn’t propose a swap.')}
                  </Typography>
                </Stack>
              </Panel>
              <Panel>
                <Stack gap={2}>
                  <Typography variant="h2" component="h2" color="primary">
                    {t(
                      state.request === 'pending'
                        ? `Request sent to ${state.candidate}`
                        : state.request === 'declined'
                          ? 'Ana can’t take this shift'
                          : '3 suggestions · ranked by cross-team load',
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(
                      'Available on Saturday · trained for Kitchen · not booked in another team. Fewest shifts this month first.',
                    )}
                  </Typography>
                  {state.request === 'declined' && (
                    <Alert severity="error">
                      {t('Ana declined. Rui Almeida is next on the list.')}
                    </Alert>
                  )}
                  {t(
                    candidates
                      .filter((c) => !state.removed || c.name !== 'Ana Costa')
                      .map((c, i) => {
                        const pending = state.request === 'pending' && state.candidate === c.name;
                        const declined = state.request === 'declined' && c.name === state.candidate;
                        return (
                          <Panel
                            key={c.name}
                            sx={{
                              p: 2,
                            }}
                          >
                            <Box
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                  xs: '1fr',
                                  xl: 'minmax(240px, 1fr) minmax(200px, .9fr) auto',
                                },
                                gap: 2,
                                alignItems: 'center',
                              }}
                            >
                              <Stack direction="row" gap={2} alignItems="center">
                                <Initials name={c.name} />
                                <Box>
                                  <Typography fontWeight={700}>{t(c.name)}</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {t(
                                      pending
                                        ? 'Waiting for her answer · sent at 07:51 · we’ll tell you as soon as she replies'
                                        : declined
                                          ? 'Declined · “I’m at work until 14:00”'
                                          : c.detail,
                                    )}
                                  </Typography>
                                </Box>
                              </Stack>
                              <LoadBar total={c.load} safety={c.safety} />
                              <Button
                                disabled={declined || pending}
                                variant={
                                  (i === 0 && state.request === 'none') ||
                                  (i === 1 && state.request === 'declined')
                                    ? 'contained'
                                    : 'outlined'
                                }
                                onClick={() =>
                                  update({
                                    candidate: c.name,
                                    request: 'pending',
                                  })
                                }
                              >
                                {t(
                                  pending
                                    ? 'Request sent'
                                    : declined
                                      ? 'Declined'
                                      : state.request === 'declined' && i === 1
                                        ? 'Ask Rui'
                                        : 'Send request',
                                )}
                              </Button>
                            </Box>
                          </Panel>
                        );
                      }),
                  )}
                  <Button
                    sx={{
                      alignSelf: 'start',
                    }}
                    onClick={() => setShowAll((v) => !v)}
                  >
                    {t(showAll ? 'Hide availability details' : 'See all available volunteers')}
                  </Button>
                  {showAll && (
                    <Alert severity="info">
                      {t(
                        'All eligible volunteers are shown above. Marta has reached her monthly limit; Sofia is booked in another team.',
                      )}
                    </Alert>
                  )}
                </Stack>
              </Panel>
            </Box>
            <Alert severity="info" icon={false}>
              {t(
                'Not suggested: Marta Lopes (4 / 4 shifts, at her limit) · Sofia Mendes (on Front desk Team 12:00 – 14:00)',
              )}
            </Alert>
            {state.request === 'pending' && (
              <Stack direction="row" gap={2} flexWrap="wrap">
                <Button component={Link} to="/volunteer/ana/request" variant="outlined">
                  {t('Continue as ')}
                  {t(state.candidate.split(' ')[0])}
                </Button>
                <Button
                  onClick={() =>
                    update({
                      request: 'none',
                    })
                  }
                >
                  {t('Withdraw request')}
                </Button>
              </Stack>
            )}
          </>
        )}
      </Stack>
    </AppShell>
  );
}
