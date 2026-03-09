import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatWindow from "@/components/ChatWindow";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ASP.NET Core Architecture Hub",
    description: "Learn about Routing, Binding, and Validation",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
                <ChatWindow />
            </body>
        </html>
    );
}
