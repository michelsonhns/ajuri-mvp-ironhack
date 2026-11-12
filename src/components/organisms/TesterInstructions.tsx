import { useLocation, useNavigate } from 'react-router-dom';
import { getTestInstruction } from '../../domain/testInstructions';
import { useDemo } from '../../state/DemoProvider';
import { InstructionSnackbar } from '../molecules/InstructionSnackbar';

export function TesterInstructions() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { state, update } = useDemo();
  const instruction = getTestInstruction(pathname, state);
  if (!instruction) return null;

  return (
    <InstructionSnackbar
      key={instruction.id}
      instruction={instruction}
      aboveNavigation={pathname === '/coordinator'}
      onAction={() => {
        if (instruction.action === 'next-task') {
          update({ absence: true, request: 'none', candidate: 'Ana Costa' });
          requestAnimationFrame(() =>
            document.getElementById('main-content')?.focus({ preventScroll: true }),
          );
        } else {
          navigate('/');
        }
      }}
    />
  );
}
