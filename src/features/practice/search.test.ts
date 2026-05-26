import { describe, expect, it } from 'vitest';
import { practiceData } from './data';
import { clientSearchText, filterItems, taskSearchText, therapistSearchText } from './search';

describe('practice search', () => {
  it('matches all query terms against client text', () => {
    const matches = filterItems(practiceData.clients, 'trauma morning', clientSearchText);

    expect(matches.map((client) => client.id)).toEqual(['cl-lumen']);
  });

  it('searches therapist specialties and modalities', () => {
    const matches = filterItems(practiceData.therapists, 'emdr assessment', therapistSearchText);

    expect(matches.map((therapist) => therapist.id)).toEqual(['th-naomi']);
  });

  it('includes owner names in task search text', () => {
    const matches = filterItems(practiceData.tasks, 'Marco denied', (task) =>
      taskSearchText(task, practiceData.therapists, practiceData.administrators),
    );

    expect(matches.map((task) => task.id)).toEqual(['ta-5003']);
  });
});
