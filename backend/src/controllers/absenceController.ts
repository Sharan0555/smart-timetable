import { asyncHandler } from '../utils/asyncHandler.js';
import { markFacultyAbsent } from '../services/absenceService.js';

export const markAbsent = asyncHandler(async (req, res) => {
  const result = await markFacultyAbsent({
    collegeId: req.body.collegeId,
    facultyId: req.body.facultyId,
    date: req.body.date,
    reason: req.body.reason,
    markedBy: req.user?.id
  });
  res.status(201).json(result);
});
