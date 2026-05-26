import { describe, expect, it } from 'vitest';
import { practiceData } from './data';
import {
  clientSquareStatus,
  noteSquareStatus,
  programSquareStatus,
  therapistSquareStatus,
  transcriptSquareStatus,
} from './status';

describe('practice square status', () => {
  it('marks urgent clients and busy care coordination', () => {
    const client = practiceData.clients.find((client) => client.id === 'cl-ember');

    expect(client && clientSquareStatus(client)).toContain('urgent');
    expect(client && clientSquareStatus(client)).toContain('busy');
  });

  it('marks unmatched clients with incomplete paperwork', () => {
    const client = practiceData.clients.find((client) => client.id === 'cl-dune');

    expect(client && clientSquareStatus(client)).toContain('unmatched');
    expect(client && clientSquareStatus(client)).toContain('paperwork');
  });

  it('marks associate therapists and note backlog', () => {
    const therapist = practiceData.therapists.find((therapist) => therapist.id === 'th-jules');

    expect(therapist && therapistSquareStatus(therapist)).toContain('associate');
    expect(therapist && therapistSquareStatus(therapist)).toContain('backlog');
  });

  it('marks notes needing supervision review', () => {
    const note = practiceData.notes.find((note) => note.id === 'no-2006');

    expect(note && noteSquareStatus(note)).toContain('supervision');
  });

  it('marks transcripts with redactions', () => {
    const transcript = practiceData.transcripts.find((transcript) => transcript.id === 'tr-4007');

    expect(transcript && transcriptSquareStatus(transcript)).toContain('redactions');
  });

  it('marks full groups as at capacity', () => {
    const program = practiceData.programs.find((program) => program.id === 'pg-teen');

    expect(program && programSquareStatus(program)).toContain('at-capacity');
  });
});
