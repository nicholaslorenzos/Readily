import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.0.114:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export const getBooks = async () => {
  try {
    const response = await api.get('/books');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export const searchBooks = async (query) => {
  try {
    const response = await api.get(`/books/search?query=${query}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export const addBook = async (bookData) => {
  try {
    const response = await api.post('/books', bookData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export const updateBook = async (id, bookData) => {
  try {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export const deleteBook = async (id) => {
  try {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export const checkAuthStatus = async () => {
  const token = await AsyncStorage.getItem('token');
  const user = await AsyncStorage.getItem('user');
  return { token, user: user ? JSON.parse(user) : null };
};