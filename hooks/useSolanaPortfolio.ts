import { useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getJupiterTokenList, getJupiterPrices, JupiterToken } from '../utils/jupiter';

// Default public RPC (rate limited often)
const DEFAULT_RPC = 'https://api.mainnet-beta.solana.com';

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
            // Determine RPC endpoint
            const customRpc = localStorage.getItem('user_rpc_endpoint');
            const connection = new Connection(customRpc || DEFAULT_RPC, 'confirmed');

            const aggregatedTokens: Record<string, TokenAsset> = {};
            let totalSolBalance = 0;

            // Fetch Token List from Jupiter (cached)
            const tokenMap = await getJupiterTokenList();

            // 1. Initialize SOL asset
            // Check Jupiter for SOL price ID (Wrapped SOL mint usually used for pricing: So11111111111111111111111111111111111111112)
            const WRAPPED_SOL_MINT = 'So11111111111111111111111111111111111111112';

            aggregatedTokens[WRAPPED_SOL_MINT] = {
                mint: 'SOL', // Display purpose
                symbol: 'SOL',
                name: 'Solana',
                balance: 0,
                decimals: 9,
                priceUsd: 0,
                valueUsd: 0,
                logoURI: tokenMap[WRAPPED_SOL_MINT]?.logoURI || 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
            };

            const allMintsToFetchPrice = new Set<string>();
            allMintsToFetchPrice.add(WRAPPED_SOL_MINT);

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
                                    const meta = tokenMap[mint] || {
                                        symbol: mint.slice(0, 4) + '...',
                                        name: 'Unknown Token',
                                        logoURI: undefined
                                    };

                                    aggregatedTokens[mint] = {
                                        mint,
                                        symbol: meta.symbol,
                                        name: meta.name,
                                        balance: 0,
                                        decimals: tokenAmount.decimals,
                                        priceUsd: 0,
                                        valueUsd: 0,
                                        logoURI: meta.logoURI,
                                    };
                                }
                                aggregatedTokens[mint].balance += uiAmount;
                                allMintsToFetchPrice.add(mint);
                            }
                        });
                    } catch (e) {
                        console.error(`Failed to fetch tokens for ${address}`, e);
                    }
                })
            );

            // Update SOL balance in the aggregation
            if (aggregatedTokens[WRAPPED_SOL_MINT]) {
                aggregatedTokens[WRAPPED_SOL_MINT].balance = totalSolBalance;
            }

            // Fetch Prices from Jupiter
            const priceMap = await getJupiterPrices(Array.from(allMintsToFetchPrice));

            // Calculate totals
            const tokenList: TokenAsset[] = Object.values(aggregatedTokens).map((t) => {
                // Use the mint (or Wrapped SOL mint for SOL) to find price
                const lookupMint = t.symbol === 'SOL' ? WRAPPED_SOL_MINT : t.mint;
                const price = priceMap[lookupMint] || 0;

                return {
                    ...t,
                    priceUsd: price,
                    valueUsd: t.balance * price
                };
            });

            // Filter out zero value assets if desired, or just sort
            const activeTokens = tokenList
                .filter(t => t.balance > 0)
                .sort((a, b) => b.valueUsd - a.valueUsd);

            const totalValue = activeTokens.reduce((acc, curr) => acc + curr.valueUsd, 0);

            setData({
                totalValueUsd: totalValue,
                tokens: activeTokens,
                isLoading: false,
                error: null,
            });

        } catch (err: any) {
            console.error("Portfolio fetch error:", err);
            setData((prev) => ({
                ...prev,
                isLoading: false,
                error: "Failed to fetch portfolio data. Check your connection or RPC endpoint."
            }));
        }
    }, [walletAddresses]);

    useEffect(() => {
        fetchPortfolio();
    }, [fetchPortfolio]);

    return { ...data, refresh: fetchPortfolio };
};
