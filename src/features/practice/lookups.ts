import type {
  Administrator,
  Client,
  ClinicalNote,
  PracticeData,
  PracticeSession,
  PracticeTask,
  Program,
  Recording,
  Therapist,
  Transcript,
} from './types';

export function therapistById(data: PracticeData, id?: string): Therapist | undefined {
  return data.therapists.find((therapist) => therapist.id === id);
}

export function administratorById(data: PracticeData, id?: string): Administrator | undefined {
  return data.administrators.find((administrator) => administrator.id === id);
}

export function clientById(data: PracticeData, id?: string): Client | undefined {
  return data.clients.find((client) => client.id === id);
}

export function sessionById(data: PracticeData, id?: string): PracticeSession | undefined {
  return data.sessions.find((session) => session.id === id);
}

export function noteById(data: PracticeData, id?: string): ClinicalNote | undefined {
  return data.notes.find((note) => note.id === id);
}

export function recordingById(data: PracticeData, id?: string): Recording | undefined {
  return data.recordings.find((recording) => recording.id === id);
}

export function transcriptById(data: PracticeData, id?: string): Transcript | undefined {
  return data.transcripts.find((transcript) => transcript.id === id);
}

export function programById(data: PracticeData, id?: string): Program | undefined {
  return data.programs.find((program) => program.id === id);
}

export function tasksForClient(data: PracticeData, clientId: string): PracticeTask[] {
  return data.tasks.filter((task) => task.clientId === clientId);
}

export function notesForSession(data: PracticeData, sessionId: string): ClinicalNote[] {
  return data.notes.filter((note) => note.sessionId === sessionId);
}

export function recordingsForSession(data: PracticeData, sessionId: string): Recording[] {
  return data.recordings.filter((recording) => recording.sessionId === sessionId);
}

export function transcriptsForSession(data: PracticeData, sessionId: string): Transcript[] {
  return data.transcripts.filter((transcript) => transcript.sessionId === sessionId);
}

export function tasksForSession(data: PracticeData, sessionId: string): PracticeTask[] {
  return data.tasks.filter((task) => task.sessionId === sessionId);
}

export function sessionsForClient(data: PracticeData, clientId: string): PracticeSession[] {
  return data.sessions.filter((session) => session.clientId === clientId);
}

export function notesForClient(data: PracticeData, clientId: string): ClinicalNote[] {
  return data.notes.filter((note) => note.clientId === clientId);
}

export function recordingsForClient(data: PracticeData, clientId: string): Recording[] {
  return data.recordings.filter((recording) => recording.clientId === clientId);
}

export function transcriptsForClient(data: PracticeData, clientId: string): Transcript[] {
  const recordingIds = new Set(
    recordingsForClient(data, clientId).map((recording) => recording.id),
  );
  return data.transcripts.filter((transcript) => recordingIds.has(transcript.recordingId));
}

export function clientsForTherapist(data: PracticeData, therapistId: string): Client[] {
  return data.clients.filter((client) => client.therapistId === therapistId);
}

export function sessionsForTherapist(data: PracticeData, therapistId: string): PracticeSession[] {
  return data.sessions.filter((session) => session.therapistId === therapistId);
}

export function notesForTherapist(data: PracticeData, therapistId: string): ClinicalNote[] {
  return data.notes.filter((note) => note.therapistId === therapistId);
}

export function tasksForOwner(data: PracticeData, ownerId: string): PracticeTask[] {
  return data.tasks.filter((task) => task.ownerId === ownerId);
}

export function programsForTherapist(data: PracticeData, therapistId: string): Program[] {
  return data.programs.filter((program) => program.leadTherapistId === therapistId);
}

export function clientsForProgram(data: PracticeData, programId: string): Client[] {
  return data.clients.filter((client) => client.programIds.includes(programId));
}

export function sessionsForProgram(data: PracticeData, programId: string): PracticeSession[] {
  return data.sessions.filter((session) => session.programId === programId);
}
