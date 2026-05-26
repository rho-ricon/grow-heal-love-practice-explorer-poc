import type { PouchItem } from '../../components/Pouch';
import {
  administratorSquareStatus,
  clientSquareStatus,
  formatDateTime,
  noteSquareStatus,
  programSquareStatus,
  recordingSquareStatus,
  sessionSquareStatus,
  taskSquareStatus,
  therapistSquareStatus,
  transcriptSquareStatus,
} from './status';
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

export type CarriedPracticeItem =
  | (PouchItem & { kind: 'therapist'; therapist: Therapist })
  | (PouchItem & { kind: 'administrator'; administrator: Administrator })
  | (PouchItem & { kind: 'client'; client: Client })
  | (PouchItem & { kind: 'session'; session: PracticeSession })
  | (PouchItem & { kind: 'note'; note: ClinicalNote })
  | (PouchItem & { kind: 'recording'; recording: Recording })
  | (PouchItem & { kind: 'transcript'; transcript: Transcript })
  | (PouchItem & { kind: 'task'; task: PracticeTask })
  | (PouchItem & { kind: 'program'; program: Program });

export function therapistToPouchItem(therapist: Therapist): CarriedPracticeItem {
  return {
    key: `therapist:${therapist.id}`,
    kind: 'therapist',
    label: therapist.name,
    description: `${therapist.credentials} · ${therapist.role}`,
    status: therapistSquareStatus(therapist),
    therapist,
  };
}

export function administratorToPouchItem(administrator: Administrator): CarriedPracticeItem {
  return {
    key: `administrator:${administrator.id}`,
    kind: 'administrator',
    label: administrator.name,
    description: administrator.role,
    status: administratorSquareStatus(administrator),
    administrator,
  };
}

export function clientToPouchItem(client: Client): CarriedPracticeItem {
  return {
    key: `client:${client.id}`,
    kind: 'client',
    label: client.displayName,
    description: `${client.stage} · ${client.acuity}`,
    status: clientSquareStatus(client),
    client,
  };
}

export function sessionToPouchItem(session: PracticeSession): CarriedPracticeItem {
  return {
    key: `session:${session.id}`,
    kind: 'session',
    label: session.id,
    description: `${session.status} · ${formatDateTime(session.startsAt)}`,
    status: sessionSquareStatus(session),
    session,
  };
}

export function noteToPouchItem(note: ClinicalNote): CarriedPracticeItem {
  return {
    key: `note:${note.id}`,
    kind: 'note',
    label: note.id,
    description: note.status,
    status: noteSquareStatus(note),
    note,
  };
}

export function recordingToPouchItem(recording: Recording): CarriedPracticeItem {
  return {
    key: `recording:${recording.id}`,
    kind: 'recording',
    label: recording.id,
    description: recording.status,
    status: recordingSquareStatus(recording),
    recording,
  };
}

export function transcriptToPouchItem(transcript: Transcript): CarriedPracticeItem {
  return {
    key: `transcript:${transcript.id}`,
    kind: 'transcript',
    label: transcript.id,
    description: transcript.status,
    status: transcriptSquareStatus(transcript),
    transcript,
  };
}

export function taskToPouchItem(task: PracticeTask): CarriedPracticeItem {
  return {
    key: `task:${task.id}`,
    kind: 'task',
    label: task.title,
    description: `${task.category} · ${task.priority}`,
    status: taskSquareStatus(task),
    task,
  };
}

export function programToPouchItem(program: Program): CarriedPracticeItem {
  return {
    key: `program:${program.id}`,
    kind: 'program',
    label: program.name,
    description: `${program.status} · ${program.enrolled}/${program.capacity}`,
    status: programSquareStatus(program),
    program,
  };
}
