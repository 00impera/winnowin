# 🔐 WINNOWIN — Vault Game on Monad Mainnet

<div align="center">

![WINNOWIN](https://raw.githubusercontent.com/00impera/winnowin/master/SEIF_1.png)

**A 4-digit vault cracking game on Monad Mainnet.**  
Buy a key · Spin the wheel · Crack the code · Win the pool.

[![Live App](https://img.shields.io/badge/🌐_Live_App-Play_Now-00ff88?style=for-the-badge)](https://pickkeywinbox1234.nelutz2you.workers.dev/)
[![Monad Mainnet](https://img.shields.io/badge/Chain-Monad_Mainnet_143-836ef9?style=for-the-badge)](https://monad.xyz)
[![Contract](https://img.shields.io/badge/Contract-Verified-00c8ff?style=for-the-badge)](https://explorer.monad.xyz/address/0x9d5aD64997C26ca505f11fDE71789eb3c664EE60)
[![Twitter](https://img.shields.io/badge/Twitter-@bnbgold277983-1da1f2?style=for-the-badge&logo=x)](https://x.com/bnbgold277983)

</div>

---

## 🎮 What is WINNOWIN?

WINNOWIN is an on-chain vault cracking game deployed on **Monad Mainnet**. Players buy a key to enter a vault, spin the wheel for luck, then try to guess the secret 4-digit code. Crack the vault → win the entire pool of MON + receive a **Winner NFT**.

---

## 🏆 The 4 Vaults

| Vault | Key Price | Attempts | Pool Grows With |
|-------|-----------|----------|-----------------|
| 🥉 **BRONZE** | 100 MON | 4 | Every bronze key purchase |
| 🥈 **SILVER** | 500 MON | 4 | Every silver key purchase |
| 🥇 **GOLD** | 1,000 MON | 4 | Every gold key purchase |
| 💎 **PLATINUM** | 10,000 MON | 4 | Every platinum key purchase |

<div align="center">
<img src="https://raw.githubusercontent.com/00impera/winnowin/master/SEIF_2.png" width="45%"/>
<img src="https://raw.githubusercontent.com/00impera/winnowin/master/SEIF_3.png" width="45%"/>
</div>

---

## 🕹️ How to Play

### Step 1 — Connect Wallet
- Install **MetaMask** (or any EVM wallet)
- Switch to **Monad Mainnet** · Chain ID: `143`
- RPC: `https://rpc.monad.xyz`

### Step 2 — Choose Your Key
Pick a vault tier based on your budget:
- Each key purchase adds to that vault's prize pool
- The pool grows until someone cracks the code

### Step 3 — Spin the Wheel
- Hit **Spin** for a lucky start
- The wheel animation sets the mood — and your mindset 🎯

### Step 4 — Enter the 4-Digit Code
- Click each dial to cycle digits 0–9
- Build your 4-digit guess
- You have **4 attempts** per key purchase

### Step 5 — Win!
- If you guess correctly → the **entire vault pool** is sent to your wallet
- You also receive a **Winner NFT** minted to your address
- The vault resets for the next round

<div align="center">
<img src="https://raw.githubusercontent.com/00impera/winnowin/master/SEIF_4.png" width="60%"/>
</div>

---

## 📄 Smart Contract

| Field | Value |
|-------|-------|
| **Network** | Monad Mainnet |
| **Chain ID** | 143 |
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
| 🎮 **Play** | [pickkeywinbox1234.nelutz2you.workers.dev](https://pickkeywinbox1234.nelutz2you.workers.dev/) |
| 🔍 **Explorer** | [explorer.monad.xyz — Contract](https://explorer.monad.xyz/address/0x9d5aD64997C26ca505f11fDE71789eb3c664EE60) |
| 🐦 **Twitter** | [@bnbgold277983](https://x.com/bnbgold277983) |
| 💬 **Discord** | [Join Server](https://discord.com/channels/1316093079090106472) |
| ✈️ **Telegram Bot** | [t.me/eurocoin_monad_bot](https://t.me/eurocoin_monad_bot) |

---

## 🛠️ Tech Stack

- **Blockchain:** Monad Mainnet (EVM-compatible, Chain ID 143)
- **Smart Contract:** Solidity ^0.8.24 · OpenZeppelin ERC-721
- **Frontend:** Vanilla HTML/CSS/JS · ethers.js v6
- **Hosting:** Cloudflare Workers
- **Verification:** Sourcify

---

## ⚠️ Disclaimer

WINNOWIN is a game of skill and chance deployed on a public blockchain. Play responsibly. All transactions are irreversible. The contract code is open source and verified on-chain.

---

<div align="center">

**WINNOWIN · MONAD MAINNET · 2026**  
`0x9d5aD64997C26ca505f11fDE71789eb3c664EE60`

## 🌐 Social Links

[![Twitter](https://img.shields.io/badge/Twitter-@bnbgold277983-1da1f2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/bnbgold277983)

[![Discord](https://img.shields.io/badge/Discord-Join%20Server-5865f2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/channels/1316093079090106472)

[![Telegram](https://img.shields.io/badge/Telegram-Bot-29b6f6?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/eurocoin_monad_bot)

[![MonadVision](https://img.shields.io/badge/Explorer-MonadVision-00ff88?style=for-the-badge)](https://monadvision.com/token/0x9d5aD64997C26ca505f11fDE71789eb3c664EE60)

</div>
