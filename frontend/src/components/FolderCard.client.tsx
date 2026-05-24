"use client";

import Link from "next/link";
import type { Folder } from "@/lib/api";

type Props = {
    folder: Folder;
    count: number;
    href: string;
    onDropTodo: (todoId: number, folderId: number) => Promise<void>;
    active?: boolean;
};

export default function FolderCard({ folder, count, href, onDropTodo, active = false }: Props) {
    return (
        <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={async (event) => {
                event.preventDefault();
                const todoId = Number(event.dataTransfer.getData("text/plain"));
                if (!Number.isFinite(todoId)) return;
                await onDropTodo(todoId, folder.id);
            }}
            className={`rounded-lg border p-4 shadow-sm transition ${
                active ? "border-blue-500 bg-blue-50" : "bg-white"
            }`}
        >
            <div className="flex items-center justify-between gap-3">
                <Link href={href} className="font-medium text-slate-900 hover:text-blue-700">
                    {folder.title}
                </Link>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{count}</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">Suelta un task aquí para moverlo a este folder.</p>
        </div>
    );
}
