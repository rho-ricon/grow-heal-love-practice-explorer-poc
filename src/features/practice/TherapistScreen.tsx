import { Drawer } from '@base-ui/react/drawer';
import { type DragEvent, useMemo, useState } from 'react';
import { GridSection } from '../../components/GridSection';
import { Screen } from '../../components/Screen';
import { SquareGrid } from '../../components/SquareGrid';
import {
  ClientContextMenu,
  NoteContextMenu,
  ProgramContextMenu,
  SessionContextMenu,
  TaskContextMenu,
} from './contextMenus';
import { ClientLegend, NoteLegend, ProgramLegend, SessionLegend, TaskLegend } from './legends';
import {
  clientById,
  clientsForTherapist,
  notesForTherapist,
  programsForTherapist,
  sessionsForTherapist,
  tasksForOwner,
} from './lookups';
import {
  type CarriedPracticeItem,
  clientToPouchItem,
  noteToPouchItem,
  programToPouchItem,
  sessionToPouchItem,
  taskToPouchItem,
} from './pouchItems';
import {
  ClientPreview,
  NotePreview,
  ProgramPreview,
  SessionPreview,
  TaskPreview,
} from './previews';
import type { DropMenuState } from './RelationshipDropMenu';
import {
  clientSearchText,
  filterItems,
  noteSearchText,
  programSearchText,
  sessionSearchText,
  taskSearchText,
} from './search';
import {
  clientSquareStatus,
  formatDateTime,
  noteSquareStatus,
  programSquareStatus,
  sessionSquareStatus,
  taskSquareStatus,
} from './status';
import type { Client, PracticeData, PracticeSession, Therapist } from './types';

export function TherapistScreen({
  data,
  therapist,
  dragged,
  onOpenClient,
  onOpenSession,
  onDragStart,
  onDragEnd,
  onDropMenu,
}: {
  data: PracticeData;
  therapist: Therapist;
  dragged: CarriedPracticeItem | null;
  onOpenClient: (client: Client) => void;
  onOpenSession: (session: PracticeSession) => void;
  onDragStart: (item: CarriedPracticeItem) => void;
  onDragEnd: () => void;
  onDropMenu: (drop: DropMenuState) => void;
}) {
  const [query, setQuery] = useState('');
  const therapistClients = clientsForTherapist(data, therapist.id);
  const therapistSessions = sessionsForTherapist(data, therapist.id);
  const therapistNotes = notesForTherapist(data, therapist.id);
  const therapistTasks = tasksForOwner(data, therapist.id);
  const therapistPrograms = programsForTherapist(data, therapist.id);

  const clients = useMemo(
    () => filterItems(therapistClients, query, clientSearchText),
    [therapistClients, query],
  );
  const sessions = useMemo(
    () => filterItems(therapistSessions, query, sessionSearchText),
    [therapistSessions, query],
  );
  const notes = useMemo(
    () => filterItems(therapistNotes, query, noteSearchText),
    [therapistNotes, query],
  );
  const tasks = useMemo(
    () =>
      filterItems(therapistTasks, query, (task) =>
        taskSearchText(task, data.therapists, data.administrators),
      ),
    [data.administrators, data.therapists, query, therapistTasks],
  );
  const programs = useMemo(
    () => filterItems(therapistPrograms, query, programSearchText),
    [query, therapistPrograms],
  );
  const canDropOnSession = dragged?.kind === 'recording' || dragged?.kind === 'therapist';
  const canDropOnNote = dragged?.kind === 'transcript';
  const canDropOnProgram = dragged?.kind === 'client';

  function handleDropOnSession(sessionId: string, event: DragEvent<HTMLElement>) {
    const session = therapistSessions.find((item) => item.id === sessionId);
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
    const note = therapistNotes.find((item) => item.id === noteId);
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
        title={therapist.name}
        leading={<Drawer.Close className="back">← Back</Drawer.Close>}
        search={query}
        onSearchChange={setQuery}
        count={`${therapist.role} / ${clients.length} clients / ${therapist.noteBacklog} notes`}
      >
        <div className="sections">
          <GridSection title="Caseload" empty="No matching clients.">
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
                    <ClientPreview client={client} therapist={therapist} programs={[]} />
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
                  onPick={onOpenSession}
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
                      client={clientById(data, session.clientId)}
                      therapist={therapist}
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
                      client={clientById(data, note.clientId)}
                      therapist={therapist}
                    />
                  )}
                  renderContextMenu={(note) => <NoteContextMenu note={note} />}
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
                  label="Group"
                  getLabel={(program) => program.name}
                  getStatus={programSquareStatus}
                  onDragStart={(program) => onDragStart(programToPouchItem(program))}
                  onDragEnd={onDragEnd}
                  onDrop={
                    canDropOnProgram
                      ? (program, event) => {
                          if (dragged?.kind !== 'client') return;
                          onDropMenu({
                            type: 'client-program',
                            client: dragged.client,
                            program,
                            x: event.clientX,
                            y: event.clientY,
                          });
                        }
                      : undefined
                  }
                  renderPreview={(program) => <ProgramPreview program={program} lead={therapist} />}
                  renderContextMenu={(program) => <ProgramContextMenu program={program} />}
                />
              </>
            )}
          </GridSection>
        </div>
      </Screen>
    </Drawer.Content>
  );
}
