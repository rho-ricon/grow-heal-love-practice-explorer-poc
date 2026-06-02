import { type DragEvent, useMemo } from 'react';
import { GridSection } from '../../components/GridSection';
import { SquareGrid } from '../../components/SquareGrid';
import {
  AdministratorContextMenu,
  ClientContextMenu,
  ProgramContextMenu,
  SessionContextMenu,
  TaskContextMenu,
  TherapistContextMenu,
} from './contextMenus';
import {
  AdministratorLegend,
  ClientLegend,
  ProgramLegend,
  SessionLegend,
  TaskLegend,
  TherapistLegend,
} from './legends';
import { clientById, programById, therapistById } from './lookups';
import {
  administratorToPouchItem,
  type CarriedPracticeItem,
  clientToPouchItem,
  programToPouchItem,
  sessionToPouchItem,
  taskToPouchItem,
  therapistToPouchItem,
} from './pouchItems';
import {
  AdministratorPreview,
  ClientPreview,
  ProgramPreview,
  SessionPreview,
  TaskPreview,
  TherapistPreview,
} from './previews';
import {
  administratorSearchText,
  clientSearchText,
  filterItems,
  programSearchText,
  sessionSearchText,
  taskSearchText,
  therapistSearchText,
} from './search';
import {
  administratorSquareStatus,
  clientSquareStatus,
  formatDateTime,
  programSquareStatus,
  sessionSquareStatus,
  taskSquareStatus,
  therapistSquareStatus,
} from './status';
import type {
  Administrator,
  Client,
  PracticeData,
  PracticeSession,
  Program,
  Therapist,
} from './types';

export function useOverviewCounts(data: PracticeData, query: string) {
  return {
    clients: filterItems(data.clients, query, clientSearchText).length,
    therapists: filterItems(data.therapists, query, therapistSearchText).length,
    tasks: filterItems(openTasks(data), query, (task) =>
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
  onOpenSession,
  onOpenProgram,
  onDragStart,
  onDragEnd,
  onDropOnTherapist,
  onDropOnAdministrator,
  onDropOnProgram,
  onDropOnSession,
}: {
  data: PracticeData;
  query: string;
  dragged: CarriedPracticeItem | null;
  onOpenClient: (client: Client) => void;
  onOpenTherapist: (therapist: Therapist) => void;
  onOpenSession: (session: PracticeSession) => void;
  onOpenProgram: (program: Program) => void;
  onDragStart: (item: CarriedPracticeItem) => void;
  onDragEnd: () => void;
  onDropOnTherapist: (therapist: Therapist, event: DragEvent<HTMLElement>) => void;
  onDropOnAdministrator: (administrator: Administrator, event: DragEvent<HTMLElement>) => void;
  onDropOnProgram: (program: Program, event: DragEvent<HTMLElement>) => void;
  onDropOnSession: (session: PracticeSession, event: DragEvent<HTMLElement>) => void;
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
    () => filterItems(cockpitSessions(data), query, sessionSearchText),
    [data, query],
  );
  const tasks = useMemo(
    () =>
      filterItems(openTasks(data), query, (task) =>
        taskSearchText(task, data.therapists, data.administrators),
      ),
    [data, query],
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

  return (
    <div className="sections packedSections">
      <GridSection
        title="Therapists"
        empty="No matching therapists."
        squareCount={therapists.length}
      >
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

      <GridSection
        title="Administrators"
        empty="No matching administrators."
        squareCount={administrators.length}
      >
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

      <GridSection
        title="Clients + Intake"
        empty="No matching clients."
        squareCount={clients.length}
      >
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

      <GridSection
        title="Session Agenda"
        empty="No matching agenda sessions."
        squareCount={sessions.length}
      >
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

      <GridSection
        title="Open Work Queue"
        empty="No matching open tasks."
        squareCount={tasks.length}
      >
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

      <GridSection title="Groups" empty="No matching groups." squareCount={programs.length}>
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

function cockpitSessions(data: PracticeData) {
  return data.sessions.filter((session) => session.status !== 'canceled');
}

function openTasks(data: PracticeData) {
  return data.tasks.filter((task) => task.status !== 'done');
}
