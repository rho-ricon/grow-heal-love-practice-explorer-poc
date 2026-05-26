import { Menu } from '@base-ui/react/menu';
import { type ReactNode, useMemo } from 'react';
import { copyText } from '../../utils/clipboard';
import type {
  Administrator,
  Client,
  ClinicalNote,
  PracticeSession,
  PracticeTask,
  Program,
  Recording,
  Therapist,
  Transcript,
} from './types';

export type DropMenuState =
  | { type: 'client-therapist'; client: Client; therapist: Therapist; x: number; y: number }
  | {
      type: 'client-administrator';
      client: Client;
      administrator: Administrator;
      x: number;
      y: number;
    }
  | { type: 'task-therapist'; task: PracticeTask; therapist: Therapist; x: number; y: number }
  | {
      type: 'task-administrator';
      task: PracticeTask;
      administrator: Administrator;
      x: number;
      y: number;
    }
  | { type: 'client-program'; client: Client; program: Program; x: number; y: number }
  | {
      type: 'recording-session';
      recording: Recording;
      session: PracticeSession;
      x: number;
      y: number;
    }
  | { type: 'transcript-note'; transcript: Transcript; note: ClinicalNote; x: number; y: number }
  | { type: 'note-therapist'; note: ClinicalNote; therapist: Therapist; x: number; y: number }
  | {
      type: 'therapist-session';
      therapist: Therapist;
      session: PracticeSession;
      x: number;
      y: number;
    };

export function RelationshipDropMenu({
  drop,
  onClose,
  onOpenClient,
  onOpenTherapist,
  onOpenProgram,
}: {
  drop: DropMenuState | null;
  onClose: () => void;
  onOpenClient: (client: Client) => void;
  onOpenTherapist: (therapist: Therapist) => void;
  onOpenProgram: (program: Program) => void;
}) {
  const anchor = useMemo(() => (drop ? pointAnchor(drop.x, drop.y) : null), [drop]);

  return (
    <Menu.Root open={drop !== null} onOpenChange={(open) => !open && onClose()} modal={false}>
      <Menu.Portal>
        <Menu.Positioner
          className="contextMenuPositioner"
          anchor={anchor}
          positionMethod="fixed"
          side="bottom"
          align="start"
          sideOffset={6}
        >
          <Menu.Popup className="contextMenuPopup">
            {drop?.type === 'client-therapist' && (
              <>
                <DropLabel>
                  {drop.client.displayName} → {drop.therapist.name}
                </DropLabel>
                <DropMenuItem onClick={() => onOpenTherapist(drop.therapist)}>
                  Open therapist caseload
                </DropMenuItem>
                <DropMenuItem onClick={() => onOpenClient(drop.client)}>
                  Open client workspace
                </DropMenuItem>
                <Menu.Separator className="contextMenuSeparator" />
                <MockAction onClose={onClose}>Mock: assign / transfer client</MockAction>
                <MockAction onClose={onClose}>Mock: schedule consultation</MockAction>
              </>
            )}

            {drop?.type === 'client-administrator' && (
              <>
                <DropLabel>
                  {drop.client.displayName} → {drop.administrator.name}
                </DropLabel>
                <DropMenuItem onClick={() => onOpenClient(drop.client)}>
                  Open client workspace
                </DropMenuItem>
                <Menu.Separator className="contextMenuSeparator" />
                <MockAction onClose={onClose}>Mock: hand off intake follow-up</MockAction>
                <MockAction onClose={onClose}>Mock: create scheduling task</MockAction>
              </>
            )}

            {drop?.type === 'task-therapist' && (
              <>
                <DropLabel>
                  {drop.task.title} → {drop.therapist.name}
                </DropLabel>
                <DropMenuItem onClick={() => onOpenTherapist(drop.therapist)}>
                  Open therapist workspace
                </DropMenuItem>
                <Menu.Separator className="contextMenuSeparator" />
                <MockAction onClose={onClose}>Mock: assign clinical task</MockAction>
              </>
            )}

            {drop?.type === 'task-administrator' && (
              <>
                <DropLabel>
                  {drop.task.title} → {drop.administrator.name}
                </DropLabel>
                <MockAction onClose={onClose}>Mock: assign admin task</MockAction>
                <MockAction onClose={onClose}>Mock: add to queue</MockAction>
              </>
            )}

            {drop?.type === 'client-program' && (
              <>
                <DropLabel>
                  {drop.client.displayName} → {drop.program.name}
                </DropLabel>
                <DropMenuItem onClick={() => onOpenProgram(drop.program)}>Open group</DropMenuItem>
                <DropMenuItem onClick={() => onOpenClient(drop.client)}>
                  Open client workspace
                </DropMenuItem>
                <Menu.Separator className="contextMenuSeparator" />
                <MockAction onClose={onClose}>Mock: add to interest list</MockAction>
                <MockAction onClose={onClose}>Mock: screen for fit</MockAction>
              </>
            )}

            {drop?.type === 'recording-session' && (
              <>
                <DropLabel>
                  {drop.recording.id} → {drop.session.id}
                </DropLabel>
                <MockAction onClose={onClose}>Mock: attach recording</MockAction>
                <MockAction onClose={onClose}>Mock: start transcript job</MockAction>
              </>
            )}

            {drop?.type === 'transcript-note' && (
              <>
                <DropLabel>
                  {drop.transcript.id} → {drop.note.id}
                </DropLabel>
                <MockAction onClose={onClose}>Mock: link transcript to note</MockAction>
                <MockAction onClose={onClose}>Mock: draft note from transcript</MockAction>
              </>
            )}

            {drop?.type === 'note-therapist' && (
              <>
                <DropLabel>
                  {drop.note.id} → {drop.therapist.name}
                </DropLabel>
                <DropMenuItem onClick={() => onOpenTherapist(drop.therapist)}>
                  Open reviewer workspace
                </DropMenuItem>
                <Menu.Separator className="contextMenuSeparator" />
                <MockAction onClose={onClose}>Mock: request note review</MockAction>
              </>
            )}

            {drop?.type === 'therapist-session' && (
              <>
                <DropLabel>
                  {drop.therapist.name} → {drop.session.id}
                </DropLabel>
                <DropMenuItem onClick={() => onOpenTherapist(drop.therapist)}>
                  Open therapist workspace
                </DropMenuItem>
                <Menu.Separator className="contextMenuSeparator" />
                <MockAction onClose={onClose}>Mock: assign session coverage</MockAction>
              </>
            )}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

function MockAction({ children, onClose }: { children: string; onClose: () => void }) {
  return (
    <DropMenuItem
      onClick={() => {
        copyText(children);
        onClose();
      }}
    >
      {children}
    </DropMenuItem>
  );
}

function DropLabel({ children }: { children: ReactNode }) {
  return <div className="dropMenuLabel">{children}</div>;
}

function DropMenuItem({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <Menu.Item className="contextMenuItem" onClick={onClick}>
      {children}
    </Menu.Item>
  );
}

function pointAnchor(x: number, y: number) {
  return {
    getBoundingClientRect() {
      return {
        x,
        y,
        width: 0,
        height: 0,
        top: y,
        right: x,
        bottom: y,
        left: x,
      };
    },
  };
}
