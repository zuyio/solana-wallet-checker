# Solana Nexus - Multi-Wallet Portfolio Aggregator

A futuristic dashboard to track the net worth of multiple Solana wallets in real-time. Built with Next.js 14, Tailwind CSS, and standard Solana RPC integration.

## 🚀 Features

- **Multi-Wallet Sorting**: Add as many Solana public keys as you want.
- **Aggregated View**: Automatically sums up SOL and SPL token balances across all wallets.
- **Real-Time Data**: Fetches live on-chain data using `@solana/web3.js`.
- **Cyberpunk UI**: A premium, responsive dark mode design with neon aesthetics.
- **Persistence**: Remembers your wallets between sessions (stored locally).

## 🛠️ Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + "Cyberpunk" preset
- **Blockchain**: @solana/web3.js, @solana/spl-token
- **Icons**: Lucide React

## 📦 Installation

Since this project was generated manually, you need to install standard dependencies:

1.  **Install Node.js**: Ensure you have Node.js 18+ installed.
2.  **Install Dependencies**:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

## 🏃‍♂️ Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📝 Configuration

### Endpoint
By default, the app uses `https://api.mainnet-beta.solana.com`.
If you encounter rate limits (HTTP 429), standard public RPCs might be busy.

**Recommended:** Get a free RPC URL from [Helius](https://helius.xyz) or [Alchemy](https://alchemy.com) and update `hooks/useSolanaPortfolio.ts`:

```typescript
const RPC_ENDPOINT = 'Your_Helius_RPC_Url';
```

### Price Feeds
Currently, the app uses **mock prices** for demonstration (SOL, USDC, BONK) to ensure the UI works without needing external API keys that might break.
In a production environment, you would swap the mock map in `hooks/useSolanaPortfolio.ts` with a call to the Jupiter Price API or CoinGecko.

## 🧪 Verification

To verify the app is working:
1. Run `npm run dev`.
2. Paste a valid Solana Wallet Address (e.g., `86xCnPeV69n6t3DnyGvkLobRo7cpWYQsuLPyiTK8qtv3`).
3. Click "Add to Portfolio".
4. See the balances populate and the total net worth update.

