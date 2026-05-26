import { type DragEvent, useMemo } from 'react';
import { GridSection } from '../../components/GridSection';
import { SquareGrid } from '../../components/SquareGrid';
import {
  AdministratorContextMenu,
  ClientContextMenu,
  NoteContextMenu,
  ProgramContextMenu,
  RecordingContextMenu,
  SessionContextMenu,
  TaskContextMenu,
  TherapistContextMenu,
  TranscriptContextMenu,
} from './contextMenus';
import {
  AdministratorLegend,
  ClientLegend,
  NoteLegend,
  ProgramLegend,
  RecordingLegend,
  SessionLegend,
  TaskLegend,
  TherapistLegend,
  TranscriptLegend,
} from './legends';
import { clientById, programById, therapistById } from './lookups';
import {
  administratorToPouchItem,
  type CarriedPracticeItem,
  clientToPouchItem,
  noteToPouchItem,
  programToPouchItem,
  recordingToPouchItem,
  sessionToPouchItem,
  taskToPouchItem,
  therapistToPouchItem,
  transcriptToPouchItem,
} from './pouchItems';
import {
  AdministratorPreview,
  ClientPreview,
  NotePreview,
  ProgramPreview,
  RecordingPreview,
  SessionPreview,
  TaskPreview,
  TherapistPreview,
  TranscriptPreview,
} from './previews';
import {
  administratorSearchText,
  clientSearchText,
  filterItems,
  noteSearchText,
  programSearchText,
  recordingSearchText,
  sessionSearchText,
  taskSearchText,
  therapistSearchText,
  transcriptSearchText,
} from './search';
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
  PracticeData,
  PracticeSession,
  Program,
  Therapist,
} from './types';

export function useOverviewCounts(data: PracticeData, query: string) {
  return {
    clients: filterItems(data.clients, query, clientSearchText).length,
    therapists: filterItems(data.therapists, query, therapistSearchText).length,
    tasks: filterItems(data.tasks, query, (task) =>
      taskSearchText(task, data.therapists, data.administrators),
    ).length,
  };
}

export function PracticeOverview({
  data,
  query,
  dragged,
  onOpenClient,
  onOpenTherapist,
  onOpenProgram,
  onDragStart,
  onDragEnd,
  onDropOnTherapist,
  onDropOnAdministrator,
  onDropOnProgram,
  onDropOnSession,
  onDropOnNote,
}: {
  data: PracticeData;
  query: string;
  dragged: CarriedPracticeItem | null;
  onOpenClient: (client: Client) => void;
  onOpenTherapist: (therapist: Therapist) => void;
  onOpenProgram: (program: Program) => void;
  onDragStart: (item: CarriedPracticeItem) => void;
  onDragEnd: () => void;
  onDropOnTherapist: (therapist: Therapist, event: DragEvent<HTMLElement>) => void;
  onDropOnAdministrator: (administrator: Administrator, event: DragEvent<HTMLElement>) => void;
  onDropOnProgram: (program: Program, event: DragEvent<HTMLElement>) => void;
  onDropOnSession: (session: PracticeSession, event: DragEvent<HTMLElement>) => void;
  onDropOnNote: (note: ClinicalNote, event: DragEvent<HTMLElement>) => void;
}) {
  const therapists = useMemo(
    () => filterItems(data.therapists, query, therapistSearchText),
    [data.therapists, query],
  );
  const administrators = useMemo(
    () => filterItems(data.administrators, query, administratorSearchText),
    [data.administrators, query],
  );
  const clients = useMemo(
    () => filterItems(data.clients, query, clientSearchText),
    [data.clients, query],
  );
  const sessions = useMemo(
    () => filterItems(data.sessions, query, sessionSearchText),
    [data.sessions, query],
  );
  const notes = useMemo(() => filterItems(data.notes, query, noteSearchText), [data.notes, query]);
  const recordings = useMemo(
    () => filterItems(data.recordings, query, recordingSearchText),
    [data.recordings, query],
  );
  const transcripts = useMemo(
    () => filterItems(data.transcripts, query, transcriptSearchText),
    [data.transcripts, query],
  );
  const tasks = useMemo(
    () =>
      filterItems(data.tasks, query, (task) =>
        taskSearchText(task, data.therapists, data.administrators),
      ),
    [data.administrators, data.tasks, data.therapists, query],
  );
  const programs = useMemo(
    () => filterItems(data.programs, query, programSearchText),
    [data.programs, query],
  );

  const canDropOnTherapist =
    dragged?.kind === 'client' || dragged?.kind === 'task' || dragged?.kind === 'note';
  const canDropOnAdministrator = dragged?.kind === 'client' || dragged?.kind === 'task';
  const canDropOnProgram = dragged?.kind === 'client';
  const canDropOnSession = dragged?.kind === 'recording' || dragged?.kind === 'therapist';
  const canDropOnNote = dragged?.kind === 'transcript';

  return (
    <div className="sections">
      <GridSection title="Therapists" empty="No matching therapists.">
        {therapists.length > 0 && (
          <>
            <TherapistLegend />
            <SquareGrid
              items={therapists}
              label="Therapist"
              getLabel={(therapist) => therapist.name}
              getStatus={therapistSquareStatus}
              onPick={onOpenTherapist}
              onDragStart={(therapist) => onDragStart(therapistToPouchItem(therapist))}
              onDragEnd={onDragEnd}
              onDrop={canDropOnTherapist ? onDropOnTherapist : undefined}
              renderPreview={(therapist) => (
                <TherapistPreview
                  therapist={therapist}
                  supervisor={therapistById(data, therapist.supervisorId)}
                />
              )}
              renderContextMenu={(therapist) => <TherapistContextMenu therapist={therapist} />}
            />
          </>
        )}
      </GridSection>

      <GridSection title="Administrators" empty="No matching administrators.">
        {administrators.length > 0 && (
          <>
            <AdministratorLegend />
            <SquareGrid
              items={administrators}
              label="Administrator"
              getLabel={(administrator) => administrator.name}
              getStatus={administratorSquareStatus}
              onDragStart={(administrator) => onDragStart(administratorToPouchItem(administrator))}
              onDragEnd={onDragEnd}
              onDrop={canDropOnAdministrator ? onDropOnAdministrator : undefined}
              renderPreview={(administrator) => (
                <AdministratorPreview administrator={administrator} />
              )}
              renderContextMenu={(administrator) => (
                <AdministratorContextMenu administrator={administrator} />
              )}
            />
          </>
        )}
      </GridSection>

      <GridSection title="Clients" empty="No matching clients.">
        {clients.length > 0 && (
          <>
            <ClientLegend />
            <SquareGrid
              items={clients}
              label="Client"
              getLabel={(client) => client.displayName}
              getStatus={clientSquareStatus}
              onPick={onOpenClient}
              onDragStart={(client) => onDragStart(clientToPouchItem(client))}
              onDragEnd={onDragEnd}
              renderPreview={(client) => (
                <ClientPreview
                  client={client}
                  therapist={therapistById(data, client.therapistId)}
                  programs={client.programIds.flatMap((id) => {
                    const program = programById(data, id);
                    return program ? [program] : [];
                  })}
                />
              )}
              renderContextMenu={(client) => <ClientContextMenu client={client} />}
            />
          </>
        )}
      </GridSection>

      <GridSection title="Sessions" empty="No matching sessions.">
        {sessions.length > 0 && (
          <>
            <SessionLegend />
            <SquareGrid
              items={sessions}
              label="Session"
              getLabel={(session) => `${formatDateTime(session.startsAt)} · ${session.status}`}
              getStatus={sessionSquareStatus}
              onDragStart={(session) => onDragStart(sessionToPouchItem(session))}
              onDragEnd={onDragEnd}
              onDrop={canDropOnSession ? onDropOnSession : undefined}
              renderPreview={(session) => (
                <SessionPreview
                  session={session}
                  client={clientById(data, session.clientId)}
                  therapist={therapistById(data, session.therapistId)}
                  program={programById(data, session.programId)}
                />
              )}
              renderContextMenu={(session) => <SessionContextMenu session={session} />}
            />
          </>
        )}
      </GridSection>

      <GridSection title="Notes" empty="No matching notes.">
        {notes.length > 0 && (
          <>
            <NoteLegend />
            <SquareGrid
              items={notes}
              label="Session note"
              getLabel={(note) => `${note.id}: ${note.status}`}
              getStatus={noteSquareStatus}
              onDragStart={(note) => onDragStart(noteToPouchItem(note))}
              onDragEnd={onDragEnd}
              onDrop={canDropOnNote ? onDropOnNote : undefined}
              renderPreview={(note) => (
                <NotePreview
                  note={note}
                  client={clientById(data, note.clientId)}
                  therapist={therapistById(data, note.therapistId)}
                />
              )}
              renderContextMenu={(note) => <NoteContextMenu note={note} />}
            />
          </>
        )}
      </GridSection>

      <GridSection title="Recordings" empty="No matching recordings.">
        {recordings.length > 0 && (
          <>
            <RecordingLegend />
            <SquareGrid
              items={recordings}
              label="Audio recording"
              getLabel={(recording) => recording.id}
              getStatus={recordingSquareStatus}
              onDragStart={(recording) => onDragStart(recordingToPouchItem(recording))}
              onDragEnd={onDragEnd}
              renderPreview={(recording) => (
                <RecordingPreview
                  recording={recording}
                  client={clientById(data, recording.clientId)}
                  therapist={therapistById(data, recording.therapistId)}
                />
              )}
              renderContextMenu={(recording) => <RecordingContextMenu recording={recording} />}
            />
          </>
        )}
      </GridSection>

      <GridSection title="Transcripts" empty="No matching transcripts.">
        {transcripts.length > 0 && (
          <>
            <TranscriptLegend />
            <SquareGrid
              items={transcripts}
              label="Transcript"
              getLabel={(transcript) => transcript.id}
              getStatus={transcriptSquareStatus}
              onDragStart={(transcript) => onDragStart(transcriptToPouchItem(transcript))}
              onDragEnd={onDragEnd}
              renderPreview={(transcript) => <TranscriptPreview transcript={transcript} />}
              renderContextMenu={(transcript) => <TranscriptContextMenu transcript={transcript} />}
            />
          </>
        )}
      </GridSection>

      <GridSection title="Tasks" empty="No matching tasks.">
        {tasks.length > 0 && (
          <>
            <TaskLegend />
            <SquareGrid
              items={tasks}
              label="Task"
              getLabel={(task) => task.title}
              getStatus={taskSquareStatus}
              onDragStart={(task) => onDragStart(taskToPouchItem(task))}
              onDragEnd={onDragEnd}
              renderPreview={(task) => (
                <TaskPreview
                  task={task}
                  client={clientById(data, task.clientId)}
                  therapists={data.therapists}
                  administrators={data.administrators}
                />
              )}
              renderContextMenu={(task) => (
                <TaskContextMenu
                  task={task}
                  therapists={data.therapists}
                  administrators={data.administrators}
                />
              )}
            />
          </>
        )}
      </GridSection>

      <GridSection title="Groups" empty="No matching groups.">
        {programs.length > 0 && (
          <>
            <ProgramLegend />
            <SquareGrid
              items={programs}
              label="Therapy group"
              getLabel={(program) => program.name}
              getStatus={programSquareStatus}
              onPick={onOpenProgram}
              onDragStart={(program) => onDragStart(programToPouchItem(program))}
              onDragEnd={onDragEnd}
              onDrop={canDropOnProgram ? onDropOnProgram : undefined}
              renderPreview={(program) => (
                <ProgramPreview
                  program={program}
                  lead={therapistById(data, program.leadTherapistId)}
                />
              )}
              renderContextMenu={(program) => <ProgramContextMenu program={program} />}
            />
          </>
        )}
      </GridSection>
    </div>
  );
}
