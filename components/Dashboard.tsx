"use client";

import { useEffect, useState } from "react";
import { useSolanaPortfolio } from "@/hooks/useSolanaPortfolio";
import WalletInput from "@/components/WalletInput";
import TokenTable from "@/components/TokenTable";
import SettingsModal from "@/components/SettingsModal";
import { formatCurrency } from "@/utils/format";
import { RefreshCw, Settings, Wallet as WalletIcon } from "lucide-react";

export default function Dashboard() {
    const [wallets, setWallets] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false); // To avoid hydration mismatch with localStorage
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [customRpc, setCustomRpc] = useState('');

    // Load wallets and settings from local storage on mount
    useEffect(() => {
        const savedWallets = localStorage.getItem("solana-nexus-wallets");
        const savedRpc = localStorage.getItem("user_rpc_endpoint");

        if (savedWallets) {
            try {
                setWallets(JSON.parse(savedWallets));
            } catch (e) {
                console.error("Failed to parse wallets", e);
            }
        }

        if (savedRpc) {
            setCustomRpc(savedRpc);
        }

        setIsLoaded(true);
    }, []);

    // Save wallets when changed
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("solana-nexus-wallets", JSON.stringify(wallets));
        }
    }, [wallets, isLoaded]);

    const handleSaveRpc = (url: string) => {
        setCustomRpc(url);
        if (url) {
            localStorage.setItem("user_rpc_endpoint", url);
        } else {
            localStorage.removeItem("user_rpc_endpoint");
        }
        // Force reload or just let the hook re-run? 
        // Hook depends on wallets, not specifically RPC changing prop, but we can trigger a refresh via window or key.
        // For simplicity, we can reload the page to ensure clean connection state, or just let the user click refresh.
        // Let's rely on the user clicking refresh for now, or we can force a re-render.
        window.location.reload();
    };

    const { totalValueUsd, tokens, isLoading, error, refresh } = useSolanaPortfolio(wallets);

    const addWallet = (address: string) => {
        if (!wallets.includes(address)) {
            setWallets([...wallets, address]);
        }
    };

    const removeWallet = (address: string) => {
        setWallets(wallets.filter((w) => w !== address));
    };

    if (!isLoaded) return null; // Prevent hydration errors

    return (
        <div className="w-full flex flex-col gap-12">

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                currentRpc={customRpc}
                onSaveRpc={handleSaveRpc}
            />

            {/* Header / Nav Area */}
            <div className="absolute top-0 right-0 p-6 flex gap-4">
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-3 rounded-full bg-cyber-black/50 border border-cyber-grid text-cyber-gray hover:text-neon-blue hover:border-neon-blue transition-all"
                    title="Settings"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </div>

            {/* Hero Section: Total Balance */}
            <section className="relative w-full p-8 md:p-12 rounded-3xl overflow-hidden bg-cyber-dark border border-cyber-grid group hover:border-neon-blue/30 transition-all duration-500">
                <div className="absolute inset-0 bg-cyber-grid bg-[size:20px_20px] opacity-10" />
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-neon-blue/10 rounded-full blur-[100px]" />

                <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                    <span className="text-cyber-gray font-mono text-sm uppercase tracking-widest">Net Worth</span>
                    <div className="text-5xl md:text-7xl font-bold text-white tracking-tighter drop-shadow-2xl flex items-center gap-2">
                        <span className="text-neon-blue text-glow">
                            {formatCurrency(totalValueUsd)}
                        </span>
                    </div>
                    {isLoading && (
                        <div className="absolute top-4 right-4 animate-spin text-neon-blue">
                            <RefreshCw className="w-5 h-5" />
                        </div>
                    )}
                </div>
            </section>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
                    {error}
                </div>
            )}

            {/* Main Content Area */}
            <div className="grid gap-12 lg:grid-cols-[1fr_350px]">
                {/* Left: Token Table */}
                <div className="order-2 lg:order-1 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">Assets</h2>
                        <button
                            onClick={() => refresh()}
                            className="p-2 rounded-lg bg-cyber-grid text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                            title="Refresh Data"
                        >
                            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    <TokenTable tokens={tokens} isLoading={isLoading} />
                </div>

                {/* Right: Wallet Management */}
                <div className="order-1 lg:order-2">
                    <WalletInput
                        wallets={wallets}
                        onAddWallet={addWallet}
                        onRemoveWallet={removeWallet}
                    />
                </div>
            </div>
        </div>
    );
}
