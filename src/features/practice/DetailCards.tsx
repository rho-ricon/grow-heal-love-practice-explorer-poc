import type { DragEvent, ReactNode } from 'react';
import { formatDateTime, taskOwnerLabel, taskSquareStatus } from './status';
import type { PracticeData, PracticeTask } from './types';

export function DetailCard({
  title,
  kicker,
  description,
  state,
  meta,
  onOpen,
  onCarry,
  onDragEnd,
  onDrop,
}: {
  title: string;
  kicker: string;
  description: string;
  state?: string;
  meta: string[];
  onOpen?: () => void;
  onCarry?: (event: DragEvent<HTMLElement>) => void;
  onDragEnd?: () => void;
  onDrop?: (event: DragEvent<HTMLElement>) => void;
}) {
  return (
    <article
      className="detailCard"
      data-state={state}
      data-droppable={onDrop ? 'true' : undefined}
      draggable={Boolean(onCarry)}
      onDragStart={onCarry}
      onDragEnd={onDragEnd}
      onDragOver={(event) => {
        if (!onDrop) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
      }}
      onDrop={(event) => {
        if (!onDrop) return;
        event.preventDefault();
        onDrop(event);
      }}
    >
      <span className="recordingKicker">{kicker}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <MetaList items={meta} />
      {onOpen && (
        <button className="actionButton" type="button" onClick={onOpen}>
          Open
        </button>
      )}
    </article>
  );
}

export function PipelineCard({
  title,
  description,
  state,
  meta,
  onOpen,
  onCarry,
  onDragEnd,
  onDrop,
}: {
  title: string;
  description: string;
  state?: string;
  meta: string[];
  onOpen?: () => void;
  onCarry?: (event: DragEvent<HTMLElement>) => void;
  onDragEnd?: () => void;
  onDrop?: (event: DragEvent<HTMLElement>) => void;
}) {
  return (
    <article
      className="pipelineCard"
      data-state={state}
      data-droppable={onDrop ? 'true' : undefined}
      draggable={Boolean(onCarry)}
      onDragStart={onCarry}
      onDragEnd={onDragEnd}
      onDragOver={(event) => {
        if (!onDrop) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
      }}
      onDrop={(event) => {
        if (!onDrop) return;
        event.preventDefault();
        onDrop(event);
      }}
    >
      <span className="recordingKicker">{title}</span>
      <h3>{description}</h3>
      <MetaList items={meta} />
      {onOpen && (
        <button className="actionButton" type="button" onClick={onOpen}>
          Open
        </button>
      )}
    </article>
  );
}

export function EmptyPipelineCard({ title, description }: { title: string; description: string }) {
  return (
    <article className="pipelineCard emptyPipelineCard">
      <span className="recordingKicker">{title}</span>
      <h3>{description}</h3>
    </article>
  );
}

export function TaskCard({
  task,
  data,
  onCarry,
  onDragEnd,
}: {
  task: PracticeTask;
  data: PracticeData;
  onCarry: (event: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
}) {
  return (
    <article
      className="detailCard"
      data-state={taskSquareStatus(task)}
      draggable
      onDragStart={onCarry}
      onDragEnd={onDragEnd}
    >
      <span className="recordingKicker">{task.category}</span>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <MetaList
        items={[
          task.status,
          `${task.priority} priority`,
          `due ${formatDateTime(task.dueAt)}`,
          taskOwnerLabel(task, data.therapists, data.administrators),
        ]}
      />
    </article>
  );
}

export function StatusChip({ children, state }: { children: ReactNode; state?: string }) {
  return (
    <span className="statusChip" data-state={state}>
      {children}
    </span>
  );
}

export function MetaList({ items }: { items: string[] }) {
  return (
    <div className="artifactMeta">
      {items.filter(Boolean).map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}
