import { useTranslation } from '../../i18n/LocaleProvider';
import { Stack, Typography } from '@mui/material';
import { Panel, StatusTag, TeamTag, type Status } from '../atoms/Primitives';
interface Props {
  team?: string;
  status?: Status;
  time?: string;
  detail?: string;
  children?: React.ReactNode;
}
export function ShiftCard({
  team = 'Catering Team',
  status = 'Confirmed',
  time = 'Sat 14 Nov · 12:00 – 15:00',
  detail = 'Kitchen · Catering Team',
  children,
}: Props) {
  const { t } = useTranslation();
  return (
    <Panel
      sx={{
        p: 2,
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" gap={1} flexWrap="wrap">
          <TeamTag name={team} />
          <StatusTag status={status} />
        </Stack>
        <Typography variant="h4" component="h3">
          {t(time)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t(detail)}
        </Typography>
        {t(children)}
      </Stack>
    </Panel>
  );
}
