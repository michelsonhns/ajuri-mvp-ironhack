import { Avatar, Box, Chip, Typography, type BoxProps } from '@mui/material';
import { tokens } from '../../theme/tokens';

export type IconName =
  | 'layers'
  | 'calendar'
  | 'users'
  | 'checklist'
  | 'bell'
  | 'check'
  | 'check-circle'
  | 'cancelled'
  | 'refresh'
  | 'pending'
  | 'open-position'
  | 'success-large';
export function DesignIcon({ name }: { name: IconName }) {
  return (
    <Box
      component="img"
      src={`${import.meta.env.BASE_URL}assets/${name}.svg`}
      alt=""
      sx={{ display: 'block', flexShrink: 0 }}
    />
  );
}
export function Logo({ full = false }: { full?: boolean }) {
  return (
    <Box
      component="img"
      src={`${import.meta.env.BASE_URL}assets/logo-${full ? 'full' : 'mark'}.svg`}
      alt="Ajuri — Better together"
      sx={{ display: 'block' }}
    />
  );
}
export function Initials({ name, small = false }: { name: string; small?: boolean }) {
  return (
    <Avatar
      sx={{
        width: small ? 32 : 40,
        height: small ? 32 : 40,
        bgcolor: tokens.color.catering,
        color: tokens.color.primary,
        fontSize: small ? 12 : 16,
        fontWeight: 700,
      }}
    >
      {name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')}
    </Avatar>
  );
}
export function TeamTag({ name = 'Catering Team' }: { name?: string }) {
  return (
    <Chip
      size="small"
      label={name}
      sx={{
        bgcolor: name.includes('Safety')
          ? tokens.color.safety
          : name.includes('Front')
            ? tokens.color.frontDesk
            : tokens.color.catering,
        color: tokens.color.primary,
      }}
    />
  );
}
export type Status =
  'Confirmed' | 'Pending' | 'Cancelled' | 'Open position' | 'Change' | 'Declined';
export function StatusTag({ status = 'Confirmed' }: { status?: Status }) {
  const good = status === 'Confirmed';
  const pending = status === 'Pending';
  const info = status === 'Change';
  return (
    <Chip
      size="small"
      icon={
        <DesignIcon
          name={
            good
              ? 'check-circle'
              : pending
                ? 'pending'
                : info
                  ? 'refresh'
                  : status === 'Open position'
                    ? 'open-position'
                    : 'cancelled'
          }
        />
      }
      label={status}
      sx={{
        bgcolor: good
          ? tokens.color.successContainer
          : pending
            ? tokens.color.warningContainer
            : info
              ? tokens.color.infoContainer
              : tokens.color.errorContainer,
        color: good
          ? tokens.color.success
          : pending
            ? tokens.color.warning
            : info
              ? tokens.color.info
              : tokens.color.error,
        '& .MuiChip-icon': { marginLeft: '10px' },
      }}
    />
  );
}
export function Panel({ children, sx, ...props }: BoxProps) {
  return (
    <Box
      {...props}
      sx={{
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: '20px',
        p: 3,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
export function SmallText({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="caption" color="text.secondary">
      {children}
    </Typography>
  );
}
