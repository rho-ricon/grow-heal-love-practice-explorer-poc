import type { TranscriptSegment } from '../types';

const jungInterviewSegments: Omit<TranscriptSegment, 'id' | 'transcriptId'>[] = [
  {
    startSeconds: 0,
    endSeconds: 18,
    speaker: 'Interviewer',
    text: 'When you look back over the long arc of your work, what question still feels most alive?',
    confidence: 92,
    flags: ['opening', 'orientation'],
  },
  {
    startSeconds: 18,
    endSeconds: 46,
    speaker: 'Guest',
    text: 'The question is always how a person comes into relation with what is unconscious, without being swallowed by it.',
    confidence: 88,
    flags: ['clinical theme', 'quote candidate'],
  },
  {
    startSeconds: 46,
    endSeconds: 74,
    speaker: 'Interviewer',
    text: 'So the task is not simply to remove symptoms, but to understand what they are expressing?',
    confidence: 90,
    flags: ['formulation'],
  },
  {
    startSeconds: 74,
    endSeconds: 112,
    speaker: 'Guest',
    text: 'Yes. A symptom can be a messenger. The difficulty is to listen carefully enough and not rush too quickly to correction.',
    confidence: 86,
    flags: ['note-worthy', 'quote candidate'],
  },
  {
    startSeconds: 112,
    endSeconds: 145,
    speaker: 'Interviewer',
    text: 'In clinical work, how would you recognize that someone is ready for that kind of listening?',
    confidence: 83,
    flags: ['assessment'],
  },
  {
    startSeconds: 145,
    endSeconds: 188,
    speaker: 'Guest',
    text: 'One looks for stability, curiosity, and enough support in ordinary life. Without that, insight may become too heavy.',
    confidence: 87,
    flags: ['risk screen', 'treatment planning'],
  },
];

export const transcriptSegments: TranscriptSegment[] = [
  ...segmentsFor('tr-4004'),
  ...segmentsFor('tr-4006'),
  ...segmentsFor('tr-4007'),
];

function segmentsFor(transcriptId: string): TranscriptSegment[] {
  return jungInterviewSegments.map((segment, index) => ({
    ...segment,
    id: `${transcriptId}-segment-${index + 1}`,
    transcriptId,
  }));
}
