import { Drawer } from '@base-ui/react/drawer';
import { type DragEvent, useMemo, useState } from 'react';
import { GridSection } from '../../components/GridSection';
import { Screen } from '../../components/Screen';
import { SquareGrid } from '../../components/SquareGrid';
import {
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
  ClientLegend,
  NoteLegend,
  ProgramLegend,
  RecordingLegend,
  SessionLegend,
  TaskLegend,
  TherapistLegend,
  TranscriptLegend,
} from './legends';
import {
  clientById,
  notesForSession,
  programById,
  recordingsForSession,
  tasksForSession,
  therapistById,
  transcriptsForSession,
} from './lookups';
import {
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
  ClientPreview,
  NotePreview,
  ProgramPreview,
  RecordingPreview,
  SessionPreview,
  TaskPreview,
  TherapistPreview,
  TranscriptPreview,
} from './previews';
import type { DropMenuState } from './RelationshipDropMenu';
import {
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
import type { Client, PracticeData, PracticeSession, Therapist } from './types';

export function SessionScreen({
  data,
  session,
  dragged,
  onOpenClient,
  onOpenTherapist,
  onDragStart,
  onDragEnd,
  onDropMenu,
}: {
  data: PracticeData;
  session: PracticeSession;
  dragged: CarriedPracticeItem | null;
  onOpenClient: (client: Client) => void;
  onOpenTherapist: (therapist: Therapist) => void;
  onDragStart: (item: CarriedPracticeItem) => void;
  onDragEnd: () => void;
  onDropMenu: (drop: DropMenuState) => void;
}) {
  const [query, setQuery] = useState('');
  const client = clientById(data, session.clientId);
  const therapist = therapistById(data, session.therapistId);
  const program = programById(data, session.programId);
  const sessionNotes = notesForSession(data, session.id);
  const sessionRecordings = recordingsForSession(data, session.id);
  const sessionTranscripts = transcriptsForSession(data, session.id);
  const sessionTasks = tasksForSession(data, session.id);

  const sessions = useMemo(
    () => filterItems([session], query, sessionSearchText),
    [query, session],
  );
  const clients = useMemo(
    () => filterItems(client ? [client] : [], query, clientSearchText),
    [client, query],
  );
  const therapists = useMemo(
    () => filterItems(therapist ? [therapist] : [], query, therapistSearchText),
    [query, therapist],
  );
  const programs = useMemo(
    () => filterItems(program ? [program] : [], query, programSearchText),
    [program, query],
  );
  const notes = useMemo(
    () => filterItems(sessionNotes, query, noteSearchText),
    [query, sessionNotes],
  );
  const recordings = useMemo(
    () => filterItems(sessionRecordings, query, recordingSearchText),
    [query, sessionRecordings],
  );
  const transcripts = useMemo(
    () => filterItems(sessionTranscripts, query, transcriptSearchText),
    [query, sessionTranscripts],
  );
  const tasks = useMemo(
    () =>
      filterItems(sessionTasks, query, (task) =>
        taskSearchText(task, data.therapists, data.administrators),
      ),
    [data.administrators, data.therapists, query, sessionTasks],
  );
  const canDropOnNote = dragged?.kind === 'transcript';

  function handleDropOnNote(noteId: string, event: DragEvent<HTMLElement>) {
    const note = sessionNotes.find((item) => item.id === noteId);
    if (!note || dragged?.kind !== 'transcript') return;

    onDropMenu({
      type: 'transcript-note',
      transcript: dragged.transcript,
      note,
      x: event.clientX,
      y: event.clientY,
    });
  }

  function handleDropOnCurrentSession(event: DragEvent<HTMLElement>) {
    if (!dragged) return;

    if (dragged.kind === 'recording') {
      onDropMenu({
        type: 'recording-session',
        recording: dragged.recording,
        session,
        x: event.clientX,
        y: event.clientY,
      });
    }

    if (dragged.kind === 'therapist') {
      onDropMenu({
        type: 'therapist-session',
        therapist: dragged.therapist,
        session,
        x: event.clientX,
        y: event.clientY,
      });
    }
  }

  return (
    <Drawer.Content className="screen">
      <Screen
        title={`${client?.displayName || session.id} session`}
        leading={<Drawer.Close className="back">← Back</Drawer.Close>}
        search={query}
        onSearchChange={setQuery}
        count={`${session.status} / ${session.modality} / ${formatDateTime(session.startsAt)}`}
      >
        <div className="sections">
          <GridSection title="Session" empty="No matching session.">
            {sessions.length > 0 && (
              <>
                <SessionLegend />
                <SquareGrid
                  items={sessions}
                  label="Session"
                  getLabel={(item) => `${formatDateTime(item.startsAt)} · ${item.status}`}
                  getStatus={sessionSquareStatus}
                  onDragStart={(item) => onDragStart(sessionToPouchItem(item))}
                  onDragEnd={onDragEnd}
                  onDrop={
                    dragged?.kind === 'recording' || dragged?.kind === 'therapist'
                      ? (_item, event) => handleDropOnCurrentSession(event)
                      : undefined
                  }
                  renderPreview={(item) => (
                    <SessionPreview
                      session={item}
                      client={client}
                      therapist={therapist}
                      program={program}
                    />
                  )}
                  renderContextMenu={(item) => <SessionContextMenu session={item} />}
                />
              </>
            )}
          </GridSection>

          <GridSection title="Client" empty="No matching client.">
            {clients.length > 0 && (
              <>
                <ClientLegend />
                <SquareGrid
                  items={clients}
                  label="Client"
                  getLabel={(item) => item.displayName}
                  getStatus={clientSquareStatus}
                  onPick={onOpenClient}
                  onDragStart={(item) => onDragStart(clientToPouchItem(item))}
                  onDragEnd={onDragEnd}
                  renderPreview={(item) => (
                    <ClientPreview
                      client={item}
                      therapist={therapistById(data, item.therapistId)}
                      programs={program ? [program] : []}
                    />
                  )}
                  renderContextMenu={(item) => <ClientContextMenu client={item} />}
                />
              </>
            )}
          </GridSection>

          <GridSection title="Therapist" empty="No matching therapist.">
            {therapists.length > 0 && (
              <>
                <TherapistLegend />
                <SquareGrid
                  items={therapists}
                  label="Therapist"
                  getLabel={(item) => item.name}
                  getStatus={therapistSquareStatus}
                  onPick={onOpenTherapist}
                  onDragStart={(item) => onDragStart(therapistToPouchItem(item))}
                  onDragEnd={onDragEnd}
                  renderPreview={(item) => (
                    <TherapistPreview
                      therapist={item}
                      supervisor={therapistById(data, item.supervisorId)}
                    />
                  )}
                  renderContextMenu={(item) => <TherapistContextMenu therapist={item} />}
                />
              </>
            )}
          </GridSection>

          <GridSection title="Group" empty="No matching group.">
            {programs.length > 0 && (
              <>
                <ProgramLegend />
                <SquareGrid
                  items={programs}
                  label="Therapy group"
                  getLabel={(item) => item.name}
                  getStatus={programSquareStatus}
                  onDragStart={(item) => onDragStart(programToPouchItem(item))}
                  onDragEnd={onDragEnd}
                  renderPreview={(item) => (
                    <ProgramPreview
                      program={item}
                      lead={therapistById(data, item.leadTherapistId)}
                    />
                  )}
                  renderContextMenu={(item) => <ProgramContextMenu program={item} />}
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
                  onDrop={
                    canDropOnNote ? (note, event) => handleDropOnNote(note.id, event) : undefined
                  }
                  renderPreview={(note) => (
                    <NotePreview note={note} client={client} therapist={therapist} />
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
                    <RecordingPreview recording={recording} client={client} therapist={therapist} />
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
                  renderContextMenu={(transcript) => (
                    <TranscriptContextMenu transcript={transcript} />
                  )}
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
                      client={client}
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
        </div>
      </Screen>
    </Drawer.Content>
  );
}
