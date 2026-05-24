"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    assignTodoToFolder,
    clearTodoFolder,
    createTodo,
    getFolders,
    getTodos,
    type CreateTodoRequest,
    type Folder,
    type TodoResponse,
} from "@/lib/api";
import { groupTodosByFolder } from "@/lib/todoGroups";
import TodoForm from "@/components/TodoForm";
import TodoCard from "@/components/TodoCard.client";

type Props = {
    folderId: number;
};

export default function FolderDetail({ folderId }: Props) {
    const router = useRouter();
    const qc = useQueryClient();

    const foldersQuery = useQuery<Folder[], Error, Folder[], ["folders"]>({
        queryKey: ["folders"],
        queryFn: getFolders,
    });
    const todosQuery = useQuery<TodoResponse[], Error, TodoResponse[], ["todos"]>({
        queryKey: ["todos"],
        queryFn: () => getTodos(),
    });

    const folders = useMemo(() => foldersQuery.data ?? [], [foldersQuery.data]);
    const todos = useMemo(() => todosQuery.data ?? [], [todosQuery.data]);
    const folder = folders.find((item) => item.id === folderId);
    const { unassigned, byFolder } = useMemo(() => groupTodosByFolder(todos), [todos]);
    const folderTodos = byFolder.get(folderId) ?? [];

    const refresh = async () => {
        await qc.invalidateQueries({ queryKey: ["folders"] });
        await qc.invalidateQueries({ queryKey: ["todos"] });
    };

    const createTodoMutation = useMutation<TodoResponse, Error, CreateTodoRequest>({
        mutationFn: (payload) => createTodo(payload),
        onSuccess: refresh,
    });

    const assignMutation = useMutation<TodoResponse, Error, { todoId: number }>({
        mutationFn: ({ todoId }) => assignTodoToFolder(todoId, folderId),
        onSuccess: refresh,
    });

    const clearMutation = useMutation<TodoResponse, Error, { todoId: number }>({
        mutationFn: ({ todoId }) => clearTodoFolder(todoId),
        onSuccess: refresh,
    });

    if (foldersQuery.isLoading || todosQuery.isLoading) {
        return <p className="p-6">Cargando...</p>;
    }

    if (!folder) {
        return (
            <div className="p-6">
                <p className="text-slate-600">Folder no encontrado.</p>
                <Link href="/" className="mt-3 inline-block text-blue-600 hover:text-blue-700">
                    Volver
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6 p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <button type="button" onClick={() => router.back()} className="text-sm text-blue-600 hover:text-blue-700">
                        ← Volver
                    </button>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">{folder.title}</h1>
                    <p className="text-slate-600">{folderTodos.length} tasks en este folder</p>
                </div>
                <Link href="/" className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50">
                    Ver tablero
                </Link>
            </div>

            <section className="rounded-xl border bg-slate-50 p-4">
                <h2 className="text-lg font-semibold">Nueva task en este folder</h2>
                <div className="mt-3">
                    <TodoForm
                        initial={{ folderId }}
                        submitLabel="Crear en folder"
                        onSubmit={async (payload) => {
                            await createTodoMutation.mutateAsync(payload);
                        }}
                    />
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
                <section
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={async (event) => {
                        event.preventDefault();
                        const todoId = Number(event.dataTransfer.getData("text/plain"));
                        if (!Number.isFinite(todoId)) return;
                        await assignMutation.mutateAsync({ todoId });
                    }}
                    className="rounded-xl border bg-white p-4"
                >
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold">Tasks del folder</h2>
                        <span className="text-sm text-slate-500">Suelta aquí para mover tasks</span>
                    </div>
                    <div className="mt-4 grid gap-3">
                        {folderTodos.map((todo) => (
                            <TodoCard
                                key={todo.id}
                                todo={todo}
                                onClearFolder={async (todoId) => {
                                    await clearMutation.mutateAsync({ todoId });
                                }}
                            />
                        ))}
                    </div>
                </section>

                <section
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={async (event) => {
                        event.preventDefault();
                        const todoId = Number(event.dataTransfer.getData("text/plain"));
                        if (!Number.isFinite(todoId)) return;
                        await clearMutation.mutateAsync({ todoId });
                    }}
                    className="rounded-xl border border-dashed bg-slate-50 p-4"
                >
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold">Tasks sin folder</h2>
                        <span className="text-sm text-slate-500">{unassigned.length} tasks</span>
                    </div>
                    <div className="mt-4 grid gap-3">
                        {unassigned.map((todo) => (
                            <TodoCard
                                key={todo.id}
                                todo={todo}
                                onClearFolder={async (todoId) => {
                                    await clearMutation.mutateAsync({ todoId });
                                }}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
