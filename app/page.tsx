import Dashboard from "@/components/Dashboard";

export default function Home() {
    return (
        <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex flex-col gap-12">
            <header className="flex flex-col items-center gap-4 text-center">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent text-glow p-2">
                    SOLANA NEXUS
                </h1>
                <p className="text-cyber-gray text-lg max-w-md mx-auto">
                    Multi-Wallet Portfolio Aggregator
                </p>
            </header>

            <Dashboard />

            <footer className="mt-20 text-center text-xs text-cyber-gray opacity-50">
                <p>Built for the Solana Network</p>
            </footer>
        </div>
    );
}
