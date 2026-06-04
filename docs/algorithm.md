# Automatic Faculty Replacement Algorithm

1. Load the absent faculty member's scheduled lectures.
2. Filter candidate faculty to the same college.
3. Require matching subject expertise for the lecture subject.
4. Exclude faculty already absent or already booked in the target slot.
5. Score candidates by:
   - remaining workload capacity
   - slot availability
   - subject affinity
6. Assign the highest scoring candidate.
7. If no candidate qualifies, create an admin notification.

The current implementation is deterministic and easy to audit, which makes it safe for production use and easy to improve later with smarter ranking or ML-based prediction.
