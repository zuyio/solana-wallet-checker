import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { Plus, Trash2, Wallet } from "lucide-react";

interface WalletInputProps {
    wallets: string[];
    onAddWallet: (address: string) => void;
    onRemoveWallet: (address: string) => void;
}

export default function WalletInput({
    wallets,
    onAddWallet,
    onRemoveWallet,
}: WalletInputProps) {
    const [input, setInput] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleAdd = () => {
        setError(null);
        if (!input.trim()) return;

        try {
            new PublicKey(input); // Validate address
            if (wallets.includes(input)) {
                setError("Wallet already added.");
                return;
            }
            onAddWallet(input);
            setInput("");
        } catch (e) {
            setError("Invalid Solana address.");
        }
    };

    return (
        <div className="w-full grid gap-8 md:grid-cols-[1fr_300px]">
            {/* Wallet List Sidebar (on desktop, or top on mobile) */}
            <div className="order-2 md:order-1 flex flex-col gap-4">
                <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Wallet className="w-5 h-5 text-neon-purple" />
                    Connected Wallets
                </h3>
                <div className="flex flex-col gap-2">
                    {wallets.length === 0 && (
                        <div className="p-4 border border-dashed border-gray-800 rounded-lg text-gray-600 text-sm italic">
                            No wallets connected. Add one to see your portfolio.
                        </div>
                    )}
                    {wallets.map((wallet) => (
                        <div key={wallet} className="flex items-center justify-between p-3 rounded-lg bg-cyber-gray border border-white/5 hover:border-white/10 transition-all group">
                            <span className="font-mono text-sm text-gray-400 truncate w-4/5 select-all">
                                {wallet}
                            </span>
                            <button
                                onClick={() => onRemoveWallet(wallet)}
                                className="text-gray-600 hover:text-red-500 transition-colors p-1"
                                title="Remove Wallet"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Wallet Form */}
            <div className="order-1 md:order-2 bg-cyber-dark/50 p-6 rounded-xl border border-cyber-grid md:sticky md:top-24 h-fit">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Add Wallet</h3>
                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste Solana Address..."
                        className="bg-black/40 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all placeholder:text-gray-700 font-mono"
                    />
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                    <button
                        onClick={handleAdd}
                        disabled={!input}
                        className="flex items-center justify-center gap-2 bg-white text-black font-bold py-3 rounded-lg hover:bg-neon-blue hover:text-black hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-4 h-4" />
                        Add to Portfolio
                    </button>
                </div>
            </div>
        </div>
    );
}
