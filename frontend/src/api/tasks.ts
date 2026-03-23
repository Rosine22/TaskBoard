import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/tasks`
    : '/tasks',
});

export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export const tasksApi = {
  getAll: (): Promise<Task[]> =>
    api.get('/').then(r => r.data),

  create: (data: { title: string; description?: string }): Promise<Task> =>
    api.post('/', data).then(r => r.data),

  updateStatus: (id: string, status: TaskStatus): Promise<Task> =>
    api.patch(`/${id}/status`, { status }).then(r => r.data),

  remove: (id: string): Promise<{ deleted: boolean }> =>
    api.delete(`/${id}`).then(r => r.data),
};