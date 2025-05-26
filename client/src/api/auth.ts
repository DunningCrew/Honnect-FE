import axios from 'axios';
import { API_BASE_URL } from '../constants/apiUrl';

interface AuthPayload {
  username: string;
  password: string;
}

export const login = async (payload: AuthPayload): Promise<string> => {
  const response = await axios.post(`${API_BASE_URL}/login`, payload, {
    withCredentials: true,
  });
  return response.data.access_token;
};

export const signup = async (payload: AuthPayload): Promise<void> => {
  await axios.post(`${API_BASE_URL}/register`, payload);
};
