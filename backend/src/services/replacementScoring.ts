type FacultyCandidate = {
  _id: string;
  maxWeeklyLoad: number;
  currentWeeklyLoad: number;
  availability?: Array<{ day: string; slotIndex: number; isAvailable: boolean }>;
  expertiseSubjectIds?: Array<string | { toString(): string }>;
};

export const scoreReplacementFaculty = (candidate: FacultyCandidate, params: { day: string; slotIndex: number; subjectId: string }) => {
  const loadScore = Math.max(0, candidate.maxWeeklyLoad - candidate.currentWeeklyLoad);
  const availabilityMatch = candidate.availability?.some(
    (availability) => availability.day === params.day && availability.slotIndex === params.slotIndex && availability.isAvailable
  )
    ? 10
    : 0;
  const subjectAffinity = candidate.expertiseSubjectIds?.some((id) => String(id) === params.subjectId) ? 15 : 0;
  return loadScore + availabilityMatch + subjectAffinity;
};
