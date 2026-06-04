import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Role } from '../../../shared/types';

type AuthState = {
  token: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    collegeId?: string;
    departmentId?: string;
  } | null;
  selectedCollegeId: string | null;
};

const initialState: AuthState = {
  token: null,
  user: null,
  selectedCollegeId: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<Pick<AuthState, 'token' | 'user'>>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.selectedCollegeId = action.payload.user?.collegeId ?? null;
    },
    setSelectedCollegeId(state, action: PayloadAction<string | null>) {
      state.selectedCollegeId = action.payload;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.selectedCollegeId = null;
    }
  }
});

export const { setCredentials, setSelectedCollegeId, logout } = authSlice.actions;
export default authSlice.reducer;
