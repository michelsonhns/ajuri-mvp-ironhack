import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Initials, Logo, Panel, TeamTag } from '../components/atoms/Primitives';
import { members } from '../domain/model';
import { useDemo } from '../state/DemoProvider';
import { tokens } from '../theme/tokens';

export function SetupPage() {
  const { step = '1' } = useParams();
  const current = Math.min(3, Math.max(1, Number(step) || 1));
  const navigate = useNavigate();
  const { state, update } = useDemo();
  const [search, setSearch] = useState('');
  const functions = state.functions;
  const [dialog, setDialog] = useState('');
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [tasks, setTasks] = useState([...state.checklistLabels]);
  const title =
    current === 1
      ? 'Welcome, Camila'
      : current === 2
        ? 'Set your semester goals'
        : `Who helps the ${state.teamName}?`;
  return (
    <>
      <Stack component="header" direction="row" justifyContent="space-between" sx={{ p: 3 }}>
        <Link to="/" aria-label="Ajuri prototype home">
          <Logo full />
        </Link>
        <Initials name="Camila Ferreira" />
      </Stack>
      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        sx={{ maxWidth: 1008, px: 3, mx: 'auto', py: 3 }}
      >
        <Stepper activeStep={current - 1} sx={{ maxWidth: 640, mb: 3 }}>
          {['Team & functions', 'Semester goals', 'Your team’s volunteers'].map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Typography variant="h1" component="h1">
          {title}
        </Typography>
        <Typography color="text.secondary" mt={1} mb={3}>
          {current === 1
            ? 'Let’s set up your team in 3 short steps. You can change everything later.'
            : current === 2
              ? 'Goals appear on your Live board, so you see at a glance how the semester is going.'
              : 'We found 24 members in your association. Select the people who help your team.'}
        </Typography>
        {feedback && (
          <Alert sx={{ mb: 2 }} severity="success" onClose={() => setFeedback('')}>
            {feedback}
          </Alert>
        )}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 596fr) minmax(0, 340fr)' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          <Box>
            {current === 1 && (
              <Panel>
                <Typography component="h2" variant="h4" mb={2}>
                  Your team
                </Typography>
                <TextField
                  fullWidth
                  label="Team name"
                  value={state.teamName}
                  onChange={(e) => update({ teamName: e.target.value })}
                  helperText="Shown to your volunteers"
                />
                <Typography variant="h4" component="h2" mt={2}>
                  Functions in your team
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Each function has its own checklist, shown to the volunteer on shift day.
                </Typography>
                {functions.map((f, i) => (
                  <Stack
                    key={f}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={1}
                    sx={{ py: 1, borderBottom: 1, borderColor: 'divider', mt: 1 }}
                  >
                    <Typography fontWeight={600}>{f}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Checklist · {[7, 5, 4, 3][i] ?? 0} tasks
                    </Typography>
                    <Button
                      onClick={() => setDialog(`checklist:${f}`)}
                      sx={{ px: 1, fontSize: 14 }}
                    >
                      Edit checklist
                    </Button>
                  </Stack>
                ))}
                <Button
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setInput('');
                    setDialog('function');
                  }}
                >
                  + Add a function
                </Button>
              </Panel>
            )}
            {current === 2 && (
              <Stack gap={3}>
                <Panel>
                  <Typography component="h2" variant="h4" mb={2}>
                    Semester
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    label="Period"
                    defaultValue="spring"
                    slotProps={{ select: { native: true } }}
                    helperText="Dates come from your association calendar"
                  >
                    <option value="spring">Spring 2027 · 11 Jan → 27 Jun</option>
                    <option value="autumn">Autumn 2027 · 6 Sep → 19 Dec</option>
                  </TextField>
                </Panel>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 3,
                  }}
                >
                  {[
                    [
                      'Shifts covered 48 h before',
                      'Every shift has its people two days ahead.',
                      '%',
                    ],
                    [
                      'Max shifts per volunteer',
                      'Per month, counted across all teams to avoid burnout.',
                      '',
                    ],
                    ['Availability poll answers', 'Volunteers who answer the semester poll.', '%'],
                    [
                      'Replace an absence within',
                      'From “I can’t come” to a confirmed replacement.',
                      'h',
                    ],
                  ].map(([label, description, unit], i) => (
                    <Panel key={label}>
                      <Typography fontWeight={700} component="h2">
                        {label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" my={1.5}>
                        {description}
                      </Typography>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Button
                          aria-label={`Decrease ${label}`}
                          onClick={() =>
                            update({
                              goals: state.goals.map((v, n) =>
                                n === i
                                  ? Math.max(i === 0 || i === 2 ? 0 : 1, v - (unit === '%' ? 5 : 1))
                                  : v,
                              ),
                            })
                          }
                          sx={{ px: 0, borderRadius: '50%' }}
                        >
                          −
                        </Button>
                        <Typography variant="h2" color="primary" aria-live="polite">
                          {state.goals[i]} {unit}
                        </Typography>
                        <Button
                          aria-label={`Increase ${label}`}
                          onClick={() =>
                            update({
                              goals: state.goals.map((v, n) =>
                                n === i
                                  ? Math.min(unit === '%' ? 100 : 24, v + (unit === '%' ? 5 : 1))
                                  : v,
                              ),
                            })
                          }
                          sx={{ px: 0, borderRadius: '50%', bgcolor: tokens.color.secondary }}
                        >
                          +
                        </Button>
                      </Stack>
                    </Panel>
                  ))}
                </Box>
              </Stack>
            )}
            {current === 3 && (
              <Panel>
                <TextField
                  fullWidth
                  label="Search by name or function"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ mb: 2 }}
                />
                {members
                  .filter((m) =>
                    `${m.name} ${m.function}`.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((m) => (
                    <Stack
                      key={m.name}
                      direction="row"
                      alignItems="center"
                      gap={1.5}
                      sx={{ borderBottom: 1, borderColor: 'divider', py: 1 }}
                    >
                      <Checkbox
                        checked={state.selected.includes(m.name)}
                        inputProps={{ 'aria-label': `Select ${m.name}` }}
                        onChange={(_, checked) =>
                          update({
                            selected: checked
                              ? [...state.selected, m.name]
                              : state.selected.filter((n) => n !== m.name),
                          })
                        }
                      />
                      <Initials name={m.name} small />
                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={700}>{m.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {m.function}
                        </Typography>
                      </Box>
                      {m.team && (
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                          <TeamTag name={m.team} />
                        </Box>
                      )}
                    </Stack>
                  ))}
                <Typography variant="caption" color="text.secondary">
                  Showing 6 of 24 members
                </Typography>
                <Button onClick={() => setShowAll((v) => !v)}>
                  {showAll ? 'Show less' : 'Show all'}
                </Button>
                {showAll && (
                  <Alert severity="info">
                    The prototype includes these six sample members. The other 18 members are
                    outside this test scenario.
                  </Alert>
                )}
              </Panel>
            )}
          </Box>
          <Panel sx={{ bgcolor: tokens.color.panel, border: 0 }}>
            <Stack gap={2}>
              <Typography
                variant="h4"
                component="h2"
                color={current === 3 ? 'primary' : 'text.primary'}
              >
                {current === 1
                  ? 'Other teams in your association'
                  : current === 2
                    ? 'How goals are used'
                    : `${state.selected.length + 15} volunteers selected`}
              </Typography>
              {current === 2 ? (
                <>
                  {[
                    ['On your Live board', 'Each goal becomes a progress bar in “Semester goals”.'],
                    [
                      'Early warnings',
                      'Ajuri tells you when a volunteer gets close to the monthly limit, in any team.',
                    ],
                    [
                      'Fair for shared volunteers',
                      'Shifts in the Safety Host Team and the Front desk Team count too.',
                    ],
                  ].map(([label, desc]) => (
                    <Panel key={label} sx={{ p: 2, border: 0, borderRadius: 2 }}>
                      <Typography fontWeight={600}>{label}</Typography>
                      <Typography variant="body2" color="text.secondary" mt={0.5}>
                        {desc}
                      </Typography>
                    </Panel>
                  ))}
                  <Typography variant="caption" color="text.secondary">
                    You can change goals at any time in Settings.
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary">
                    Volunteers shared with these teams are counted in the cross-team load, so nobody
                    is booked twice.
                  </Typography>
                  {['Safety Host Team', 'Front desk Team'].map((team, i) => (
                    <Stack
                      key={team}
                      direction="row"
                      gap={1}
                      alignItems="center"
                      flexWrap="wrap"
                      sx={{ bgcolor: 'white', p: 1.5, borderRadius: 2 }}
                    >
                      <TeamTag name={team} />
                      <Typography variant="caption" color="text.secondary">
                        {i === 0 ? 6 : 4} shared volunteers
                      </Typography>
                    </Stack>
                  ))}
                  {current === 3 && (
                    <>
                      <Typography fontWeight={700}>Someone is missing?</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Invite them with a link. They fill in their own availability.
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setInput('');
                          setDialog('member');
                        }}
                      >
                        + Add a new member
                      </Button>
                    </>
                  )}
                </>
              )}
            </Stack>
          </Panel>
        </Box>
        <Stack direction="row" justifyContent="space-between" mt={3}>
          <Button component={Link} to={current === 1 ? '/coordinator' : `/setup/${current - 1}`}>
            {current === 1 ? 'Skip for now' : 'Back'}
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate(current === 3 ? '/coordinator' : `/setup/${current + 1}`)}
          >
            {current === 3 ? 'Finish setup' : 'Continue'}
          </Button>
        </Stack>
      </Box>
      <Dialog
        open={Boolean(dialog)}
        onClose={() => setDialog('')}
        fullWidth
        maxWidth="sm"
        aria-labelledby="setup-dialog-title"
      >
        <DialogTitle id="setup-dialog-title">
          {dialog.startsWith('checklist:')
            ? `${dialog.split(':')[1]} checklist`
            : dialog === 'member'
              ? 'Invite a new member'
              : 'Add a function'}
        </DialogTitle>
        <DialogContent>
          {dialog.startsWith('checklist:') ? (
            <Stack gap={2} mt={1}>
              {tasks.map((task, i) => (
                <TextField
                  key={i}
                  fullWidth
                  label={`Task ${i + 1}`}
                  value={task}
                  onChange={(e) =>
                    setTasks((items) => items.map((v, n) => (n === i ? e.target.value : v)))
                  }
                />
              ))}
            </Stack>
          ) : (
            <TextField
              autoFocus
              fullWidth
              label={dialog === 'member' ? 'Email address' : 'Function name'}
              type={dialog === 'member' ? 'email' : 'text'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              sx={{ mt: 1 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog('')}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!dialog.startsWith('checklist:') && !input.trim()}
            onClick={() => {
              if (dialog === 'function' && !functions.includes(input.trim()))
                update({ functions: [...functions, input.trim()] });
              if (dialog.startsWith('checklist:')) update({ checklistLabels: tasks });
              setFeedback(
                dialog === 'member'
                  ? `Demo invitation prepared for ${input}. No email was sent.`
                  : 'Changes saved for this session.',
              );
              setDialog('');
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
