export function TherapistLegend() {
  return (
    <div className="legend">
      <span data-state="therapist available">available</span>
      <span data-state="therapist full">full</span>
      <span data-state="therapist supervision">supervision</span>
      <span data-state="therapist away">away</span>
      <span data-state="therapist backlog">note backlog</span>
    </div>
  );
}

export function AdministratorLegend() {
  return (
    <div className="legend">
      <span data-state="administrator steady">steady</span>
      <span data-state="administrator busy">busy</span>
      <span data-state="administrator escalated">escalated</span>
      <span data-state="administrator large-queue">large queue</span>
    </div>
  );
}

export function ClientLegend() {
  return (
    <div className="legend">
      <span data-state="client inquiry">inquiry</span>
      <span data-state="client waitlist">waitlist</span>
      <span data-state="client intake">intake</span>
      <span data-state="client active">active</span>
      <span data-state="client paused">paused</span>
      <span data-state="client urgent">urgent</span>
      <span data-state="client paperwork">paperwork</span>
    </div>
  );
}

export function SessionLegend() {
  return (
    <div className="legend">
      <span data-state="session scheduled">scheduled</span>
      <span data-state="session completed">completed</span>
      <span data-state="session canceled">canceled</span>
      <span data-state="session no-show">no-show</span>
      <span data-state="session group">group</span>
    </div>
  );
}

export function NoteLegend() {
  return (
    <div className="legend">
      <span data-state="note not-started">not started</span>
      <span data-state="note draft">draft</span>
      <span data-state="note review">review</span>
      <span data-state="note signed">signed</span>
      <span data-state="note overdue">overdue</span>
      <span data-state="note supervision">supervision</span>
    </div>
  );
}

export function RecordingLegend() {
  return (
    <div className="legend">
      <span data-state="recording consented">consented</span>
      <span data-state="recording uploaded">uploaded</span>
      <span data-state="recording transcribing">transcribing</span>
      <span data-state="recording ready">ready</span>
      <span data-state="recording delete-due">delete due</span>
    </div>
  );
}

export function TranscriptLegend() {
  return (
    <div className="legend">
      <span data-state="transcript transcribing">transcribing</span>
      <span data-state="transcript ready">ready</span>
      <span data-state="transcript review">review</span>
      <span data-state="transcript redaction">redaction</span>
      <span data-state="transcript linked">linked</span>
    </div>
  );
}

export function TaskLegend() {
  return (
    <div className="legend">
      <span data-state="task todo">todo</span>
      <span data-state="task doing">doing</span>
      <span data-state="task blocked">blocked</span>
      <span data-state="task done">done</span>
      <span data-state="task high">high priority</span>
      <span data-state="task overdue">overdue</span>
    </div>
  );
}

export function ProgramLegend() {
  return (
    <div className="legend">
      <span data-state="program forming">forming</span>
      <span data-state="program open">open</span>
      <span data-state="program full">full</span>
      <span data-state="program waitlist">waitlist</span>
    </div>
  );
}
