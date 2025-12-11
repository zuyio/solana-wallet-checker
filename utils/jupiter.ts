import { TokenAsset } from "@/hooks/useSolanaPortfolio";

// Jupiter Token List API (Strict list for better safety/relevance)
const JUP_TOKEN_LIST_URL = 'https://token.jup.ag/strict';

// Jupiter Price API v2
const JUP_PRICE_API_URL = 'https://api.jup.ag/price/v2';

export interface JupiterToken {
    address: string;
    chainId: number;
    decimals: number;
    name: string;
    symbol: string;
    logoURI: string;
    tags: string[];
}

export interface JupiterPriceResponse {
    data: Record<string, {
        id: string;
        type: string;
        price: string; // Price is string in v2
    }>;
    timeTaken: number;
}

// Cache the token list in memory to avoid refetching on every render
let cachedTokenList: Record<string, JupiterToken> | null = null;

export async function getJupiterTokenList(): Promise<Record<string, JupiterToken>> {
    if (cachedTokenList) return cachedTokenList;

    try {
        const response = await fetch(JUP_TOKEN_LIST_URL);
        if (!response.ok) throw new Error('Failed to fetch token list');

        const tokens: JupiterToken[] = await response.json();

        // Transform into a map for O(1) lookups by mint address
        const tokenMap: Record<string, JupiterToken> = {};
        tokens.forEach(t => {
            tokenMap[t.address] = t;
        });

        cachedTokenList = tokenMap;
        return tokenMap;
    } catch (error) {
        console.error("Jupiter Token List Error:", error);
        return {};
    }
}

export async function getJupiterPrices(mints: string[]): Promise<Record<string, number>> {
    if (mints.length === 0) return {};

    try {
        // Jupiter v2 supports up to 100 ids per request usually, but let's just do one batch for now
        // If user has > 100 tokens, might need chunking, but rare for average user
        const ids = mints.join(',');
        const response = await fetch(`${JUP_PRICE_API_URL}?ids=${ids}`);

        if (!response.ok) return {};

        const json: JupiterPriceResponse = await response.json();

        const prices: Record<string, number> = {};

        if (json.data) {
            Object.values(json.data).forEach(p => {
                if (p && p.price) {
                    prices[p.id] = parseFloat(p.price);
                }
            });
        }

        return prices;
    } catch (error) {
        console.error("Jupiter Price API Error:", error);
        return {};
    }
}
