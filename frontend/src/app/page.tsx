"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    assignTodoToFolder,
    clearTodoFolder,
    createFolder,
    createTodo,
    getFolders,
    getTodos,
    type CreateTodoRequest,
    type Folder,
    type TodoResponse,
} from "@/lib/api";
import { groupTodosByFolder } from "@/lib/todoGroups";
import FolderForm from "@/components/FolderForm.client";
import TodoForm from "@/components/TodoForm";
import FolderCard from "@/components/FolderCard.client";
import TodoCard from "@/components/TodoCard.client";

export default function Home() {
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

    const { unassigned, byFolder } = useMemo(() => groupTodosByFolder(todos), [todos]);

    const refresh = async () => {
        await qc.invalidateQueries({ queryKey: ["folders"] });
        await qc.invalidateQueries({ queryKey: ["todos"] });
    };

    const createFolderMutation = useMutation<Folder, Error, { title: string }>({
        mutationFn: (payload) => createFolder(payload),
        onSuccess: refresh,
    });

    const createTodoMutation = useMutation<TodoResponse, Error, CreateTodoRequest>({
        mutationFn: (payload) => createTodo(payload),
        onSuccess: refresh,
    });

    const assignMutation = useMutation<TodoResponse, Error, { todoId: number; folderId: number }>({
        mutationFn: ({ todoId, folderId }) => assignTodoToFolder(todoId, folderId),
        onSuccess: refresh,
    });

    const clearMutation = useMutation<TodoResponse, Error, { todoId: number }>({
        mutationFn: ({ todoId }) => clearTodoFolder(todoId),
        onSuccess: refresh,
    });

    return (
        <div className="mx-auto max-w-6xl space-y-6 p-6">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Tablero</h1>
                <p className="text-slate-600">Crea tasks, arrástralos a un folder y ábrelos para ver sus tasks.</p>
            </header>

            <div className="grid gap-6 lg:grid-cols-2">
                <section className="space-y-4 rounded-xl border bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold">Folders</h2>
                        <span className="text-sm text-slate-500">{folders.length} en total</span>
                    </div>
                    <FolderForm
                        onCreate={async (title) => {
                            await createFolderMutation.mutateAsync({ title });
                        }}
                    />
                    <div className="grid gap-3">
                        {folders.map((folder) => (
                            <FolderCard
                                key={folder.id}
                                folder={folder}
                                href={`/folders/${folder.id}`}
                                count={byFolder.get(folder.id)?.length ?? 0}
                                onDropTodo={async (todoId, folderId) => {
                                    await assignMutation.mutateAsync({ todoId, folderId });
                                }}
                            />
                        ))}
                    </div>
                </section>

                <section className="space-y-4 rounded-xl border bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold">Nueva task</h2>
                    </div>
                    <TodoForm
                        onSubmit={async (payload) => {
                            await createTodoMutation.mutateAsync(payload);
                        }}
                    />
                    <div
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={async (event) => {
                            event.preventDefault();
                            const todoId = Number(event.dataTransfer.getData("text/plain"));
                            if (!Number.isFinite(todoId)) return;
                            await clearMutation.mutateAsync({ todoId });
                        }}
                        className="rounded-lg border border-dashed bg-white p-4"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="font-medium">Sin folder</h3>
                            <span className="text-sm text-slate-500">{unassigned.length} tasks</span>
                        </div>
                        <div className="mt-3 grid gap-3">
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
                    </div>
                </section>
            </div>

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Tasks por folder</h2>
                    <span className="text-sm text-slate-500">Arrastra una task a un folder para moverla.</span>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                    {folders.map((folder) => (
                        <div key={folder.id} className="rounded-xl border bg-white p-4">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <Link href={`/folders/${folder.id}`} className="font-semibold text-slate-900 hover:text-blue-700">
                                    {folder.title}
                                </Link>
                                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                                    {byFolder.get(folder.id)?.length ?? 0}
                                </span>
                            </div>
                            <div className="grid gap-3">
                                {(byFolder.get(folder.id) ?? []).map((todo) => (
                                    <TodoCard
                                        key={todo.id}
                                        todo={todo}
                                        onClearFolder={async (todoId) => {
                                            await clearMutation.mutateAsync({ todoId });
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
