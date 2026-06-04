'use client';

import type { TimetableEntry } from '../../shared/types';

const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function LiveTimetable({ entries }: { entries: TimetableEntry[] }) {
  const grouped = dayOrder.map((day) => ({
    day,
    items: entries.filter((entry) => entry.day === day).sort((a, b) => a.slotIndex - b.slotIndex)
  }));

  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
      {grouped.map((group) => (
        <div className="card" key={group.day}>
          <h3>{group.day}</h3>
          <div className="list">
            {group.items.length ? (
              group.items.map((entry) => (
                <div className="list-item" key={entry._id ?? `${entry.day}-${entry.slotIndex}`}>
                  <div>
                    <strong>{entry.subjectName || entry.type}</strong>
                    <div className="muted">
                      {entry.timeSlot.startTime} - {entry.timeSlot.endTime}
                    </div>
                    <div className="muted">{entry.facultyName || '—'}</div>
                  </div>
                  <span className={`badge ${entry.type === 'BREAK' || entry.type === 'MEDITATION' ? 'success' : entry.status === 'reassigned' ? 'warning' : 'primary'}`}>
                    {entry.isBreak ? 'Break' : entry.isMeditation ? 'Meditation' : entry.isPractical ? 'Practical' : entry.classroomName}
                  </span>
                </div>
              ))
            ) : (
              <p className="muted">No classes scheduled.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
