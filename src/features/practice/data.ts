import { administrators } from './mock/administrators';
import { clients } from './mock/clients';
import { notes } from './mock/notes';
import { programs } from './mock/programs';
import { recordings } from './mock/recordings';
import { sessions } from './mock/sessions';
import { tasks } from './mock/tasks';
import { therapists } from './mock/therapists';
import { transcripts } from './mock/transcripts';
import type { PracticeData } from './types';

export const PRACTICE_NAME = 'Grow Heal Love';

// Mocked operational data only. Client display names are synthetic handles, not real people.
export const practiceData: PracticeData = {
  therapists,
  administrators,
  clients,
  sessions,
  notes,
  recordings,
  transcripts,
  tasks,
  programs,
};
