import { Drawer } from '@base-ui/react/drawer';
import { Meter } from '@base-ui/react/meter';
import { type DragEvent, useMemo, useRef, useState } from 'react';
import { Screen } from '../../components/Screen';
import { DetailCard, TaskCard } from './DetailCards';
import {
  clientById,
  notesForSession,
  segmentsForTranscript,
  sessionById,
  tasksForSession,
  therapistById,
  transcriptForRecording,
} from './lookups';
import {
  type CarriedPracticeItem,
  noteToPouchItem,
  recordingToPouchItem,
  sessionToPouchItem,
  taskToPouchItem,
  transcriptToPouchItem,
} from './pouchItems';
import type { DropMenuState } from './RelationshipDropMenu';
import { filterItems, noteSearchText, taskSearchText } from './search';
import {
  formatDate,
  formatDateTime,
  noteSquareStatus,
  recordingSquareStatus,
  sessionSquareStatus,
  transcriptSquareStatus,
} from './status';
import type { ClinicalNote, PracticeData, PracticeSession, Recording } from './types';

export function RecordingScreen({
  data,
  recording,
  dragged,
  onOpenSession,
  onDragStart,
  onDragEnd,
  onDropMenu,
}: {
  data: PracticeData;
  recording: Recording;
  dragged: CarriedPracticeItem | null;
  onOpenSession: (session: PracticeSession) => void;
  onDragStart: (item: CarriedPracticeItem) => void;
  onDragEnd: () => void;
  onDropMenu: (drop: DropMenuState) => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [query, setQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(recording.durationMinutes * 60);
  const [audioMissing, setAudioMissing] = useState(false);
  const session = sessionById(data, recording.sessionId);
  const client = clientById(data, recording.clientId);
  const therapist = therapistById(data, recording.therapistId);
  const transcript = transcriptForRecording(data, recording);
  const segments = segmentsForTranscript(transcript?.id);
  const sessionNotes = useMemo(
    () => (session ? notesForSession(data, session.id) : []),
    [data, session],
  );
  const sessionTasks = useMemo(
    () => (session ? tasksForSession(data, session.id) : []),
    [data, session],
  );
  const notes = useMemo(
    () => filterItems(sessionNotes, query, noteSearchText),
    [query, sessionNotes],
  );
  const tasks = useMemo(
    () =>
      filterItems(sessionTasks, query, (task) =>
        taskSearchText(task, data.therapists, data.administrators),
      ),
    [data.administrators, data.therapists, query, sessionTasks],
  );
  const filteredSegments = useMemo(
    () =>
      filterItems(segments, query, (segment) =>
        [segment.speaker, segment.text, segment.flags.join(' ')].join(' '),
      ),
    [query, segments],
  );
  const reviewItems = [
    { label: 'Consent verified', done: client?.recordingConsent === 'yes' },
    { label: 'Audio uploaded', done: recording.status !== 'consented' },
    {
      label: 'Transcript ready',
      done: Boolean(transcript && transcript.status !== 'transcribing'),
    },
    {
      label: 'Redactions handled',
      done: !transcript?.redactionCount || transcript.status === 'linked',
    },
    { label: 'Session note exists', done: sessionNotes.length > 0 },
  ];
  const reviewComplete = reviewItems.filter((item) => item.done).length;
  const progressMax = duration || recording.durationMinutes * 60 || 1;

  function seekTo(seconds: number) {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = seconds;
    setCurrentTime(seconds);
  }

  function handleDropOnSession(event: DragEvent<HTMLElement>) {
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
        title={`${client?.displayName || recording.id} recording`}
        leading={<Drawer.Close className="back">← Back</Drawer.Close>}
        search={query}
        onSearchChange={setQuery}
        count={`${recording.status} / ${recording.durationMinutes || 'planned'} min / retention ${formatDate(recording.retentionReviewAt)}`}
      >
        <div className="recordingWorkspace">
          <section className="recordingHero">
            <div className="recordingPlayerCard" data-state={recordingSquareStatus(recording)}>
              <div>
                <span className="recordingKicker">Audio review</span>
                <h2>{recording.id}</h2>
                <p>
                  {session ? formatDateTime(session.startsAt) : 'Unlinked session'} ·{' '}
                  {therapist?.name || 'unassigned'}
                </p>
              </div>

              {recording.audioSrc ? (
                <audio
                  ref={audioRef}
                  controls
                  src={recording.audioSrc}
                  onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                  onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
                  onError={() => setAudioMissing(true)}
                >
                  <track
                    default
                    kind="captions"
                    label="Mock transcript captions"
                    src="/audio/jung-interview.vtt"
                    srcLang="en"
                  />
                </audio>
              ) : (
                <p>No audio source linked.</p>
              )}

              {audioMissing && (
                <p className="recordingNotice">
                  Demo audio is not in git. Add an interview file at{' '}
                  <code>public/audio/jung-interview.mp3</code> to activate playback.
                </p>
              )}

              <Meter.Root
                className="meter"
                value={Math.min(currentTime, progressMax)}
                max={progressMax}
                getAriaValueText={(_, value) =>
                  `${formatSeconds(value)} elapsed of ${formatSeconds(progressMax)}`
                }
              >
                <div className="meterHeader">
                  <Meter.Label>Playback position</Meter.Label>
                  <Meter.Value>{(_, value) => formatSeconds(value)}</Meter.Value>
                </div>
                <Meter.Track className="meterTrack">
                  <Meter.Indicator className="meterIndicator" />
                </Meter.Track>
              </Meter.Root>

              <button
                className="actionButton"
                type="button"
                draggable
                onDragStart={(event) =>
                  onCarry(event, recording.id, recordingToPouchItem(recording))
                }
                onDragEnd={onDragEnd}
              >
                Carry recording
              </button>
            </div>

            <div className="recordingReviewCard">
              <MetricMeter
                label="Review completion"
                value={reviewComplete}
                max={reviewItems.length}
                valueText={`${reviewComplete}/${reviewItems.length}`}
              />
              <MetricMeter
                label="Transcript confidence"
                value={averageConfidence(segments)}
                max={100}
                valueText={`${averageConfidence(segments)}%`}
              />
              <MetricMeter
                label="Retention window"
                value={retentionRemainingPercent(recording.retentionReviewAt)}
                max={100}
                valueText={`${retentionRemainingPercent(recording.retentionReviewAt)}% remaining`}
              />
              <ul className="reviewChecklist">
                {reviewItems.map((item) => (
                  <li key={item.label} data-done={item.done ? 'true' : undefined}>
                    {item.done ? '✓' : '□'} {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="detailPanel">
            <div>
              <span className="recordingKicker">Linked context</span>
              <h2>Session artifacts</h2>
            </div>
            <div className="detailCards">
              {session && (
                <DetailCard
                  kicker="Session"
                  title={session.id}
                  description={`${session.status} · ${session.modality}`}
                  state={sessionSquareStatus(session)}
                  meta={[formatDateTime(session.startsAt), session.location]}
                  onOpen={() => onOpenSession(session)}
                  onCarry={(event) => onCarry(event, session.id, sessionToPouchItem(session))}
                  onDragEnd={onDragEnd}
                  onDrop={
                    dragged?.kind === 'recording' || dragged?.kind === 'therapist'
                      ? handleDropOnSession
                      : undefined
                  }
                />
              )}

              {transcript ? (
                <DetailCard
                  kicker="Transcript"
                  title={transcript.id}
                  description={transcript.status}
                  state={transcriptSquareStatus(transcript)}
                  meta={[
                    `${transcript.wordCount.toLocaleString()} words`,
                    `${transcript.redactionCount} redactions`,
                  ]}
                  onCarry={(event) =>
                    onCarry(event, transcript.id, transcriptToPouchItem(transcript))
                  }
                  onDragEnd={onDragEnd}
                />
              ) : (
                <DetailCard
                  kicker="Transcript"
                  title="No transcript linked"
                  description="Waiting for transcription."
                  meta={[]}
                />
              )}

              {notes.length === 0 ? (
                <DetailCard
                  kicker="Note"
                  title="No matching note"
                  description="Try clearing search or start a note."
                  meta={[]}
                />
              ) : (
                notes.map((note) => (
                  <DetailCard
                    key={note.id}
                    kicker="Note"
                    title={note.id}
                    description={note.status}
                    state={noteSquareStatus(note)}
                    meta={[
                      `due ${formatDateTime(note.dueAt)}`,
                      note.needsSupervisorReview ? 'supervision' : 'clinician',
                    ]}
                    onCarry={(event) => onCarry(event, note.id, noteToPouchItem(note))}
                    onDragEnd={onDragEnd}
                    onDrop={
                      dragged?.kind === 'transcript'
                        ? (event) => handleDropOnNote(note, event)
                        : undefined
                    }
                  />
                ))
              )}
            </div>
          </section>

          <section className="transcriptReviewPanel">
            <div>
              <span className="recordingKicker">Transcript review</span>
              <h2>Timestamped segments</h2>
            </div>
            {filteredSegments.length === 0 ? (
              <p>No matching transcript segments.</p>
            ) : (
              <div className="transcriptSegments">
                {filteredSegments.map((segment) => (
                  <button
                    className="transcriptSegment"
                    key={segment.id}
                    type="button"
                    onClick={() => seekTo(segment.startSeconds)}
                  >
                    <span className="segmentTime">{formatSeconds(segment.startSeconds)}</span>
                    <span className="segmentSpeaker">{segment.speaker}</span>
                    <span className="segmentText">{segment.text}</span>
                    <span className="segmentFlags">
                      {segment.flags.map((flag) => (
                        <span key={flag}>{flag}</span>
                      ))}
                    </span>
                    <Meter.Root
                      className="segmentMeter"
                      value={segment.confidence}
                      max={100}
                      aria-valuetext={`${segment.confidence}% transcript confidence`}
                    >
                      <Meter.Track className="meterTrack">
                        <Meter.Indicator className="meterIndicator" />
                      </Meter.Track>
                    </Meter.Root>
                  </button>
                ))}
              </div>
            )}
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

function MetricMeter({
  label,
  value,
  max,
  valueText,
}: {
  label: string;
  value: number;
  max: number;
  valueText: string;
}) {
  return (
    <Meter.Root className="meter" value={value} max={max} aria-valuetext={`${label}: ${valueText}`}>
      <div className="meterHeader">
        <Meter.Label>{label}</Meter.Label>
        <Meter.Value>{() => valueText}</Meter.Value>
      </div>
      <Meter.Track className="meterTrack">
        <Meter.Indicator className="meterIndicator" />
      </Meter.Track>
    </Meter.Root>
  );
}

function averageConfidence(segments: { confidence: number }[]) {
  if (segments.length === 0) return 0;
  return Math.round(
    segments.reduce((sum, segment) => sum + segment.confidence, 0) / segments.length,
  );
}

function retentionRemainingPercent(retentionReviewAt: string) {
  const review = new Date(retentionReviewAt).getTime();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  const remaining = review - Date.now();
  if (!Number.isFinite(remaining)) return 0;
  return Math.max(0, Math.min(100, Math.round((remaining / thirtyDays) * 100)));
}

function formatSeconds(value: number) {
  const seconds = Math.max(0, Math.floor(value));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}
