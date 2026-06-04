import { describe, expect, it } from 'vitest';
import { scoreReplacementFaculty } from '../src/services/replacementScoring.js';

describe('scoreReplacementFaculty', () => {
  it('favours faculty with matching subject expertise and availability', () => {
    const score = scoreReplacementFaculty(
      {
        _id: '1',
        maxWeeklyLoad: 18,
        currentWeeklyLoad: 6,
        availability: [{ day: 'Monday', slotIndex: 2, isAvailable: true }],
        expertiseSubjectIds: ['subj-1']
      },
      { day: 'Monday', slotIndex: 2, subjectId: 'subj-1' }
    );

    expect(score).toBe(37);
  });

  it('prefers lower workload when no availability or subject bonus exists', () => {
    const lowLoad = scoreReplacementFaculty(
      { _id: '1', maxWeeklyLoad: 18, currentWeeklyLoad: 5 },
      { day: 'Monday', slotIndex: 1, subjectId: 'subj-1' }
    );
    const highLoad = scoreReplacementFaculty(
      { _id: '2', maxWeeklyLoad: 18, currentWeeklyLoad: 15 },
      { day: 'Monday', slotIndex: 1, subjectId: 'subj-1' }
    );

    expect(lowLoad).toBeGreaterThan(highLoad);
  });
});
