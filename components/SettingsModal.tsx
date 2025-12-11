"use client";

import { useState, useEffect } from "react";
import { X, Save, Server } from "lucide-react";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentRpc: string;
    onSaveRpc: (url: string) => void;
}

export default function SettingsModal({ isOpen, onClose, currentRpc, onSaveRpc }: SettingsModalProps) {
    const [rpcInput, setRpcInput] = useState(currentRpc);

    useEffect(() => {
        setRpcInput(currentRpc);
    }, [currentRpc, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSaveRpc(rpcInput);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-cyber-black border border-cyber-grid rounded-2xl shadow-2xl overflow-hidden relative">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-cyber-grid bg-cyber-dark/50">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Server className="w-5 h-5 text-neon-blue" />
                        Settings
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Solana RPC Endpoint</label>
                        <p className="text-xs text-gray-500">
                            Provide a custom RPC URL (e.g. from Helius or Alchemy) to avoid rate limits and ensure faster data loading.
                        </p>
                        <input
                            type="text"
                            value={rpcInput}
                            onChange={(e) => setRpcInput(e.target.value)}
                            placeholder="https://mainnet.helius-rpc.com/?api-key=..."
                            className="w-full bg-black/50 border border-cyber-grid focus:border-neon-blue rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-all font-mono text-sm"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-cyber-grid bg-cyber-dark/30 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 rounded-lg bg-neon-blue/10 text-neon-blue border border-neon-blue/50 hover:bg-neon-blue hover:text-black transition-all text-sm font-bold flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
