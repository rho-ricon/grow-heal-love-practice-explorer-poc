import { ContextMenu } from '@base-ui/react/context-menu';
import type { ReactNode } from 'react';
import { copyText } from '../../utils/clipboard';
import { taskOwnerLabel } from './status';
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

export function TherapistContextMenu({ therapist }: { therapist: Therapist }) {
  return (
    <>
      <CopySubmenu>
        <ContextItem onClick={() => copyText(therapist.name)}>Name</ContextItem>
        <ContextItem onClick={() => copyText(therapist.credentials)}>Credentials</ContextItem>
        <ContextItem onClick={() => copyText(therapist.specialties.join(', '))}>
          Specialties
        </ContextItem>
      </CopySubmenu>
      <ContextMenu.Separator className="contextMenuSeparator" />
      <ContextItem onClick={() => copyText(`Mock chart route: /therapists/${therapist.id}`)}>
        Copy mock route
      </ContextItem>
    </>
  );
}

export function AdministratorContextMenu({ administrator }: { administrator: Administrator }) {
  return (
    <>
      <CopySubmenu>
        <ContextItem onClick={() => copyText(administrator.name)}>Name</ContextItem>
        <ContextItem onClick={() => copyText(administrator.role)}>Role</ContextItem>
        <ContextItem onClick={() => copyText(administrator.focus.join(', '))}>Focus</ContextItem>
      </CopySubmenu>
      <ContextMenu.Separator className="contextMenuSeparator" />
      <ContextItem onClick={() => copyText(`Mock route: /administrators/${administrator.id}`)}>
        Copy mock route
      </ContextItem>
    </>
  );
}

export function ClientContextMenu({ client }: { client: Client }) {
  return (
    <>
      <CopySubmenu>
        <ContextItem onClick={() => copyText(client.displayName)}>Display name</ContextItem>
        <ContextItem onClick={() => copyText(client.stage)}>Stage</ContextItem>
        <ContextItem onClick={() => copyText(client.tags.join(', '))}>Tags</ContextItem>
      </CopySubmenu>
      <ContextMenu.Separator className="contextMenuSeparator" />
      <ContextItem onClick={() => copyText(`Mock chart route: /clients/${client.id}`)}>
        Copy mock chart route
      </ContextItem>
    </>
  );
}

export function SessionContextMenu({ session }: { session: PracticeSession }) {
  return (
    <>
      <CopySubmenu>
        <ContextItem onClick={() => copyText(session.id)}>Session ID</ContextItem>
        <ContextItem onClick={() => copyText(session.startsAt)}>Start time</ContextItem>
        <ContextItem onClick={() => copyText(session.location)}>Location</ContextItem>
      </CopySubmenu>
      <ContextMenu.Separator className="contextMenuSeparator" />
      <ContextItem onClick={() => copyText(`Mock route: /sessions/${session.id}`)}>
        Copy mock route
      </ContextItem>
    </>
  );
}

export function NoteContextMenu({ note }: { note: ClinicalNote }) {
  return (
    <>
      <CopySubmenu>
        <ContextItem onClick={() => copyText(note.id)}>Note ID</ContextItem>
        <ContextItem onClick={() => copyText(note.status)}>Status</ContextItem>
        <ContextItem onClick={() => copyText(note.summary)}>Summary</ContextItem>
      </CopySubmenu>
      <ContextMenu.Separator className="contextMenuSeparator" />
      <ContextItem onClick={() => copyText(`Mock route: /notes/${note.id}`)}>
        Copy mock route
      </ContextItem>
    </>
  );
}

export function RecordingContextMenu({ recording }: { recording: Recording }) {
  return (
    <>
      <CopySubmenu>
        <ContextItem onClick={() => copyText(recording.id)}>Recording ID</ContextItem>
        <ContextItem onClick={() => copyText(recording.status)}>Status</ContextItem>
        <ContextItem onClick={() => copyText(String(recording.durationMinutes))}>
          Duration
        </ContextItem>
      </CopySubmenu>
      <ContextMenu.Separator className="contextMenuSeparator" />
      <ContextItem onClick={() => copyText(`Mock route: /recordings/${recording.id}`)}>
        Copy mock route
      </ContextItem>
    </>
  );
}

export function TranscriptContextMenu({ transcript }: { transcript: Transcript }) {
  return (
    <>
      <CopySubmenu>
        <ContextItem onClick={() => copyText(transcript.id)}>Transcript ID</ContextItem>
        <ContextItem onClick={() => copyText(transcript.status)}>Status</ContextItem>
        <ContextItem onClick={() => copyText(String(transcript.wordCount))}>Word count</ContextItem>
      </CopySubmenu>
      <ContextMenu.Separator className="contextMenuSeparator" />
      <ContextItem onClick={() => copyText(`Mock route: /transcripts/${transcript.id}`)}>
        Copy mock route
      </ContextItem>
    </>
  );
}

export function TaskContextMenu({
  task,
  therapists,
  administrators,
}: {
  task: PracticeTask;
  therapists: Therapist[];
  administrators: Administrator[];
}) {
  return (
    <>
      <CopySubmenu>
        <ContextItem onClick={() => copyText(task.title)}>Title</ContextItem>
        <ContextItem onClick={() => copyText(task.description)}>Description</ContextItem>
        <ContextItem onClick={() => copyText(taskOwnerLabel(task, therapists, administrators))}>
          Owner
        </ContextItem>
      </CopySubmenu>
      <ContextMenu.Separator className="contextMenuSeparator" />
      <ContextItem onClick={() => copyText(`Mock route: /tasks/${task.id}`)}>
        Copy mock route
      </ContextItem>
    </>
  );
}

export function ProgramContextMenu({ program }: { program: Program }) {
  return (
    <>
      <CopySubmenu>
        <ContextItem onClick={() => copyText(program.name)}>Name</ContextItem>
        <ContextItem onClick={() => copyText(program.cadence)}>Cadence</ContextItem>
        <ContextItem onClick={() => copyText(program.focus.join(', '))}>Focus</ContextItem>
      </CopySubmenu>
      <ContextMenu.Separator className="contextMenuSeparator" />
      <ContextItem onClick={() => copyText(`Mock route: /programs/${program.id}`)}>
        Copy mock route
      </ContextItem>
    </>
  );
}

function CopySubmenu({ children }: { children: ReactNode }) {
  return (
    <ContextMenu.SubmenuRoot>
      <ContextMenu.SubmenuTrigger className="contextMenuItem contextMenuSubmenuTrigger">
        <span>Copy</span>
        <span>›</span>
      </ContextMenu.SubmenuTrigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner className="contextMenuPositioner" alignOffset={-4} sideOffset={-4}>
          <ContextMenu.Popup className="contextMenuPopup">{children}</ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.SubmenuRoot>
  );
}

function ContextItem({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <ContextMenu.Item className="contextMenuItem" onClick={onClick}>
      {children}
    </ContextMenu.Item>
  );
}
