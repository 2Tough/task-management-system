"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFolder, getFolders, type Folder } from "@/lib/api";
import FolderForm from "@/components/FolderForm.client";

export default function Home() {
    const qc = useQueryClient();

    // useQuery en v5: pasar un objeto { queryKey, queryFn }
    // Genéricos: <TQueryFnData, TError, TData, TQueryKey>
    // Aquí: TQueryFnData = Folder[], TError = Error, TData = Folder[], TQueryKey = ["folders"]
    const query = useQuery<Folder[], Error, Folder[], ["folders"]>({
        queryKey: ["folders"],
        queryFn: getFolders,
    });

    // ahora data puede ser Folder[] | undefined
    const data = query.data;
    const isLoading = query.isLoading;

    // safe fallback para que .map esté sobre un array conocido
    const folders: Folder[] = (data ?? []) as Folder[];

    const createMutation = useMutation<Folder, Error, { title: string }>({
        mutationFn: (payload) => createFolder(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["folders"] }),
    });

    const handleCreate = async (title: string) => {
        await createMutation.mutateAsync({ title });
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Carpetas</h1>

            <div className="mb-4">
                <FolderForm onCreate={handleCreate} />
            </div>

            {isLoading ? (
                <p>Cargando...</p>
            ) : (
                <ul className="space-y-2">
                    {folders.map((f) => (
                        <li key={f.id} className="p-3 bg-white rounded shadow flex justify-between items-center">
                            <Link href={`/folders/${f.id}`} className="font-medium">
                                {f.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}