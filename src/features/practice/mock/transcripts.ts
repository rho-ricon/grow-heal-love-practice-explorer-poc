import type { Transcript } from '../types';

export const transcripts: Transcript[] = [
  {
    id: 'tr-4004',
    recordingId: 're-3004',
    sessionId: 'se-1004',
    status: 'linked',
    wordCount: 6420,
    redactionCount: 1,
    reviewedBy: 'th-naomi',
  },
  {
    id: 'tr-4006',
    recordingId: 're-3006',
    sessionId: 'se-1006',
    status: 'review',
    wordCount: 5810,
    redactionCount: 3,
    reviewedBy: 'th-jules',
  },
  {
    id: 'tr-4007',
    recordingId: 're-3007',
    sessionId: 'se-1007',
    status: 'redaction',
    wordCount: 6040,
    redactionCount: 5,
  },
  {
    id: 'tr-4012',
    recordingId: 're-3012',
    sessionId: 'se-1008',
    status: 'transcribing',
    wordCount: 0,
    redactionCount: 0,
  },
];
