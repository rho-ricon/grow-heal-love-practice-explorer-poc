import { taskOwnerLabel } from './status';
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

export function filterItems<T>(items: T[], query: string, getText: (item: T) => string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return items;

  return items.filter((item) => {
    const text = normalize(getText(item));
    return terms.every((term) => text.includes(term));
  });
}

export function therapistSearchText(therapist: Therapist) {
  return [
    therapist.name,
    therapist.credentials,
    therapist.role,
    therapist.pronouns,
    therapist.status,
    therapist.specialties.join(' '),
    therapist.modalities.join(' '),
    therapist.noteBacklog ? 'note backlog' : undefined,
  ].join(' ');
}

export function administratorSearchText(administrator: Administrator) {
  return [
    administrator.name,
    administrator.role,
    administrator.pronouns,
    administrator.status,
    administrator.focus.join(' '),
    administrator.escalation,
  ].join(' ');
}

export function clientSearchText(client: Client) {
  return [
    client.displayName,
    client.pronouns,
    client.stage,
    client.acuity,
    client.paperwork,
    client.recordingConsent,
    client.tags.join(' '),
    client.therapistId ? 'matched assigned' : 'unmatched waitlist',
  ].join(' ');
}

export function sessionSearchText(session: PracticeSession) {
  return [
    session.id,
    session.clientId,
    session.therapistId,
    session.programId,
    session.status,
    session.modality,
    session.location,
    session.startsAt,
  ].join(' ');
}

export function noteSearchText(note: ClinicalNote) {
  return [
    note.id,
    note.sessionId,
    note.clientId,
    note.therapistId,
    note.status,
    note.needsSupervisorReview ? 'supervision review' : undefined,
    note.summary,
  ].join(' ');
}

export function recordingSearchText(recording: Recording) {
  return [
    recording.id,
    recording.sessionId,
    recording.clientId,
    recording.therapistId,
    recording.status,
    recording.durationMinutes,
  ].join(' ');
}

export function transcriptSearchText(transcript: Transcript) {
  return [
    transcript.id,
    transcript.recordingId,
    transcript.sessionId,
    transcript.status,
    transcript.reviewedBy,
    transcript.redactionCount ? 'redaction redactions' : undefined,
  ].join(' ');
}

export function taskSearchText(
  task: PracticeTask,
  therapists: Therapist[] = [],
  administrators: Administrator[] = [],
) {
  return [
    task.title,
    task.status,
    task.category,
    task.priority,
    task.description,
    task.clientId,
    task.sessionId,
    taskOwnerLabel(task, therapists, administrators),
  ].join(' ');
}

export function programSearchText(program: Program) {
  return [
    program.name,
    program.status,
    program.leadTherapistId,
    program.cadence,
    program.focus.join(' '),
  ].join(' ');
}

function normalize(value: unknown) {
  return String(value || '').toLowerCase();
}
