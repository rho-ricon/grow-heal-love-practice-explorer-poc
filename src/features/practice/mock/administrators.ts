import type { Administrator } from '../types';

export const administrators: Administrator[] = [
  {
    id: 'ad-riley',
    name: 'Riley Moore',
    pronouns: 'she/her',
    role: 'Intake Coordinator',
    status: 'busy',
    focus: ['inquiries', 'matching', 'waitlist'],
    queue: 14,
    escalation: 'three intake calls older than 48 hours',
  },
  {
    id: 'ad-marco',
    name: 'Marco Ellis',
    pronouns: 'he/him',
    role: 'Billing Specialist',
    status: 'escalated',
    focus: ['claims', 'benefits', 'payment plans'],
    queue: 9,
    escalation: 'two denied claims need clinician addenda',
  },
  {
    id: 'ad-dev',
    name: 'Dev Singh',
    pronouns: 'they/them',
    role: 'Practice Operations',
    status: 'steady',
    focus: ['scheduling', 'rooms', 'telehealth links'],
    queue: 5,
  },
  {
    id: 'ad-sage',
    name: 'Sage Lin',
    pronouns: 'she/they',
    role: 'Compliance Assistant',
    status: 'steady',
    focus: ['consents', 'license tracking', 'audit prep'],
    queue: 6,
  },
];
