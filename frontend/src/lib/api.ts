import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
    headers: { "Content-Type": "application/json" },
});

export type Folder = {
    id: number;
    title: string;
};


// Folders
export const getFolders = async (): Promise<Folder[]> =>
    (await api.get("/api/folders")).data as Folder[];

export const createFolder = async (payload: { title: string }): Promise<Folder> =>
    (await api.post("/api/folders", payload)).data as Folder;

export type TodoResponse = {
    id: number;
    title: string;
    description?: string;
    done: boolean;
    folderId?: number | null;
    folderTitle?: string | null;
};

// Todos
export type CreateTodoRequest = {
    title: string;
    description?: string;
    done?: boolean;
    folderId?: number;
};

export type UpdateTodoRequest = {
    title?: string;
    description?: string;
    done?: boolean;
    folderId?: number | null;
};

export const getTodos = async (folderId?: number): Promise<TodoResponse[]> => {
    const url = folderId ? `/api/todos?folderId=${folderId}` : `/api/todos`;
    return (await api.get(url)).data;
};

export const getTodo = async (id: number): Promise<TodoResponse> =>
    (await api.get(`/api/todos/${id}`)).data;

export const createTodo = async (payload: CreateTodoRequest) =>
    (await api.post("/api/todos", payload)).data;

export const updateTodo = async (id: number, payload: UpdateTodoRequest) =>
    (await api.put(`/api/todos/${id}`, payload)).data;

export const deleteTodo = async (id: number) =>
    (await api.delete(`/api/todos/${id}`)).status;