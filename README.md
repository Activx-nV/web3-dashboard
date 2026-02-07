# Web3 Dashboard

A little **Web3** frontend learning project. Connect your wallet and explore balances, networks, message signing (unsafe verification on FE), and transaction history in one dashboard.

https://web3-dashboard-bice.vercel.app/

## Implemented features

- **Connect wallet** - RainbowKit connect button; supports MetaMask and other injected wallets.
- **Wallet info** - Shows connected address (short + copy), ENS name & avatar when available, and a “View on Explorer” link for the current chain.
- **Balance** - Current network balance plus balances on Ethereum Mainnet, Arbitrum Sepolia, and Sepolia (with optional USD conversion via CoinGecko).
- **Network switcher** - Switch between Mainnet, Sepolia, and Arbitrum Sepolia.
- **Transaction history** - Fetches and displays recent transactions for the connected address on the current chain (Etherscan API), with amount in ETH and USD.
- **Sign message** - Sign an arbitrary message with your wallet, copy the signature, and verify it client-side using the recovered address. Not suitable for full-fledged apps (should use BE verification like SIWE)

Tech: **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **RainbowKit**, **Wagmi**, **Viem**.

---

## What I learned (wagmi & viem)

### Wagmi

- **`useAccount`** — `address`, `chain`, `isConnected`, `isConnecting` for connection state and current chain.
- **`useBalance`** — Read native balance for an `address`, optionally scoped by `chainId`; use `refetch` to refresh and `isLoading` for UI.
- **`useEnsName` / `useEnsAvatar`** — Resolve ENS name and avatar for an address (e.g. on mainnet).
- **`useSignMessage`** — Trigger wallet signing with `signMessage({ message })`; handle `data` (signature), `isPending`, `isError`, and `reset`.
- **`useChainId` / `useChains` / `useSwitchChain`** — Get current chain id, list of configured chains, and switch network with `switchChain({ chainId })`.

### Viem

- **`formatEther`** — Convert `bigint` wei to a decimal string for display (balances, tx values).
- **`parseUnits`** — Convert human-readable numbers to blockchain integers (wei). Takes a string and decimals, returns `BigInt`. Used when sending values to contracts.
- **`formatUnits`** — Convert blockchain integers back to human-readable strings. Takes a `BigInt` and decimals, returns a decimal string for display.
- **`verifyMessage`** — Verify a signed message: `verifyMessage({ address, message, signature })` returns whether the signature matches the address.
- **`normalize`** (from `viem/ens`) — Normalize ENS names before passing to `useEnsAvatar` or other ENS APIs.
- **Working with `bigint`** — Parsing API values (e.g. `tx.value`) with `BigInt()` before passing to `formatEther`.

---

## Run locally

```bash
npm install
# Set up your VITE_PROJECT_ID (RainbowKit) and optionally VITE_ETHERSCAN_API_KEY keys in a .env file
npm run dev
```

## Env vars

| Variable                 | Description                                                                                           |
| ------------------------ | ----------------------------------------------------------------------------------------------------- |
| `VITE_PROJECT_ID`        | [WalletConnect Cloud](https://cloud.walletconnect.com) project ID (for RainbowKit).                   |
| `VITE_ETHERSCAN_API_KEY` | [Etherscan API](https://docs.etherscan.io/getting-an-api-key) for transaction history (rate-limited). |

---
