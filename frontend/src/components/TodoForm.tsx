import React, { useState } from "react";
import { CreateTodoRequest } from "@/lib/api";

type Props = {
    initial?: Partial<CreateTodoRequest>;
    onSubmit: (payload: CreateTodoRequest) => Promise<void>;
    submitLabel?: string;
};

export default function TodoForm({ initial, onSubmit, submitLabel = "Guardar" }: Props) {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [done, setDone] = useState(initial?.done ?? false);

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                if (!title.trim()) return;
                await onSubmit({
                    title: title.trim(),
                    description: description.trim(),
                    done,
                    folderId: initial?.folderId,
                });
                setTitle("");
                setDescription("");
                setDone(false);
            }}
            className="space-y-2"
        >
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título"
                className="w-full border rounded px-2 py-1"
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción (opcional)"
                className="w-full border rounded px-2 py-1"
            />
            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} />
                    Hecho
                </label>
                <button className="bg-green-600 text-white px-4 py-1 rounded">{submitLabel}</button>
            </div>
        </form>
    );
}