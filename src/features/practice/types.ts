export type TherapistStatus = 'available' | 'full' | 'supervision' | 'away';
export type AdministratorStatus = 'steady' | 'busy' | 'escalated' | 'away';
export type ClientStage = 'inquiry' | 'waitlist' | 'intake' | 'active' | 'paused' | 'discharged';
export type ClientAcuity = 'routine' | 'elevated' | 'urgent';
export type PaperworkState = 'complete' | 'pending' | 'missing';
export type RecordingConsent = 'yes' | 'no' | 'pending';
export type SessionStatus = 'scheduled' | 'completed' | 'canceled' | 'no-show';
export type SessionModality = 'telehealth' | 'in-person' | 'group';
export type NoteStatus = 'not-started' | 'draft' | 'review' | 'signed' | 'late';
export type RecordingStatus =
  | 'consented'
  | 'uploaded'
  | 'transcribing'
  | 'ready'
  | 'reviewed'
  | 'delete-due';
export type TranscriptStatus = 'transcribing' | 'ready' | 'review' | 'redaction' | 'linked';
export type TaskStatus = 'todo' | 'doing' | 'blocked' | 'done';
export type TaskCategory = 'intake' | 'billing' | 'scheduling' | 'compliance' | 'clinical';
export type ProgramStatus = 'forming' | 'open' | 'full' | 'waitlist';
export type TaskPriority = 'low' | 'normal' | 'high';

export type Therapist = {
  id: string;
  name: string;
  credentials: string;
  role: string;
  pronouns: string;
  status: TherapistStatus;
  specialties: string[];
  modalities: string[];
  capacity: number;
  caseload: number;
  noteBacklog: number;
  nextAvailable: string;
  supervisorId?: string;
};

export type Administrator = {
  id: string;
  name: string;
  pronouns: string;
  role: string;
  status: AdministratorStatus;
  focus: string[];
  queue: number;
  escalation?: string;
};

export type Client = {
  id: string;
  displayName: string;
  pronouns: string;
  stage: ClientStage;
  acuity: ClientAcuity;
  therapistId?: string;
  programIds: string[];
  tags: string[];
  paperwork: PaperworkState;
  recordingConsent: RecordingConsent;
  nextSessionId?: string;
  openTaskCount: number;
};

export type PracticeSession = {
  id: string;
  clientId: string;
  therapistId: string;
  programId?: string;
  startsAt: string;
  durationMinutes: number;
  status: SessionStatus;
  modality: SessionModality;
  location: string;
  noteId?: string;
  recordingId?: string;
  transcriptId?: string;
};

export type ClinicalNote = {
  id: string;
  sessionId: string;
  clientId: string;
  therapistId: string;
  status: NoteStatus;
  dueAt: string;
  signedAt?: string;
  needsSupervisorReview: boolean;
  summary: string;
};

export type Recording = {
  id: string;
  sessionId: string;
  clientId: string;
  therapistId: string;
  status: RecordingStatus;
  durationMinutes: number;
  capturedAt: string;
  retentionReviewAt: string;
  audioSrc?: string;
  transcriptId?: string;
};

export type TranscriptSegment = {
  id: string;
  transcriptId: string;
  startSeconds: number;
  endSeconds: number;
  speaker: string;
  text: string;
  confidence: number;
  flags: string[];
};

export type Transcript = {
  id: string;
  recordingId: string;
  sessionId: string;
  status: TranscriptStatus;
  wordCount: number;
  redactionCount: number;
  reviewedBy?: string;
};

export type PracticeTask = {
  id: string;
  title: string;
  status: TaskStatus;
  category: TaskCategory;
  priority: TaskPriority;
  dueAt: string;
  ownerKind: 'therapist' | 'administrator';
  ownerId: string;
  clientId?: string;
  sessionId?: string;
  description: string;
};

export type Program = {
  id: string;
  name: string;
  status: ProgramStatus;
  leadTherapistId: string;
  capacity: number;
  enrolled: number;
  cadence: string;
  focus: string[];
  nextMeetingAt: string;
};

export type PracticeData = {
  therapists: Therapist[];
  administrators: Administrator[];
  clients: Client[];
  sessions: PracticeSession[];
  notes: ClinicalNote[];
  recordings: Recording[];
  transcripts: Transcript[];
  tasks: PracticeTask[];
  programs: Program[];
};
