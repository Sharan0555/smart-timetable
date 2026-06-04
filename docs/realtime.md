# Realtime Update Mechanism

The backend emits Socket.io events whenever timetable data changes.

## Events

- `timetable:update`: emitted after lecture creation, reassignment, or status changes.
- `absence:updated`: emitted when a faculty absence is recorded.
- `notification:new`: emitted after a notification record is created.

## Subscription model

Each client should:

1. Connect to Socket.io.
2. Emit `join:college` with the current `collegeId`.
3. Listen for updates and refresh local Redux state.

This keeps students, faculty, and admins in sync without page refreshes.
