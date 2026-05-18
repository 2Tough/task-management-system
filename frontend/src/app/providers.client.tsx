// app/providers.client.tsx
"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClient as defaultClient } from "@/lib/queryClient";

export default function Providers({ children }: { children: ReactNode }) {
    // si prefieres crear un QueryClient por request, hazlo aquí; uso uno compartido
    const [qc] = useState<QueryClient>(() => defaultClient);
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}