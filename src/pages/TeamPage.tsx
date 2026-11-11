import { useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  LinearProgress,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { AppShell } from '../components/organisms/AppShell';
import { Initials, Panel, StatusTag, TeamTag } from '../components/atoms/Primitives';
import { useDemo } from '../state/DemoProvider';
import { tokens } from '../theme/tokens';

export function TeamPage() {
  const { state, update } = useDemo();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(state.profile);
  const [removeOpen, setRemoveOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [feedback, setFeedback] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState(false);
  const exportData = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(state.profile, null, 2)], { type: 'application/json' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ana-costa-demo-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  const save = () => {
    if (
      !profile.name.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email) ||
      profile.limit < 1 ||
      profile.limit > 31
    ) {
      setErrors(true);
      return;
    }
    update({ profile });
    setEditing(false);
    setErrors(false);
    setFeedback('Changes saved in this prototype.');
  };
  return (
    <AppShell title={editing ? `Edit ${state.profile.name}` : state.profile.name}>
      <Stack gap={3}>
        {feedback && (
          <Alert severity="success" onClose={() => setFeedback('')}>
            {feedback}
          </Alert>
        )}
        {state.removed ? (
          <Panel>
            <Typography variant="h3" component="h2">
              Ana was removed from the Catering Team
            </Typography>
            <Typography mt={2}>
              She stays in the Safety Host Team. Her upcoming Catering shift is now open.
            </Typography>
            <Button sx={{ mt: 2 }} onClick={() => update({ removed: false })}>
              Undo removal
            </Button>
          </Panel>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'minmax(320px, 440px) 1fr' },
              gap: 3,
              alignItems: 'start',
            }}
          >
            <Panel>
              <Stack gap={2}>
                <Stack direction="row" gap={2} alignItems="center">
                  <Initials name={state.profile.name} />
                  <Box>
                    <Typography variant="h2" component="h2">
                      {state.profile.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Kitchen · Service · volunteer since Sep 2025
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" gap={1} flexWrap="wrap">
                  <TeamTag />
                  <TeamTag name="Safety Host Team" />
                </Stack>
                {editing ? (
                  <>
                    {(['name', 'phone', 'email', 'limit'] as const).map((key, i) => (
                      <TextField
                        key={key}
                        label={['Full name', 'Phone', 'Email', 'Monthly limit (all teams)'][i]}
                        value={profile[key]}
                        type={
                          key === 'limit'
                            ? 'number'
                            : key === 'email'
                              ? 'email'
                              : key === 'phone'
                                ? 'tel'
                                : 'text'
                        }
                        required={key === 'name' || key === 'email'}
                        error={
                          errors &&
                          ((key === 'name' && !profile.name.trim()) ||
                            (key === 'email' &&
                              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) ||
                            (key === 'limit' && (profile.limit < 1 || profile.limit > 31)))
                        }
                        helperText={
                          errors && (key === 'name' || key === 'email' || key === 'limit')
                            ? 'Enter a valid value.'
                            : key === 'phone'
                              ? 'Ana prefers WhatsApp'
                              : key === 'limit'
                                ? 'Ana can lower it in her app'
                                : undefined
                        }
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            [key]: key === 'limit' ? Number(e.target.value) : e.target.value,
                          }))
                        }
                      />
                    ))}
                    <Typography fontWeight={700}>Functions in the Catering Team</Typography>
                    <ToggleButtonGroup
                      value={profile.functions}
                      onChange={(_, values: string[]) =>
                        setProfile((p) => ({ ...p, functions: values }))
                      }
                      aria-label="Volunteer functions"
                      sx={{ flexWrap: 'wrap', gap: 1 }}
                    >
                      {['Kitchen', 'Service', 'Dishwashing', 'Reception'].map((f) => (
                        <ToggleButton
                          key={f}
                          value={f}
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '8px !important',
                          }}
                        >
                          {f}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </>
                ) : (
                  <>
                    <Box component="dl" sx={{ m: 0 }}>
                      {[
                        ['Phone', state.profile.phone],
                        ['Email', state.profile.email],
                        ['Availability', 'Saturdays, morning and lunch'],
                        ['Monthly limit', `${state.profile.limit} shifts, across all teams`],
                      ].map(([label, value]) => (
                        <Box
                          key={label}
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: '120px 1fr',
                            gap: 2,
                            borderBottom: 1,
                            borderColor: 'divider',
                            py: 1.5,
                          }}
                        >
                          <Typography component="dt" variant="body2" color="text.secondary">
                            {label}
                          </Typography>
                          <Typography
                            component="dd"
                            variant="body2"
                            sx={{ m: 0, overflowWrap: 'anywhere' }}
                          >
                            {value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      <Button
                        variant="contained"
                        sx={{ bgcolor: tokens.color.secondary, color: 'primary.main' }}
                        onClick={() => {
                          setProfile(structuredClone(state.profile));
                          setEditing(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="outlined" onClick={() => setMessageOpen(true)}>
                        Send a message
                      </Button>
                    </Stack>
                  </>
                )}
              </Stack>
            </Panel>
            <Stack gap={3}>
              {editing ? (
                <>
                  <Panel>
                    <Typography variant="h4" component="h2">
                      Who can see what
                    </Typography>
                    <Typography variant="body2" color="text.secondary" my={2}>
                      Ana helps two teams. Choose what the Safety Host Team coordinator can see. Ana
                      sees these settings in her app.
                    </Typography>
                    {[
                      'Phone number · Safety Host Team coordinator',
                      'Email · Safety Host Team coordinator',
                      'Availability · all coordinators of Ana’s teams',
                      'Shift history · all coordinators of Ana’s teams',
                    ].map((label, i) => (
                      <FormControlLabel
                        key={label}
                        sx={{
                          display: 'flex',
                          py: 1,
                          borderBottom: 1,
                          borderColor: 'divider',
                          ml: 0,
                        }}
                        control={
                          <Switch
                            checked={profile.sharing[i]}
                            onChange={(_, checked) =>
                              setProfile((p) => ({
                                ...p,
                                sharing: p.sharing.map((v, n) => (n === i ? checked : v)),
                              }))
                            }
                          />
                        }
                        label={label}
                      />
                    ))}
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Ana gets a notification when you change her data. Only the fields above are
                      stored: no address, birth date or documents.
                    </Alert>
                  </Panel>
                  <Stack direction="row" justifyContent="end" gap={1}>
                    <Button
                      onClick={() => {
                        setEditing(false);
                        setErrors(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button variant="contained" onClick={save}>
                      Save changes
                    </Button>
                  </Stack>
                </>
              ) : (
                <>
                  <Panel>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography fontWeight={700}>November · across all teams</Typography>
                      <Typography color="primary">3 of {state.profile.limit} shifts</Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, (3 / state.profile.limit) * 100)}
                      aria-label="Monthly volunteer load"
                      sx={{ my: 2 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {Math.max(0, state.profile.limit - 3)} shift left before her monthly limit.
                      Ajuri will not suggest Ana once she reaches {state.profile.limit}.
                    </Typography>
                    {[
                      ['Sat 7 Nov', 'Catering Team · Kitchen 9:00 – 14:00'],
                      ['Sat 14 Nov', 'Safety Host Team · Welcome desk 8:00 – 12:00'],
                      ['Sat 21 Nov', 'Catering Team · Service 11:00 – 15:00'],
                    ].map(([day, detail], i) => (
                      <Stack
                        direction="row"
                        gap={2}
                        alignItems="center"
                        flexWrap="wrap"
                        key={day}
                        sx={{ py: 1.5, borderBottom: i === 2 ? 0 : 1, borderColor: 'divider' }}
                      >
                        <Typography fontWeight={700}>{day}</Typography>
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {detail}
                        </Typography>
                        <StatusTag status={i === 2 ? 'Pending' : 'Confirmed'} />
                      </Stack>
                    ))}
                  </Panel>
                  <Panel sx={{ bgcolor: tokens.color.panel, border: 0 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h4" component="h2">
                        Personal data & privacy
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        GDPR
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', xl: 'repeat(4, 1fr)' },
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      {[
                        [
                          'What we keep',
                          'Name, phone, email, availability, functions. Nothing else.',
                        ],
                        [
                          'Who can see it',
                          'You and the Safety Host Team coordinator, because Ana helps both teams.',
                        ],
                        ['Consent', 'Given by Ana on 2 Sep 2026, when she joined.'],
                        ['How long', 'Deleted 12 months after her last shift.'],
                      ].map(([label, desc]) => (
                        <Panel key={label} sx={{ p: 2, border: 0, borderRadius: 2 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {desc}
                          </Typography>
                        </Panel>
                      ))}
                    </Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      gap={2}
                      flexWrap="wrap"
                      mt={2}
                    >
                      <Button variant="outlined" onClick={exportData}>
                        Export Ana’s data
                      </Button>
                      <Button color="error" onClick={() => setRemoveOpen(true)}>
                        Remove from team
                      </Button>
                    </Stack>
                  </Panel>
                </>
              )}
            </Stack>
          </Box>
        )}
      </Stack>
      <Dialog
        slotProps={{ transition: { onEntered: () => cancelRef.current?.focus() } }}
        open={removeOpen}
        onClose={() => setRemoveOpen(false)}
        aria-labelledby="remove-title"
        aria-describedby="remove-description"
      >
        <DialogTitle id="remove-title">Remove Ana from the Catering Team?</DialogTitle>
        <DialogContent>
          <DialogContentText id="remove-description">
            Ana stays in the Safety Host Team. Her 1 upcoming Catering shift (Sat 21 Nov) becomes
            open and you get replacement suggestions. The Catering Team stops seeing her data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button ref={cancelRef} autoFocus onClick={() => setRemoveOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              update({ removed: true });
              setRemoveOpen(false);
            }}
          >
            Remove from team
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={messageOpen}
        onClose={() => setMessageOpen(false)}
        fullWidth
        aria-labelledby="message-title"
      >
        <DialogTitle id="message-title">Message to {state.profile.name}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            sx={{ mt: 1 }}
          />
          <Alert severity="info" sx={{ mt: 2 }}>
            Prototype only: no message will be sent.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageOpen(false)}>Cancel</Button>
          <Button
            disabled={!message.trim()}
            variant="contained"
            onClick={() => {
              setMessageOpen(false);
              setFeedback('Demo message saved for this session. No message was sent.');
            }}
          >
            Save demo message
          </Button>
        </DialogActions>
      </Dialog>
    </AppShell>
  );
}
