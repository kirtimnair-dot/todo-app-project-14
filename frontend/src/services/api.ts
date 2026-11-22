
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: "pending" | "completed";
  priority: "low" | "medium" | "high";
  due_date?: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface TaskData {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  status?: "pending" | "completed";
  due_date?: string;
}

// API Error
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Token Management
export const getToken = (): string | null => {
  return localStorage.getItem("taskflow_token");
};

// Common API Request Function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new ApiError(
        data?.message ||
          data?.error ||
          `Request failed (${response.status})`,
        response.status
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new Error(
      `Unable to connect to backend. Please check that Flask is running at ${BASE_URL}`
    );
  }
}

// Authentication APIs
export const authAPI = {
  register: async (userData: RegisterData) => {
    return apiRequest<{ message: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: async (loginData: LoginData) => {
    const response = await apiRequest<{
      message: string;
      access_token: string;
      user: User;
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    });

    localStorage.setItem("taskflow_token", response.access_token);
    localStorage.setItem("taskflow.user", JSON.stringify(response.user));

    return response;
  },

  logout: () => {
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow.user");
  },
};

// Task APIs
export const taskAPI = {
  getAll: async () => {
    const response = await apiRequest<{ tasks: Task[] }>("/api/tasks");
    return response.tasks;
  },

  create: async (taskData: TaskData) => {
    const response = await apiRequest<{
      message: string;
      task: Task;
    }>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    });

    return response.task;
  },

  update: async (id: number, taskData: Partial<TaskData>) => {
    return apiRequest<{ message: string }>(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(taskData),
    });
  },

  delete: async (id: number) => {
    return apiRequest<{ message: string }>(`/api/tasks/${id}`, {
      method: "DELETE",
    });
  },
};
