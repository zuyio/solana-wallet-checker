import { useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

// Fallback RPC or using mainnet-beta public
const RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';

export interface TokenAsset {
    mint: string;
    symbol: string;
    name: string;
    balance: number;
    decimals: number;
    priceUsd: number;
    valueUsd: number;
    logoURI?: string;
}

export interface PortfolioData {
    totalValueUsd: number;
    tokens: TokenAsset[];
    isLoading: boolean;
    error: string | null;
}

// Mock prices for demo purposes (since we don't have a guaranteed free oracle key)
const PRICE_MAP: Record<string, number> = {
    'SOL': 145.50, // Mock SOL price
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 1.00, // USDC
    'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 1.00, // USDT
    'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': 0.000015, // BONK
    'JUPyiwrYJFskUPiHa7hkeR8VUtkqj20HMNtzP2F2z5v': 1.20, // JUP
};

const TOKEN_METADATA_MAP: Record<string, { symbol: string; name: string }> = {
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': { symbol: 'USDC', name: 'USD Coin' },
    'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': { symbol: 'USDT', name: 'Tether USD' },
    'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': { symbol: 'BONK', name: 'Bonk' },
    'JUPyiwrYJFskUPiHa7hkeR8VUtkqj20HMNtzP2F2z5v': { symbol: 'JUP', name: 'Jupiter' },
};

export const useSolanaPortfolio = (walletAddresses: string[]) => {
    const [data, setData] = useState<PortfolioData>({
        totalValueUsd: 0,
        tokens: [],
        isLoading: false,
        error: null,
    });

    const fetchPortfolio = useCallback(async () => {
        if (walletAddresses.length === 0) {
            setData({ totalValueUsd: 0, tokens: [], isLoading: false, error: null });
            return;
        }

        setData((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            const connection = new Connection(RPC_ENDPOINT, 'confirmed');
            const aggregatedTokens: Record<string, TokenAsset> = {};
            let totalSolBalance = 0;

            // 1. Initialize SOL asset
            aggregatedTokens['SOL'] = {
                mint: 'SOL',
                symbol: 'SOL',
                name: 'Solana',
                balance: 0,
                decimals: 9,
                priceUsd: PRICE_MAP['SOL'] || 0,
                valueUsd: 0,
            };

            await Promise.all(
                walletAddresses.map(async (address) => {
                    let pubKey: PublicKey;
                    try {
                        pubKey = new PublicKey(address);
                    } catch (e) {
                        console.error(`Invalid address: ${address}`);
                        return;
                    }

                    // Fetch SOL Balance
                    try {
                        const balance = await connection.getBalance(pubKey);
                        totalSolBalance += balance / LAMPORTS_PER_SOL;
                    } catch (e) {
                        console.error(`Failed to fetch SOL for ${address}`, e);
                    }

                    // Fetch SPL Tokens
                    try {
                        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubKey, {
                            programId: TOKEN_PROGRAM_ID,
                        });

                        tokenAccounts.value.forEach((account) => {
                            const info = account.account.data.parsed.info;
                            const mint = info.mint;
                            const tokenAmount = info.tokenAmount;
                            const uiAmount = tokenAmount.uiAmount || 0;

                            if (uiAmount > 0) {
                                if (!aggregatedTokens[mint]) {
                                    const meta = TOKEN_METADATA_MAP[mint] || { symbol: mint.slice(0, 4), name: 'Unknown Token' };
                                    aggregatedTokens[mint] = {
                                        mint,
                                        symbol: meta.symbol,
                                        name: meta.name,
                                        balance: 0,
                                        decimals: tokenAmount.decimals,
                                        priceUsd: PRICE_MAP[mint] || 0,
                                        valueUsd: 0,
                                    };
                                }
                                aggregatedTokens[mint].balance += uiAmount;
                            }
                        });
                    } catch (e) {
                        console.error(`Failed to fetch tokens for ${address}`, e);
                    }
                })
            );

            // Update SOL in aggregation
            aggregatedTokens['SOL'].balance = totalSolBalance;

            // Calculate totals
            const tokenList: TokenAsset[] = Object.values(aggregatedTokens).map((t) => {
                // Tiny randomizer for mock prices if 0, just to show UI populated (optional, disabled for now to be clean)
                const finalPrice = t.priceUsd;
                return {
                    ...t,
                    valueUsd: t.balance * finalPrice
                };
            });

            // Filter out dust (optional) or zero balances if any
            const activeTokens = tokenList.filter(t => t.balance > 0).sort((a, b) => b.valueUsd - a.valueUsd);

            const totalValue = activeTokens.reduce((acc, curr) => acc + curr.valueUsd, 0);

            setData({
                totalValueUsd: totalValue,
                tokens: activeTokens,
                isLoading: false,
                error: null,
            });

        } catch (err: any) {
            console.error("Portfolio fetch error:", err);
            setData((prev) => ({ ...prev, isLoading: false, error: "Failed to fetch portfolio data. RPC might be rate limited." }));
        }
    }, [walletAddresses]);

    useEffect(() => {
        fetchPortfolio();
    }, [fetchPortfolio]);

    return { ...data, refresh: fetchPortfolio };
};
