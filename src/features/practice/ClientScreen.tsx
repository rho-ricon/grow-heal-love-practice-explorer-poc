import { Drawer } from '@base-ui/react/drawer';
import { type DragEvent, useMemo, useState } from 'react';
import { GridSection } from '../../components/GridSection';
import { Screen } from '../../components/Screen';
import { SquareGrid } from '../../components/SquareGrid';
import {
  NoteContextMenu,
  RecordingContextMenu,
  SessionContextMenu,
  TaskContextMenu,
  TranscriptContextMenu,
} from './contextMenus';
import {
  NoteLegend,
  RecordingLegend,
  SessionLegend,
  TaskLegend,
  TranscriptLegend,
} from './legends';
import {
  notesForClient,
  recordingsForClient,
  sessionsForClient,
  tasksForClient,
  therapistById,
  transcriptsForClient,
} from './lookups';
import {
  type CarriedPracticeItem,
  noteToPouchItem,
  recordingToPouchItem,
  sessionToPouchItem,
  taskToPouchItem,
  transcriptToPouchItem,
} from './pouchItems';
import {
  NotePreview,
  RecordingPreview,
  SessionPreview,
  TaskPreview,
  TranscriptPreview,
} from './previews';
import type { DropMenuState } from './RelationshipDropMenu';
import {
  filterItems,
  noteSearchText,
  recordingSearchText,
  sessionSearchText,
  taskSearchText,
  transcriptSearchText,
} from './search';
import {
  formatDateTime,
  noteSquareStatus,
  recordingSquareStatus,
  sessionSquareStatus,
  taskSquareStatus,
  transcriptSquareStatus,
} from './status';
import type { Client, PracticeData } from './types';

export function ClientScreen({
  data,
  client,
  dragged,
  onDragStart,
  onDragEnd,
  onDropMenu,
}: {
  data: PracticeData;
  client: Client;
  dragged: CarriedPracticeItem | null;
  onDragStart: (item: CarriedPracticeItem) => void;
  onDragEnd: () => void;
  onDropMenu: (drop: DropMenuState) => void;
}) {
  const [query, setQuery] = useState('');
  const therapist = therapistById(data, client.therapistId);
  const clientSessions = sessionsForClient(data, client.id);
  const clientNotes = notesForClient(data, client.id);
  const clientRecordings = recordingsForClient(data, client.id);
  const clientTranscripts = transcriptsForClient(data, client.id);
  const clientTasks = tasksForClient(data, client.id);

  const sessions = useMemo(
    () => filterItems(clientSessions, query, sessionSearchText),
    [clientSessions, query],
  );
  const notes = useMemo(
    () => filterItems(clientNotes, query, noteSearchText),
    [clientNotes, query],
  );
  const recordings = useMemo(
    () => filterItems(clientRecordings, query, recordingSearchText),
    [clientRecordings, query],
  );
  const transcripts = useMemo(
    () => filterItems(clientTranscripts, query, transcriptSearchText),
    [clientTranscripts, query],
  );
  const tasks = useMemo(
    () =>
      filterItems(clientTasks, query, (task) =>
        taskSearchText(task, data.therapists, data.administrators),
      ),
    [clientTasks, data.administrators, data.therapists, query],
  );
  const canDropOnSession = dragged?.kind === 'recording' || dragged?.kind === 'therapist';
  const canDropOnNote = dragged?.kind === 'transcript';

  function handleDropOnSession(sessionId: string, event: DragEvent<HTMLElement>) {
    const session = clientSessions.find((item) => item.id === sessionId);
    if (!session || !dragged) return;

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

  function handleDropOnNote(noteId: string, event: DragEvent<HTMLElement>) {
    const note = clientNotes.find((item) => item.id === noteId);
    if (!note || dragged?.kind !== 'transcript') return;

    onDropMenu({
      type: 'transcript-note',
      transcript: dragged.transcript,
      note,
      x: event.clientX,
      y: event.clientY,
    });
  }

  return (
    <Drawer.Content className="screen">
      <Screen
        title={client.displayName}
        leading={<Drawer.Close className="back">← Back</Drawer.Close>}
        search={query}
        onSearchChange={setQuery}
        count={`${client.stage} / ${therapist?.name || 'unmatched'} / ${tasks.length} tasks`}
      >
        <div className="sections">
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
                  onDrop={
                    canDropOnSession
                      ? (session, event) => handleDropOnSession(session.id, event)
                      : undefined
                  }
                  renderPreview={(session) => (
                    <SessionPreview
                      session={session}
                      client={client}
                      therapist={therapistById(data, session.therapistId)}
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
                  label="Note"
                  getLabel={(note) => `${note.id}: ${note.status}`}
                  getStatus={noteSquareStatus}
                  onDragStart={(note) => onDragStart(noteToPouchItem(note))}
                  onDragEnd={onDragEnd}
                  onDrop={
                    canDropOnNote ? (note, event) => handleDropOnNote(note.id, event) : undefined
                  }
                  renderPreview={(note) => (
                    <NotePreview
                      note={note}
                      client={client}
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
                  label="Recording"
                  getLabel={(recording) => recording.id}
                  getStatus={recordingSquareStatus}
                  onDragStart={(recording) => onDragStart(recordingToPouchItem(recording))}
                  onDragEnd={onDragEnd}
                  renderPreview={(recording) => (
                    <RecordingPreview
                      recording={recording}
                      client={client}
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
