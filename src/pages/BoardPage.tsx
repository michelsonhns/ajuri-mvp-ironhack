import { useState } from 'react';
import { Alert, Box, Button, LinearProgress, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/organisms/AppShell';
import { Initials, Panel, StatusTag, TeamTag } from '../components/atoms/Primitives';
import { LoadBar } from '../components/molecules/LoadBar';
import { useDemo } from '../state/DemoProvider';

export function BoardPage({ schedule = false }: { schedule?: boolean }) {
  const { state } = useDemo();
  const [filter, setFilter] = useState('All');
  const [dismissed, setDismissed] = useState(false);
  const absent = state.absence && state.request !== 'accepted';
  const replaced = state.request === 'accepted';
  const visible = filter === 'All' || filter === 'Catering';
  return (
    <AppShell title={schedule ? 'Schedule' : 'Live board'} filter={filter} onFilter={setFilter}>
      <Stack spacing={3}>
        {absent && !dismissed && (
          <Alert
            severity="error"
            action={
              <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
                <Button onClick={() => setDismissed(true)}>Later</Button>
                <Button component={Link} to="/replacements" variant="contained">
                  See suggestions
                </Button>
              </Stack>
            }
          >
            <Typography fontWeight={700}>Pedro Santos can’t come on Saturday</Typography>
            <Typography variant="body2">
              Catering Team · Kitchen 12:00 – 15:00 now needs 1 replacement · reported at 07:42
            </Typography>
          </Alert>
        )}
        {replaced && (
          <Alert severity="success">
            {state.candidate} accepted · Pedro’s Kitchen shift is covered
          </Alert>
        )}
        <Box
          sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3 }}
        >
          {(absent
            ? [
                ['2', 'Open positions', 'This Saturday · all teams'],
                ['18 / 20', 'Shifts confirmed', 'This week'],
                ['3', 'Volunteers near limit', '≥ 4 shifts this month'],
              ]
            : replaced
              ? [
                  ['1', 'Open positions', 'This Saturday · all teams'],
                  ['19 / 20', 'Shifts confirmed', 'This week'],
                  ['3', 'Volunteers near limit', '≥ 4 shifts this month'],
                ]
              : [
                  ['7', 'Shifts today', 'Catering Team · Sat 14 Nov'],
                  ['6 / 7', 'Confirmed', 'Tiago Rocha hasn’t answered yet'],
                  ['0', 'Uncovered', 'Goal: 0 uncovered 48 h before'],
                ]
          ).map(([value, label, context]) => (
            <Panel key={label}>
              <Typography
                sx={{ fontSize: 36, fontWeight: 800, lineHeight: '44px' }}
                color="primary"
              >
                {value}
              </Typography>
              <Typography fontWeight={700}>{label}</Typography>
              <Typography variant="caption" color="text.secondary">
                {context}
              </Typography>
            </Panel>
          ))}
        </Box>
        <Typography variant="h3" component="h2">
          Saturday 14 November
        </Typography>
        {visible ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {['Kitchen', 'Service', 'Dishwashing'].map((job, i) => (
              <Panel key={job} sx={{ borderColor: i === 0 && absent ? 'error.main' : 'divider' }}>
                <Stack gap={2}>
                  <Stack direction="row" justifyContent="space-between" flexWrap="wrap" gap={1}>
                    <TeamTag name={state.teamName} />
                    <StatusTag status={i === 0 && absent ? 'Cancelled' : 'Confirmed'} />
                  </Stack>
                  <Box>
                    <Typography variant="h4" component="h3">
                      Sat 14 Nov · {i === 2 ? '15:00 – 18:00' : '12:00 – 15:00'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {job} ·{' '}
                      {i === 0
                        ? absent
                          ? 'Pedro Santos can’t come'
                          : replaced
                            ? `${state.candidate} replaces Pedro`
                            : 'Pedro, Inês and João'
                        : i === 1
                          ? '3 of 3 confirmed'
                          : '2 of 2 confirmed'}
                    </Typography>
                  </Box>
                  <Stack direction="row" sx={{ '& > * + *': { ml: -1 } }}>
                    {[
                      'Camila Ferreira',
                      'João Martins',
                      i === 0 && replaced ? state.candidate : 'Pedro Santos',
                    ].map((name) => (
                      <Initials key={name} name={name} small />
                    ))}
                  </Stack>
                  {i === 0 && absent && (
                    <Button variant="contained" component={Link} to="/replacements">
                      See 3 suggestions
                    </Button>
                  )}
                </Stack>
              </Panel>
            ))}
          </Box>
        ) : (
          <Alert severity="info">No {filter} shifts scheduled for today.</Alert>
        )}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: absent || replaced ? '1fr' : '1fr 1fr' },
            gap: 3,
          }}
        >
          <Panel>
            <Typography variant="h4" component="h2">
              Cross-team load · November
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Shifts per volunteer across all teams · goal: max {state.goals[1]} per month
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: absent || replaced ? 'repeat(3, 1fr)' : '1fr',
                },
                gap: 3,
                mt: 2,
              }}
            >
              {[
                ['Marta Lopes', 4, 2],
                ['Inês Martins', 3, 1],
                ['Ana Costa', replaced ? 2 : 1, 0],
              ].map(([name, total, safety]) => (
                <Box key={name}>
                  <Typography fontWeight={600} mb={1}>
                    {name}
                  </Typography>
                  <LoadBar total={Number(total)} safety={Number(safety)} />
                </Box>
              ))}
            </Box>
          </Panel>
          {!absent && !replaced && (
            <Panel>
              <Typography variant="h4" component="h2">
                Semester goals · Spring 2027
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Set during onboarding · you can change them anytime
              </Typography>
              <Stack spacing={2} mt={2}>
                {[
                  ['Shifts covered 48 h before', `86 % · goal ${state.goals[0]} %`, 86],
                  [
                    'Average time to replace an absence',
                    `1 h 40 · goal under ${state.goals[3]} h ✓`,
                    100,
                  ],
                  [
                    `Volunteers under the max load (${state.goals[1]} / month)`,
                    '19 / 20 · goal 20 / 20',
                    95,
                  ],
                  ['Availability poll answers', `80 % · goal ${state.goals[2]} % ✓`, 100],
                ].map(([label, value, progress]) => (
                  <Box key={label}>
                    <Stack direction="row" justifyContent="space-between" gap={1} mb={0.5}>
                      <Typography variant="body2">{label}</Typography>
                      <Typography variant="body2">{value}</Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={Number(progress)}
                      aria-label={String(label)}
                    />
                  </Box>
                ))}
              </Stack>
            </Panel>
          )}
        </Box>
      </Stack>
    </AppShell>
  );
}
