import { Popover } from '@base-ui/react/popover';
import { describeCapacity, formatDate, formatDateTime, taskOwnerLabel } from './status';
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

export function TherapistPreview({
  therapist,
  supervisor,
}: {
  therapist: Therapist;
  supervisor?: Therapist;
}) {
  return (
    <div className="preview">
      <Popover.Title>{therapist.name}</Popover.Title>
      <Popover.Description>
        {therapist.role}, {therapist.credentials}
      </Popover.Description>
      <div className="meta">
        <span>{therapist.status}</span>
        <span>caseload {describeCapacity(therapist.caseload, therapist.capacity)}</span>
        <span>{therapist.noteBacklog} notes</span>
        <span>next {formatDate(therapist.nextAvailable)}</span>
        {supervisor && <span>supervised by {supervisor.name}</span>}
      </div>
      <div className="labels">
        {therapist.specialties.slice(0, 4).map((specialty) => (
          <span key={specialty}>{specialty}</span>
        ))}
      </div>
    </div>
  );
}

export function AdministratorPreview({ administrator }: { administrator: Administrator }) {
  return (
    <div className="preview">
      <Popover.Title>{administrator.name}</Popover.Title>
      <Popover.Description>{administrator.role}</Popover.Description>
      <div className="meta">
        <span>{administrator.status}</span>
        <span>{administrator.queue} queued</span>
        <span>{administrator.pronouns}</span>
      </div>
      <div className="labels">
        {administrator.focus.map((focus) => (
          <span key={focus}>{focus}</span>
        ))}
      </div>
      {administrator.escalation && <p>{administrator.escalation}</p>}
    </div>
  );
}

export function ClientPreview({
  client,
  therapist,
  programs,
}: {
  client: Client;
  therapist?: Therapist;
  programs: Program[];
}) {
  return (
    <div className="preview">
      <Popover.Title>{client.displayName}</Popover.Title>
      <Popover.Description>
        {client.stage} · {client.acuity}
      </Popover.Description>
      <div className="meta">
        <span>{therapist ? therapist.name : 'unmatched'}</span>
        <span>paperwork {client.paperwork}</span>
        <span>recording consent {client.recordingConsent}</span>
        <span>{client.openTaskCount} tasks</span>
      </div>
      <div className="labels">
        {[...client.tags, ...programs.map((program) => program.name)].slice(0, 5).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

export function SessionPreview({
  session,
  client,
  therapist,
  program,
}: {
  session: PracticeSession;
  client?: Client;
  therapist?: Therapist;
  program?: Program;
}) {
  return (
    <div className="preview">
      <Popover.Title>{client?.displayName || session.id}</Popover.Title>
      <Popover.Description>
        {formatDateTime(session.startsAt)} · {session.durationMinutes} min
      </Popover.Description>
      <div className="meta">
        <span>{session.status}</span>
        <span>{session.modality}</span>
        <span>{therapist?.name || 'unassigned'}</span>
        <span>{session.location}</span>
        {program && <span>{program.name}</span>}
      </div>
    </div>
  );
}

export function NotePreview({
  note,
  client,
  therapist,
}: {
  note: ClinicalNote;
  client?: Client;
  therapist?: Therapist;
}) {
  return (
    <div className="preview">
      <Popover.Title>{client?.displayName || note.id}</Popover.Title>
      <Popover.Description>{note.summary}</Popover.Description>
      <div className="meta">
        <span>{note.status}</span>
        <span>due {formatDateTime(note.dueAt)}</span>
        <span>{therapist?.name || 'unassigned'}</span>
        {note.needsSupervisorReview && <span>supervision review</span>}
        {note.signedAt && <span>signed {formatDate(note.signedAt)}</span>}
      </div>
    </div>
  );
}

export function RecordingPreview({
  recording,
  client,
  therapist,
}: {
  recording: Recording;
  client?: Client;
  therapist?: Therapist;
}) {
  return (
    <div className="preview">
      <Popover.Title>{client?.displayName || recording.id}</Popover.Title>
      <Popover.Description>
        {recording.durationMinutes || 'planned'} min recording
      </Popover.Description>
      <div className="meta">
        <span>{recording.status}</span>
        <span>{therapist?.name || 'unassigned'}</span>
        <span>captured {formatDateTime(recording.capturedAt)}</span>
        <span>review {formatDate(recording.retentionReviewAt)}</span>
      </div>
    </div>
  );
}

export function TranscriptPreview({ transcript }: { transcript: Transcript }) {
  return (
    <div className="preview">
      <Popover.Title>{transcript.id}</Popover.Title>
      <Popover.Description>Transcript for {transcript.recordingId}</Popover.Description>
      <div className="meta">
        <span>{transcript.status}</span>
        <span>{transcript.wordCount.toLocaleString()} words</span>
        <span>{transcript.redactionCount} redactions</span>
        {transcript.reviewedBy && <span>reviewed</span>}
      </div>
    </div>
  );
}

export function TaskPreview({
  task,
  client,
  therapists,
  administrators,
}: {
  task: PracticeTask;
  client?: Client;
  therapists: Therapist[];
  administrators: Administrator[];
}) {
  return (
    <div className="preview">
      <Popover.Title>{task.title}</Popover.Title>
      <Popover.Description>{task.description}</Popover.Description>
      <div className="meta">
        <span>{task.status}</span>
        <span>{task.category}</span>
        <span>{task.priority} priority</span>
        <span>due {formatDateTime(task.dueAt)}</span>
        <span>{taskOwnerLabel(task, therapists, administrators)}</span>
        {client && <span>{client.displayName}</span>}
      </div>
    </div>
  );
}

export function ProgramPreview({ program, lead }: { program: Program; lead?: Therapist }) {
  return (
    <div className="preview">
      <Popover.Title>{program.name}</Popover.Title>
      <Popover.Description>{program.cadence}</Popover.Description>
      <div className="meta">
        <span>{program.status}</span>
        <span>{describeCapacity(program.enrolled, program.capacity)} enrolled</span>
        <span>lead {lead?.name || 'unassigned'}</span>
        <span>next {formatDateTime(program.nextMeetingAt)}</span>
      </div>
      <div className="labels">
        {program.focus.map((focus) => (
          <span key={focus}>{focus}</span>
        ))}
      </div>
    </div>
  );
}
