export type Role = 'camila' | 'pedro' | 'ana';
export type RequestStatus = 'none' | 'pending' | 'declined' | 'accepted';
export interface Profile {
  name: string;
  phone: string;
  email: string;
  limit: number;
  functions: string[];
  sharing: boolean[];
}
export interface DemoState {
  absence: boolean;
  reason: string;
  message: string;
  swap: boolean;
  request: RequestStatus;
  candidate: string;
  checklist: boolean[];
  teamName: string;
  functions: string[];
  checklistLabels: string[];
  goals: number[];
  selected: string[];
  profile: Profile;
  removed: boolean;
}
export const checklistItems = [
  'Wash your hands and put on an apron',
  'Check today’s menu with the team lead',
  'Prepare your work station',
  'Label every container with today’s date',
  'Keep the fridge closed (≤ 5 °C)',
  'Clean and disinfect the surfaces',
  'Take out the trash and sort the recycling',
];

export const initialState: DemoState = {
  absence: false,
  reason: 'Sick',
  message: 'Sorry, I have a fever…',
  swap: false,
  request: 'none',
  candidate: 'Ana Costa',
  checklist: [true, true, true, false, false, false, false],
  teamName: 'Catering Team',
  functions: ['Kitchen', 'Service', 'Dishwashing', 'Reception'],
  checklistLabels: [...checklistItems],
  goals: [100, 4, 80, 2],
  selected: ['Ana Costa', 'Pedro Lima', 'Joana Alves', 'Andréia Souza', 'Bruna Martins'],
  profile: {
    name: 'Ana Costa',
    phone: '+55 11 98765 4821',
    email: 'ana.costa@mail.com',
    limit: 4,
    functions: ['Kitchen', 'Service'],
    sharing: [true, false, true, true],
  },
  removed: false,
};
export const candidates = [
  {
    name: 'Ana Costa',
    initials: 'AC',
    load: 1,
    safety: 0,
    detail: 'Catering Team · free all Saturday (availability poll)',
  },
  {
    name: 'Rui Almeida',
    initials: 'RA',
    load: 2,
    safety: 0,
    detail: 'Catering Team · his Dishwashing shift starts at 15:00, when this one ends',
  },
  {
    name: 'Inês Martins',
    initials: 'IM',
    load: 3,
    safety: 1,
    detail: 'Catering + Safety Host Team · already did the morning Kitchen shift',
  },
];
export const members = [
  { name: 'Ana Costa', function: 'Kitchen · Service', team: 'Safety Host Team' },
  { name: 'Pedro Lima', function: 'Kitchen', team: 'Front desk Team' },
  { name: 'Joana Alves', function: 'Service', team: '' },
  { name: 'Andréia Souza', function: 'Dishwashing', team: 'Safety Host Team' },
  { name: 'Bruna Martins', function: 'Kitchen', team: 'Front desk Team' },
  { name: 'Lucas Rocha', function: 'Service', team: '' },
];
