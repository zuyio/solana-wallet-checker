import { TokenAsset } from "@/hooks/useSolanaPortfolio";
import { formatCurrency, formatNumber } from "@/utils/format";
import { Coins, AlertCircle } from "lucide-react";

interface TokenTableProps {
    tokens: TokenAsset[];
    isLoading: boolean;
}

export default function TokenTable({ tokens, isLoading }: TokenTableProps) {
    if (isLoading && tokens.length === 0) {
        return (
            <div className="w-full h-64 flex items-center justify-center border border-cyber-grid rounded-xl bg-cyber-dark/50 backdrop-blur-sm animate-pulse">
                <p className="text-neon-blue">Scanning Blockchain...</p>
            </div>
        );
    }

    if (tokens.length === 0) {
        return (
            <div className="w-full p-8 text-center border border-cyber-grid rounded-xl bg-cyber-dark/30 text-cyber-gray">
                <Coins className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No assets found. Add a wallet to get started.</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden border border-cyber-gray/30 rounded-xl bg-cyber-dark/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-cyber-black text-cyber-gray uppercase tracking-wider text-xs border-b border-cyber-grid">
                        <tr>
                            <th className="px-6 py-4 font-medium">Asset</th>
                            <th className="px-6 py-4 font-medium text-right">Price</th>
                            <th className="px-6 py-4 font-medium text-right">Balance</th>
                            <th className="px-6 py-4 font-medium text-right">Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-cyber-grid">
                        {tokens.map((token) => (
                            <tr key={token.mint} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center border border-white/10 group-hover:border-neon-blue/50 transition-colors">
                                            {token.symbol[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-200 group-hover:text-neon-blue transition-colors">{token.symbol}</div>
                                            <div className="text-xs text-gray-500">{token.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-gray-400">
                                    {formatCurrency(token.priceUsd)}
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-gray-300">
                                    {formatNumber(token.balance)}
                                </td>
                                <td className="px-6 py-4 text-right font-mono font-bold text-neon-green text-glow">
                                    {formatCurrency(token.valueUsd)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
