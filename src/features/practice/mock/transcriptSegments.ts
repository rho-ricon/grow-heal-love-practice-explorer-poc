import type { TranscriptSegment } from '../types';

const compassionateTherapySegments: Omit<TranscriptSegment, 'id' | 'transcriptId'>[] = [
  {
    startSeconds: 10,
    endSeconds: 18,
    speaker: 'Madness Radio',
    text: 'What does it mean to be called crazy in a crazy world? Listen to Madness Radio, voices and visions from outside mental health.',
    confidence: 96,
    flags: ['show intro', 'source audio'],
  },
  {
    startSeconds: 27,
    endSeconds: 40,
    speaker: 'Will Hall',
    text: "Welcome to Madness Radio, this is your host Will Hall. And I'm really excited to be joined by my co-host Nikki Glasser.",
    confidence: 95,
    flags: ['host', 'orientation'],
  },
  {
    startSeconds: 40,
    endSeconds: 49,
    speaker: 'Will Hall',
    text: 'I really appreciate your work as show co-producer and co-host. Do you want to introduce our guest today, Michael Montgomery?',
    confidence: 94,
    flags: ['handoff', 'guest intro'],
  },
  {
    startSeconds: 49,
    endSeconds: 67,
    speaker: 'Nikki Glasser',
    text: 'He has a talk on YouTube called Tales of Treatment, Hope Without Borders, and I watched it recently. I just was so deeply moved by what he had to say.',
    confidence: 92,
    flags: ['guest intro', 'quote candidate'],
  },
  {
    startSeconds: 67,
    endSeconds: 85,
    speaker: 'Nikki Glasser',
    text: 'Michael Montgomery is an existential psychoanalyst working in a clinic specializing in psychosis and complex trauma. He works in the tradition of R. D. Laing using a non-pathologizing approach.',
    confidence: 88,
    flags: ['clinical context', 'transcript typo reviewed'],
  },
  {
    startSeconds: 85,
    endSeconds: 100,
    speaker: 'Michael Montgomery',
    text: "Thank you so much, Nikki, for that introduction. It's very exciting to be here, absolute pleasure to spend some time with you and Will.",
    confidence: 94,
    flags: ['guest', 'opening'],
  },
  {
    startSeconds: 100,
    endSeconds: 120,
    speaker: 'Will Hall',
    text: "We were all really struck by, you're not an ordinary, standard mainstream professional. And I think that is really going to inspire our listeners to meet you and hear about how your work is different.",
    confidence: 90,
    flags: ['formulation', 'note-worthy'],
  },
  {
    startSeconds: 120,
    endSeconds: 130,
    speaker: 'Will Hall',
    text: 'How did you get interested in being a psychotherapist, psychoanalyst, working in mental health? Did you start out more mainstream and then move to a different perspective?',
    confidence: 93,
    flags: ['clinical history', 'question'],
  },
  {
    startSeconds: 130,
    endSeconds: 153,
    speaker: 'Michael Montgomery',
    text: 'It was a parallel journey, if you like. I loved my first career in business. I worked my way up with more or less no qualifications. I left school at 16. I had undiagnosed dyslexia.',
    confidence: 89,
    flags: ['personal history', 'transcript corrected'],
  },
  {
    startSeconds: 153,
    endSeconds: 172,
    speaker: 'Michael Montgomery',
    text: 'I felt the need to find answers about the meaning of life. That really came about because I grew up in Northern Ireland during the armed conflict.',
    confidence: 91,
    flags: ['background', 'risk context'],
  },
  {
    startSeconds: 172,
    endSeconds: 183,
    speaker: 'Michael Montgomery',
    text: 'I was met with the existential realities of death and impermanence and sought the answers to that. I ended up going and living in a Buddhist retreat center for several years.',
    confidence: 90,
    flags: ['meaning-making', 'quote candidate'],
  },
];

export const transcriptSegments: TranscriptSegment[] = [
  ...segmentsFor('tr-4004'),
  ...segmentsFor('tr-4006'),
  ...segmentsFor('tr-4007'),
];

function segmentsFor(transcriptId: string): TranscriptSegment[] {
  return compassionateTherapySegments.map((segment, index) => ({
    ...segment,
    id: `${transcriptId}-segment-${index + 1}`,
    transcriptId,
  }));
}
