import axios from 'axios';
import { store } from '../store';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    const headers = axios.AxiosHeaders.from(config.headers);
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});
