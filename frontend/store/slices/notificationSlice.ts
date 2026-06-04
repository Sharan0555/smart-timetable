import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type NotificationItem = {
  _id?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt?: string;
};

type NotificationState = {
  items: NotificationItem[];
};

const initialState: NotificationState = {
  items: []
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<NotificationItem[]>) {
      state.items = action.payload;
    },
    pushNotification(state, action: PayloadAction<NotificationItem>) {
      state.items.unshift(action.payload);
    }
  }
});

export const { setNotifications, pushNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
