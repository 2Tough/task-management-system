"use client";

import React, { useState } from "react";

type Props = {
    onCreate: (title: string) => Promise<void>;
};

export default function FolderFormClient({ onCreate }: Props) {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                const t = title.trim();
                if (!t) return;
                setLoading(true);
                try {
                    await onCreate(t);
                    setTitle("");
                } finally {
                    setLoading(false);
                }
            }}
            className="flex gap-2"
        >
            <input
                className="border px-2 py-1 rounded flex-1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nueva carpeta"
            />
            <button className="bg-blue-600 text-white px-4 py-1 rounded" disabled={loading}>
                {loading ? "..." : "Crear"}
            </button>
        </form>
    );
}