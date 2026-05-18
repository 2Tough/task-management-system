// app/layout.tsx
import "@/app/globals.css";
import Providers from "./providers.client";

export const metadata = {
    title: "Todo App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
        <body>
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}