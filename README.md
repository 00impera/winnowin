# 🔐 WINNOWIN — Vault Game on Monad Mainnet

<div align="center">

**A 4-digit vault cracking game on Monad Mainnet.**  
Buy a key · Spin the wheel · Crack the code · Win the pool.

[![Live App](https://img.shields.io/badge/🌐_Live_App-Play_Now-00ff88?style=for-the-badge)](https://winnowin.pages.dev/)
[![Monad Mainnet](https://img.shields.io/badge/Chain-Monad_Mainnet_143-836ef9?style=for-the-badge)](https://monad.xyz)
[![Contract](https://img.shields.io/badge/Contract-Verified-00c8ff?style=for-the-badge)](https://monadscan.com/address/0x9d5aD64997C26ca505f11fDE71789eb3c664EE60)
[![Twitter](https://img.shields.io/badge/Twitter-@bnbgold277983-1da1f2?style=for-the-badge&logo=x)](https://x.com/bnbgold277983)

</div>

---

## 🎮 What is WINNOWIN?

WINNOWIN is an on-chain vault cracking game deployed on **Monad Mainnet**. Players buy a key to enter a vault, spin the wheel for luck, then try to guess the secret 4-digit code. Crack the vault → win the entire pool of MON + receive a **Winner NFT**.

---

## 🏆 The 4 Vaults

<div align="center">

| 🥉 BRONZE | 🥈 SILVER | 🥇 GOLD | 💎 PLATINUM |
|:---------:|:---------:|:-------:|:-----------:|
| <img src="https://raw.githubusercontent.com/00impera/winnowin/b01f15ef4c94f40439e554c14712b4878669f624/SEIF_1.png" width="150" alt="Bronze Vault"/> | <img src="https://raw.githubusercontent.com/00impera/winnowin/b01f15ef4c94f40439e554c14712b4878669f624/SEIF_2.png" width="150" alt="Silver Vault"/> | <img src="https://raw.githubusercontent.com/00impera/winnowin/b01f15ef4c94f40439e554c14712b4878669f624/SEIF_3.png" width="150" alt="Gold Vault"/> | <img src="https://raw.githubusercontent.com/00impera/winnowin/b01f15ef4c94f40439e554c14712b4878669f624/SEIF_4.png" width="150" alt="Platinum Vault"/> |
| **100 MON** | **500 MON** | **1,000 MON** | **10,000 MON** |
| 4 attempts · Vault 1 | 4 attempts · Vault 2 | 4 attempts · Vault 3 | 4 attempts · Vault 4 |

</div>

---

## 🕹️ How to Play

### Step 1 — Connect Wallet
- Install **MetaMask** (or any EVM wallet)
- Switch to **Monad Mainnet** · Chain ID: `143`
- RPC: `https://rpc.monad.xyz`

### Step 2 — Get MON
- Buy with credit/debit card via **Thirdweb Pay**
- Or bridge ETH, BTC, SOL, USDC and more via **NEAR Intents**

### Step 3 — Choose Your Key
Pick a vault tier based on your budget:
- Each key purchase adds to that vault's prize pool
- The pool grows until someone cracks the code

### Step 4 — Spin the Wheel
- Hit **Spin** for a lucky start
- The wheel animation sets the mood — and your mindset 🎯

### Step 5 — Enter the 4-Digit Code
- Click each dial to cycle digits 0–9
- Build your 4-digit guess
- You have **4 attempts** per key purchase

### Step 6 — Win!
- If you guess correctly → the **entire vault pool** is sent to your wallet
- You also receive a **Winner NFT** minted to your address
- The vault resets for the next round

---

## 🆕 New Features — 00impera Update

### 🔄 ConnectButton Integration
- Replaced legacy `ConnectWalletBtn` with **ConnectButton** from `thirdweb/react`
- Supports MetaMask, WalletConnect, Coinbase, embedded wallets
- Auto-detects installed EVM wallets and handles network switching

### 💳 Buy MON with Card
- **BuyWidget** from Thirdweb — buy MON directly with a credit or debit card
- Available in the header modal and inside each vault's buy step

### ⬡ NEAR Intents Bridge
- Swap ETH, BTC, SOL, USDC, USDT, NEAR, BNB → MON from any chain
- Live quote system with deposit address generation
- Powered by `1click.chaindefuser.com`

### 📦 React + Vite Frontend
- Migrated to **React JSX** + **Vite** for faster builds and hot reload
- `main.jsx` handles React root rendering with `ReactDOM.createRoot`
- `vite.config.js` optimized for Cloudflare Pages deployment

### 🌧️ Rain Canvas Animation
- Animated rain background using HTML5 Canvas
- Blue/cyan streaks with blur and brightness effects

### 🌐 Custom Domain via CNAME
- CNAME configured for `winnowin.pages.dev`
- Auto-deploy on push via Cloudflare Pages pipeline

---

## 📄 Smart Contract

| Field | Value |
|-------|-------|
| **Network** | Monad Mainnet |
| **Chain ID** | `143` |
| **Contract Address** | `0x9d5aD64997C26ca505f11fDE71789eb3c664EE60` |
| **Token Standard** | ERC-721 (Winner NFT) |
| **Verified** | ✅ Sourcify |

### Key Functions

```solidity
// Buy a key and enter a vault session
function buyKey(uint256 vaultId, uint8 keyType) payable

// Submit a code guess (4 attempts max)
function tryUnlock(uint256 code, bytes32 salt) external

// Read vault state
function getVault(uint256 vaultId) view returns (...)

// Read all pool balances
function getAllPools() view returns (uint256, uint256, uint256, uint256)

// Read player session
function getSession(address player) view returns (...)
```

---

## 🌐 Links

| | |
|---|---|
| 🎮 **Play** | [winnowin.pages.dev](https://winnowin.pages.dev/) |
| 🔍 **Monadscan** | [Contract on Monadscan](https://monadscan.com/address/0x9d5aD64997C26ca505f11fDE71789eb3c664EE60) |
| 👁️ **MonadVision** | [Portfolio Info](https://monadvision.com/address/0x9d5aD64997C26ca505f11fDE71789eb3c664EE60?portofolio=info) |
| 🐦 **Twitter** | [@bnbgold277983](https://x.com/bnbgold277983) |
| 💬 **Discord** | [Join Server](https://discord.com/channels/1316093079090106472) |
| ✈️ **Telegram Bot** | [t.me/eurocoin_monad_bot](https://t.me/eurocoin_monad_bot) |

---

## 🛠️ Tech Stack

- **Blockchain:** Monad Mainnet (EVM-compatible, Chain ID 143)
- **Smart Contract:** Solidity ^0.8.24 · OpenZeppelin ERC-721
- **Frontend:** React + Vite · Thirdweb SDK · ethers.js v6
- **On-ramp:** Thirdweb Pay (BuyWidget)
- **Bridge:** NEAR Intents (1click.chaindefuser.com)
- **Hosting:** Cloudflare Pages
- **Verification:** Sourcify

---

## ⚠️ Disclaimer

WINNOWIN is a game of skill and chance deployed on a public blockchain. Play responsibly. All transactions are irreversible. The contract code is open source and verified on-chain.

---

<div align="center">

**WINNOWIN · MONAD MAINNET · 2026**  
`0x9d5aD64997C26ca505f11fDE71789eb3c664EE60`

[![Twitter](https://img.shields.io/badge/Twitter-@bnbgold277983-1da1f2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/bnbgold277983)
[![Discord](https://img.shields.io/badge/Discord-Join%20Server-5865f2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/channels/1316093079090106472)
[![Telegram](https://img.shields.io/badge/Telegram-Bot-29b6f6?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/eurocoin_monad_bot)
[![MonadVision](https://img.shields.io/badge/Explorer-MonadVision-00ff88?style=for-the-badge)](https://monadvision.com/token/0x9d5aD64997C26ca505f11fDE71789eb3c664EE60)

</div>
