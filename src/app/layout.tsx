import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Shader Practice",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="flex justify-center items-center w-full h-screen">
                {children}
            </body>
        </html>
    );
}
