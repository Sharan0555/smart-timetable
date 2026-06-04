import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TimetableEntry } from '../../../shared/types';

type TimetableState = {
  entries: TimetableEntry[];
  loading: boolean;
  lastUpdated: string | null;
};

const initialState: TimetableState = {
  entries: [],
  loading: false,
  lastUpdated: null
};

const timetableSlice = createSlice({
  name: 'timetable',
  initialState,
  reducers: {
    setTimetable(state, action: PayloadAction<TimetableEntry[]>) {
      state.entries = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    upsertTimetableEntry(state, action: PayloadAction<TimetableEntry>) {
      const index = state.entries.findIndex((entry) => entry._id === action.payload._id);
      if (index >= 0) {
        state.entries[index] = action.payload;
      } else {
        state.entries.unshift(action.payload);
      }
      state.lastUpdated = new Date().toISOString();
    }
  }
});

export const { setTimetable, upsertTimetableEntry } = timetableSlice.actions;
export default timetableSlice.reducer;
