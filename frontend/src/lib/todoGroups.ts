import type { TodoResponse } from "@/lib/api";

export const groupTodosByFolder = (todos: TodoResponse[]) => {
    const unassigned = todos.filter((todo) => !todo.folderId);
    const byFolder = new Map<number, TodoResponse[]>();

    for (const todo of todos) {
        if (!todo.folderId) continue;
        const list = byFolder.get(todo.folderId) ?? [];
        list.push(todo);
        byFolder.set(todo.folderId, list);
    }

    return { unassigned, byFolder };
};
