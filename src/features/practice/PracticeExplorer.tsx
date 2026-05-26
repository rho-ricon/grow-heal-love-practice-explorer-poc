import { Drawer } from '@base-ui/react/drawer';
import { type DragEvent, useState } from 'react';
import { Pouch } from '../../components/Pouch';
import { Screen } from '../../components/Screen';
import { ClientScreen } from './ClientScreen';
import { PRACTICE_NAME, practiceData } from './data';
import { PracticeOverview, useOverviewCounts } from './PracticeOverview';
import { ProgramScreen } from './ProgramScreen';
import type { CarriedPracticeItem } from './pouchItems';
import { type DropMenuState, RelationshipDropMenu } from './RelationshipDropMenu';
import { TherapistScreen } from './TherapistScreen';
import type {
  Administrator,
  Client,
  ClinicalNote,
  PracticeSession,
  Program,
  Therapist,
} from './types';

type Selection =
  | { type: 'client'; client: Client }
  | { type: 'therapist'; therapist: Therapist }
  | { type: 'program'; program: Program }
  | null;

export function PracticeExplorer() {
  const data = practiceData;
  const [selection, setSelection] = useState<Selection>(null);
  const [dragged, setDragged] = useState<CarriedPracticeItem | null>(null);
  const [dropMenu, setDropMenu] = useState<DropMenuState | null>(null);
  const [pouchedItems, setPouchedItems] = useState<CarriedPracticeItem[]>([]);
  const [query, setQuery] = useState('');
  const counts = useOverviewCounts(data, query);

  function addToPouch(item: CarriedPracticeItem) {
    setPouchedItems((current) =>
      current.some((currentItem) => currentItem.key === item.key) ? current : [...current, item],
    );
  }

  function handlePouchDrop(event: DragEvent<HTMLElement>) {
    if (!dragged) return;

    event.preventDefault();
    addToPouch(dragged);
    setDragged(null);
  }

  function handleDropOnTherapist(therapist: Therapist, event: DragEvent<HTMLElement>) {
    if (!dragged) return;

    if (dragged.kind === 'client') {
      openDropMenu({
        type: 'client-therapist',
        client: dragged.client,
        therapist,
        x: event.clientX,
        y: event.clientY,
      });
    }

    if (dragged.kind === 'task') {
      openDropMenu({
        type: 'task-therapist',
        task: dragged.task,
        therapist,
        x: event.clientX,
        y: event.clientY,
      });
    }

    if (dragged.kind === 'note') {
      openDropMenu({
        type: 'note-therapist',
        note: dragged.note,
        therapist,
        x: event.clientX,
        y: event.clientY,
      });
    }
  }

  function handleDropOnAdministrator(administrator: Administrator, event: DragEvent<HTMLElement>) {
    if (!dragged) return;

    if (dragged.kind === 'client') {
      openDropMenu({
        type: 'client-administrator',
        client: dragged.client,
        administrator,
        x: event.clientX,
        y: event.clientY,
      });
    }

    if (dragged.kind === 'task') {
      openDropMenu({
        type: 'task-administrator',
        task: dragged.task,
        administrator,
        x: event.clientX,
        y: event.clientY,
      });
    }
  }

  function handleDropOnProgram(program: Program, event: DragEvent<HTMLElement>) {
    if (dragged?.kind !== 'client') return;

    openDropMenu({
      type: 'client-program',
      client: dragged.client,
      program,
      x: event.clientX,
      y: event.clientY,
    });
  }

  function handleDropOnSession(session: PracticeSession, event: DragEvent<HTMLElement>) {
    if (!dragged) return;

    if (dragged.kind === 'recording') {
      openDropMenu({
        type: 'recording-session',
        recording: dragged.recording,
        session,
        x: event.clientX,
        y: event.clientY,
      });
    }

    if (dragged.kind === 'therapist') {
      openDropMenu({
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

    openDropMenu({
      type: 'transcript-note',
      transcript: dragged.transcript,
      note,
      x: event.clientX,
      y: event.clientY,
    });
  }

  function openDropMenu(drop: DropMenuState) {
    setDropMenu(drop);
    setDragged(null);
  }

  function openClient(client: Client) {
    setSelection({ type: 'client', client });
    setDropMenu(null);
  }

  function openTherapist(therapist: Therapist) {
    setSelection({ type: 'therapist', therapist });
    setDropMenu(null);
  }

  function openProgram(program: Program) {
    setSelection({ type: 'program', program });
    setDropMenu(null);
  }

  return (
    <Drawer.Root open={selection !== null} onOpenChange={(open) => !open && setSelection(null)}>
      <Screen
        title={PRACTICE_NAME}
        search={query}
        onSearchChange={setQuery}
        count={`${counts.clients} clients / ${counts.therapists} therapists / ${counts.tasks} tasks`}
      >
        <PracticeOverview
          data={data}
          query={query}
          dragged={dragged}
          onOpenClient={openClient}
          onOpenTherapist={openTherapist}
          onOpenProgram={openProgram}
          onDragStart={setDragged}
          onDragEnd={() => setDragged(null)}
          onDropOnTherapist={handleDropOnTherapist}
          onDropOnAdministrator={handleDropOnAdministrator}
          onDropOnProgram={handleDropOnProgram}
          onDropOnSession={handleDropOnSession}
          onDropOnNote={handleDropOnNote}
        />
      </Screen>

      <Pouch
        items={pouchedItems}
        canDrop={Boolean(dragged)}
        onDrop={handlePouchDrop}
        onDragItem={(item) => setDragged(item)}
        onDragEnd={() => setDragged(null)}
        onRemove={(item) =>
          setPouchedItems((current) =>
            current.filter((currentItem) => currentItem.key !== item.key),
          )
        }
        onClear={() => setPouchedItems([])}
      />

      <RelationshipDropMenu
        drop={dropMenu}
        onClose={() => setDropMenu(null)}
        onOpenClient={openClient}
        onOpenTherapist={openTherapist}
        onOpenProgram={openProgram}
      />

      <Drawer.Portal>
        <Drawer.Viewport className="viewport">
          <Drawer.Popup className="drawer">
            {selection?.type === 'client' && (
              <ClientScreen
                data={data}
                client={selection.client}
                dragged={dragged}
                onDragStart={setDragged}
                onDragEnd={() => setDragged(null)}
                onDropMenu={openDropMenu}
              />
            )}
            {selection?.type === 'therapist' && (
              <TherapistScreen
                data={data}
                therapist={selection.therapist}
                dragged={dragged}
                onOpenClient={openClient}
                onDragStart={setDragged}
                onDragEnd={() => setDragged(null)}
                onDropMenu={openDropMenu}
              />
            )}
            {selection?.type === 'program' && (
              <ProgramScreen
                data={data}
                program={selection.program}
                dragged={dragged}
                onOpenClient={openClient}
                onDragStart={setDragged}
                onDragEnd={() => setDragged(null)}
                onDropMenu={openDropMenu}
              />
            )}
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
