import { Drawer } from '@base-ui/react/drawer';
import { type DragEvent, useMemo, useState } from 'react';
import { GridSection } from '../../components/GridSection';
import { Screen } from '../../components/Screen';
import { SquareGrid } from '../../components/SquareGrid';
import { ClientContextMenu, SessionContextMenu } from './contextMenus';
import { ClientLegend, SessionLegend } from './legends';
import { clientById, clientsForProgram, sessionsForProgram, therapistById } from './lookups';
import { type CarriedPracticeItem, clientToPouchItem, sessionToPouchItem } from './pouchItems';
import { ClientPreview, SessionPreview } from './previews';
import type { DropMenuState } from './RelationshipDropMenu';
import { clientSearchText, filterItems, sessionSearchText } from './search';
import { clientSquareStatus, formatDateTime, sessionSquareStatus } from './status';
import type { Client, PracticeData, Program } from './types';

export function ProgramScreen({
  data,
  program,
  dragged,
  onOpenClient,
  onDragStart,
  onDragEnd,
  onDropMenu,
}: {
  data: PracticeData;
  program: Program;
  dragged: CarriedPracticeItem | null;
  onOpenClient: (client: Client) => void;
  onDragStart: (item: CarriedPracticeItem) => void;
  onDragEnd: () => void;
  onDropMenu: (drop: DropMenuState) => void;
}) {
  const [query, setQuery] = useState('');
  const lead = therapistById(data, program.leadTherapistId);
  const programClients = clientsForProgram(data, program.id);
  const programSessions = sessionsForProgram(data, program.id);
  const clients = useMemo(
    () => filterItems(programClients, query, clientSearchText),
    [programClients, query],
  );
  const sessions = useMemo(
    () => filterItems(programSessions, query, sessionSearchText),
    [programSessions, query],
  );
  const canDropOnSession = dragged?.kind === 'recording' || dragged?.kind === 'therapist';

  function handleDropOnSession(sessionId: string, event: DragEvent<HTMLElement>) {
    const session = programSessions.find((item) => item.id === sessionId);
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

  return (
    <Drawer.Content className="screen">
      <Screen
        title={program.name}
        leading={<Drawer.Close className="back">← Back</Drawer.Close>}
        search={query}
        onSearchChange={setQuery}
        count={`${program.status} / ${program.enrolled}/${program.capacity} enrolled / lead ${lead?.name || 'unassigned'}`}
      >
        <div className="sections">
          <GridSection title="Members" empty="No matching clients.">
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
                      programs={[program]}
                    />
                  )}
                  renderContextMenu={(client) => <ClientContextMenu client={client} />}
                />
              </>
            )}
          </GridSection>

          <GridSection title="Group Sessions" empty="No matching sessions.">
            {sessions.length > 0 && (
              <>
                <SessionLegend />
                <SquareGrid
                  items={sessions}
                  label="Group session"
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
                      client={clientById(data, session.clientId)}
                      therapist={therapistById(data, session.therapistId)}
                      program={program}
                    />
                  )}
                  renderContextMenu={(session) => <SessionContextMenu session={session} />}
                />
              </>
            )}
          </GridSection>
        </div>
      </Screen>
    </Drawer.Content>
  );
}
