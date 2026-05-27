import { Drawer } from '@base-ui/react/drawer';
import { type DragEvent, useMemo, useState } from 'react';
import { Screen } from '../../components/Screen';
import { DetailCard, EmptyPipelineCard, PipelineCard, StatusChip, TaskCard } from './DetailCards';
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
  therapistSquareStatus,
  transcriptSquareStatus,
} from './status';
import type {
  Client,
  ClinicalNote,
  PracticeData,
  PracticeSession,
  Recording,
  Therapist,
} from './types';

export function SessionScreen({
  data,
  session,
  dragged,
  onOpenClient,
  onOpenTherapist,
  onOpenRecording,
  onDragStart,
  onDragEnd,
  onDropMenu,
}: {
  data: PracticeData;
  session: PracticeSession;
  dragged: CarriedPracticeItem | null;
  onOpenClient: (client: Client) => void;
  onOpenTherapist: (therapist: Therapist) => void;
  onOpenRecording: (recording: Recording) => void;
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

  const sessionMatches = useMemo(
    () => filterItems([session], query, sessionSearchText).length > 0,
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
  const signedNote = sessionNotes.find((note) => note.status === 'signed');
  const documentationComplete = [
    sessionRecordings.length > 0,
    sessionTranscripts.length > 0,
    sessionNotes.length > 0,
    Boolean(signedNote),
  ].filter(Boolean).length;

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

  function handleDropOnNote(note: ClinicalNote, event: DragEvent<HTMLElement>) {
    if (dragged?.kind !== 'transcript') return;

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
        title={`${client?.displayName || session.id} session`}
        leading={<Drawer.Close className="back">← Back</Drawer.Close>}
        search={query}
        onSearchChange={setQuery}
        count={`${session.status} / ${session.modality} / ${formatDateTime(session.startsAt)}`}
      >
        <div className="detailWorkspace">
          <fieldset
            className="sessionHero detailPanel"
            data-state={sessionSquareStatus(session)}
            aria-label="Session drop target"
            data-droppable={
              dragged?.kind === 'recording' || dragged?.kind === 'therapist' ? 'true' : undefined
            }
            onDragOver={(event) => {
              if (dragged?.kind !== 'recording' && dragged?.kind !== 'therapist') return;
              event.preventDefault();
              event.dataTransfer.dropEffect = 'copy';
            }}
            onDrop={(event) => {
              if (dragged?.kind !== 'recording' && dragged?.kind !== 'therapist') return;
              event.preventDefault();
              handleDropOnCurrentSession(event);
            }}
          >
            <div>
              <span className="recordingKicker">Session dossier</span>
              <h2>{client?.displayName || session.id}</h2>
              <p>
                {formatDateTime(session.startsAt)} · {session.durationMinutes} min ·{' '}
                {session.modality} · {session.location}
              </p>
            </div>
            <div className="detailStatusRail">
              <StatusChip state={sessionSquareStatus(session)}>{session.status}</StatusChip>
              <StatusChip>{session.modality}</StatusChip>
              {program && <StatusChip>{program.name}</StatusChip>}
            </div>
            <button
              className="actionButton"
              type="button"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = 'copy';
                event.dataTransfer.setData('text/plain', session.id);
                onDragStart(sessionToPouchItem(session));
              }}
              onDragEnd={onDragEnd}
            >
              Carry session
            </button>
          </fieldset>

          <section className="detailPanel">
            <div>
              <span className="recordingKicker">Linked people</span>
              <h2>Care context</h2>
            </div>
            <div className="detailCards">
              {clients.map((item) => (
                <DetailCard
                  key={item.id}
                  title={item.displayName}
                  kicker="Client"
                  description={`${item.stage} · ${item.acuity}`}
                  state={clientSquareStatus(item)}
                  meta={[
                    `paperwork ${item.paperwork}`,
                    `recording consent ${item.recordingConsent}`,
                  ]}
                  onOpen={() => onOpenClient(item)}
                  onCarry={(event) => onCarry(event, item.displayName, clientToPouchItem(item))}
                  onDragEnd={onDragEnd}
                />
              ))}
              {therapists.map((item) => (
                <DetailCard
                  key={item.id}
                  title={item.name}
                  kicker="Therapist"
                  description={`${item.role}, ${item.credentials}`}
                  state={therapistSquareStatus(item)}
                  meta={[`${item.caseload}/${item.capacity} caseload`, `${item.noteBacklog} notes`]}
                  onOpen={() => onOpenTherapist(item)}
                  onCarry={(event) => onCarry(event, item.name, therapistToPouchItem(item))}
                  onDragEnd={onDragEnd}
                />
              ))}
              {programs.map((item) => (
                <DetailCard
                  key={item.id}
                  title={item.name}
                  kicker="Group"
                  description={item.cadence}
                  state={programSquareStatus(item)}
                  meta={[`${item.enrolled}/${item.capacity} enrolled`, item.status]}
                  onCarry={(event) => onCarry(event, item.name, programToPouchItem(item))}
                  onDragEnd={onDragEnd}
                />
              ))}
            </div>
          </section>

          <section className="detailPanel">
            <div>
              <span className="recordingKicker">Documentation pipeline</span>
              <h2>{documentationComplete}/4 steps complete</h2>
            </div>
            <div className="pipeline">
              {sessionMatches && (
                <PipelineCard
                  title="Session"
                  description={`${session.status} · ${session.modality}`}
                  state={sessionSquareStatus(session)}
                  meta={[formatDateTime(session.startsAt), session.location]}
                  onCarry={(event) => onCarry(event, session.id, sessionToPouchItem(session))}
                  onDragEnd={onDragEnd}
                  onDrop={
                    dragged?.kind === 'recording' || dragged?.kind === 'therapist'
                      ? handleDropOnCurrentSession
                      : undefined
                  }
                />
              )}
              {recordings.length === 0 ? (
                <EmptyPipelineCard title="Recording" description="No recording linked." />
              ) : (
                recordings.map((item) => (
                  <PipelineCard
                    key={item.id}
                    title="Recording"
                    description={`${item.id} · ${item.status}`}
                    state={recordingSquareStatus(item)}
                    meta={[
                      `${item.durationMinutes || 'planned'} min`,
                      `retention ${item.retentionReviewAt.slice(0, 10)}`,
                    ]}
                    onOpen={() => onOpenRecording(item)}
                    onCarry={(event) => onCarry(event, item.id, recordingToPouchItem(item))}
                    onDragEnd={onDragEnd}
                  />
                ))
              )}
              {transcripts.length === 0 ? (
                <EmptyPipelineCard title="Transcript" description="No transcript generated." />
              ) : (
                transcripts.map((item) => (
                  <PipelineCard
                    key={item.id}
                    title="Transcript"
                    description={`${item.id} · ${item.status}`}
                    state={transcriptSquareStatus(item)}
                    meta={[
                      `${item.wordCount.toLocaleString()} words`,
                      `${item.redactionCount} redactions`,
                    ]}
                    onCarry={(event) => onCarry(event, item.id, transcriptToPouchItem(item))}
                    onDragEnd={onDragEnd}
                  />
                ))
              )}
              {notes.length === 0 ? (
                <EmptyPipelineCard title="Note" description="No note started." />
              ) : (
                notes.map((item) => (
                  <PipelineCard
                    key={item.id}
                    title="Note"
                    description={`${item.id} · ${item.status}`}
                    state={noteSquareStatus(item)}
                    meta={[
                      `due ${formatDateTime(item.dueAt)}`,
                      item.needsSupervisorReview ? 'supervision' : 'clinician',
                    ]}
                    onCarry={(event) => onCarry(event, item.id, noteToPouchItem(item))}
                    onDragEnd={onDragEnd}
                    onDrop={
                      dragged?.kind === 'transcript'
                        ? (event) => handleDropOnNote(item, event)
                        : undefined
                    }
                  />
                ))
              )}
              <PipelineCard
                title="Signoff"
                description={signedNote ? 'Signed note on file' : 'Awaiting signed note'}
                state={signedNote ? 'note signed' : 'note draft overdue'}
                meta={
                  signedNote?.signedAt
                    ? [`signed ${formatDateTime(signedNote.signedAt)}`]
                    : ['not signed']
                }
              />
            </div>
          </section>

          <section className="detailPanel">
            <div>
              <span className="recordingKicker">Related work</span>
              <h2>{tasks.length} tasks</h2>
            </div>
            {tasks.length === 0 ? (
              <p>No matching tasks.</p>
            ) : (
              <div className="detailCards">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    data={data}
                    onCarry={(event) => onCarry(event, task.title, taskToPouchItem(task))}
                    onDragEnd={onDragEnd}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </Screen>
    </Drawer.Content>
  );

  function onCarry(event: DragEvent<HTMLElement>, label: string, item: CarriedPracticeItem) {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', label);
    onDragStart(item);
  }
}
