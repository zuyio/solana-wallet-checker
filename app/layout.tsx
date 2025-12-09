import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export const metadata: Metadata = {
    title: "Solana Nexus | Portfolio Aggregator",
    description: "Multi-wallet Solana portfolio tracker with cyberpunk aesthetics.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased bg-cyber-black text-gray-100 min-h-screen selection:bg-neon-blue selection:text-black`}>
                <div className="fixed inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-20 pointer-events-none -z-10" />
                <div className="fixed inset-0 bg-gradient-to-tr from-cyber-black via-transparent to-cyber-black/80 pointer-events-none -z-10" />
                <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 relative z-0">
                    {children}
                </main>
            </body>
        </html>
    );
}
