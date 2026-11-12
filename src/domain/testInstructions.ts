import type { DemoState } from './model';

export interface TestInstruction {
  id: string;
  title: string;
  description: string;
  compact?: boolean;
  action?: 'next-task' | 'back-to-start';
}

/** English copy from Figma section 9 · Test EN, task overlay instances. */
export function getTestInstruction(path: string, state: DemoState): TestInstruction | null {
  if (path === '/coordinator') {
    if (state.request === 'accepted') {
      return {
        id: 'end-task-3',
        title: 'END OF TASK 3',
        description: 'Thank you! From 1 (very difficult) to 7 (very easy), how easy was it?',
        action: 'back-to-start',
      };
    }
    if (state.absence) {
      return {
        id: 'task-3',
        title: 'TASK 3',
        description: 'Pedro has reported that he can’t come. Find someone to cover his shift.',
      };
    }
    return {
      id: 'task-1',
      title: 'TASK 1',
      description:
        'How is today looking? And is the semester going well? Tell us what you see as you think aloud.',
      action: 'next-task',
    };
  }

  const mobile = { compact: true };
  if (path === '/volunteer/pedro') {
    return {
      ...mobile,
      id: 'task-2',
      title: 'TASK 2',
      description:
        'You are ill and can’t make it to your Kitchen shift. Let your coordinator know.',
    };
  }
  if (path === '/volunteer/ana/request') {
    return {
      ...mobile,
      id: 'task-4',
      title: 'TASK 4',
      description:
        'Camila has asked you to cover a shift. Reply and see what you need to do during the shift.',
    };
  }
  if (path === '/volunteer/pedro/sent' || path === '/volunteer/ana/checklist') {
    const task = path.endsWith('/sent') ? 2 : 4;
    return {
      ...mobile,
      id: `end-task-${task}`,
      title: `END OF TASK ${task}`,
      description: 'Thank you! From 1 to 7, how easy was it?',
      action: 'back-to-start',
    };
  }
  return null;
}
