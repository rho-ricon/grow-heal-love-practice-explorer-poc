import type {
  Administrator,
  Client,
  ClinicalNote,
  PracticeSession,
  PracticeTask,
  Program,
  Recording,
  Therapist,
  Transcript,
} from './types';

export function therapistSquareStatus(therapist: Therapist) {
  const parts = ['therapist', therapist.status];
  if (therapist.caseload >= therapist.capacity) parts.push('at-capacity');
  if (therapist.noteBacklog >= 5) parts.push('backlog');
  if (therapist.supervisorId) parts.push('associate');
  return parts.join(' ');
}

export function administratorSquareStatus(administrator: Administrator) {
  const parts = ['administrator', administrator.status];
  if (administrator.queue >= 10) parts.push('large-queue');
  return parts.join(' ');
}

export function clientSquareStatus(client: Client) {
  const parts = ['client', client.stage, client.acuity];
  if (client.paperwork !== 'complete') parts.push('paperwork');
  if (client.openTaskCount >= 3) parts.push('busy');
  if (!client.therapistId && client.stage !== 'discharged') parts.push('unmatched');
  return parts.join(' ');
}

export function sessionSquareStatus(session: PracticeSession) {
  return ['session', session.status, session.modality].join(' ');
}

export function noteSquareStatus(note: ClinicalNote) {
  const parts = ['note', note.status];
  if (note.needsSupervisorReview) parts.push('supervision');
  if (note.status !== 'signed' && isPastDue(note.dueAt)) parts.push('overdue');
  return parts.join(' ');
}

export function recordingSquareStatus(recording: Recording) {
  const parts = ['recording', recording.status];
  if (isDueSoon(recording.retentionReviewAt)) parts.push('retention-soon');
  return parts.join(' ');
}

export function transcriptSquareStatus(transcript: Transcript) {
  const parts = ['transcript', transcript.status];
  if (transcript.redactionCount > 0) parts.push('redactions');
  return parts.join(' ');
}

export function taskSquareStatus(task: PracticeTask) {
  const parts = ['task', task.status, task.category, task.priority];
  if (task.status !== 'done' && isPastDue(task.dueAt)) parts.push('overdue');
  else if (task.status !== 'done' && isDueSoon(task.dueAt)) parts.push('due-soon');
  return parts.join(' ');
}

export function programSquareStatus(program: Program) {
  const parts = ['program', program.status];
  if (program.enrolled >= program.capacity) parts.push('at-capacity');
  return parts.join(' ');
}

export function taskOwnerLabel(
  task: PracticeTask,
  therapists: Therapist[],
  administrators: Administrator[],
) {
  if (task.ownerKind === 'therapist') {
    return therapists.find((therapist) => therapist.id === task.ownerId)?.name || 'Unassigned';
  }

  return (
    administrators.find((administrator) => administrator.id === task.ownerId)?.name || 'Unassigned'
  );
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function isPastDue(value: string) {
  const due = new Date(value).getTime();
  return Number.isFinite(due) && due < Date.now();
}

export function isDueSoon(value: string) {
  const due = new Date(value).getTime();
  const twoDays = 2 * 24 * 60 * 60 * 1000;
  return Number.isFinite(due) && due >= Date.now() && due - Date.now() <= twoDays;
}

export function describeCapacity(current: number, capacity: number) {
  return `${current}/${capacity}`;
}
