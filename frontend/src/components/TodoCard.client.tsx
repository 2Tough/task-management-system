"use client";

import type { TodoResponse } from "@/lib/api";

type Props = {
    todo: TodoResponse;
    onClearFolder: (todoId: number) => Promise<void>;
};

export default function TodoCard({ todo, onClearFolder }: Props) {
    return (
        <article
            draggable
            onDragStart={(event) => {
                event.dataTransfer.setData("text/plain", String(todo.id));
                event.dataTransfer.effectAllowed = "move";
            }}
            className="rounded-lg border bg-white p-3 shadow-sm"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="font-medium text-slate-900">{todo.title}</h3>
                    {todo.description ? <p className="mt-1 text-sm text-slate-600">{todo.description}</p> : null}
                </div>

                {todo.folderTitle ? (
                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                        {todo.folderTitle}
                    </span>
                ) : null}
            </div>

            {todo.folderId ? (
                <button
                    type="button"
                    onClick={() => onClearFolder(todo.id)}
                    className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    Sacar del folder
                </button>
            ) : null}
        </article>
    );
}
