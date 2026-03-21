# 🔐 WINNOWIN — Vault Game on Monad Mainnet

<div align="center">

![WINNOWIN](https://eurocoin.imperamonad.xyz/logo.png)

### *Crack the code. Win the pool. Claim your NFT.*

[![Monad](https://img.shields.io/badge/Network-Monad%20Mainnet-00ff88?style=for-the-badge&logo=ethereum&logoColor=black)](https://monad.xyz)
[![Chain ID](https://img.shields.io/badge/Chain%20ID-143-00c8ff?style=for-the-badge)](https://monad.xyz)
[![License](https://img.shields.io/badge/License-MIT-c9a84c?style=for-the-badge)](LICENSE)
[![Twitter](https://img.shields.io/badge/Twitter-@bnbgold277983-1da1f2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/bnbgold277983)
[![Discord](https://img.shields.io/badge/Discord-Join-5865f2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/channels/1316093079090106472)

**[🌐 Live Site](https://winnowin.imperamonad.xyz)** · **[📜 Contract](https://monadvision.com/token/0x9d5aD64997C26ca505f11fDE71789eb3c664EE60)** · **[✈️ Telegram](https://t.me/eurocoin_monad_bot)**

</div>

---

## 🎮 What is WINNOWIN?

**WINNOWIN** is a fully on-chain vault game deployed on **Monad Mainnet**. Players buy keys to attempt cracking a 4-digit vault combination. Every failed attempt adds to the prize pool — the winner takes everything.

> 4 Vaults · 4 Keys · 4 Attempts · 1 Winner

---

## 🗝️ How To Play

| Step | Action |
|------|--------|
| **1** | Connect your MetaMask wallet on Monad Mainnet (Chain ID: 143) |
| **2** | Choose a Key — Bronze, Silver, Gold or Platinum |
| **3** | Pay the entry fee — MON is added to the vault pool |
| **4** | Spin the wheel to get started |
| **5** | Enter your 4-digit combination — you have 4 attempts |
| **6** | Crack the code → receive the **entire vault pool** + **Winner NFT** |

### 🔑 Key Types

| Key | Price | Vault | Attempts |
|-----|-------|-------|----------|
| 🥉 Bronze Key | 100 MON | Vault 1 | 4 |
| 🥈 Silver Key | 500 MON | Vault 2 | 4 |
| 🥇 Gold Key | 1,000 MON | Vault 3 | 4 |
| 💎 Platinum Key | 10,000 MON | Vault 4 | 4 |

> Every key purchase adds MON to the corresponding vault pool. The pool grows with every player. The winner takes it all.

---

## 📜 Contract Addresses

| Contract | Address |
|----------|---------|
| **WINNOWIN** | [`0x9d5aD64997C26ca505f11fDE71789eb3c664EE60`](https://monadvision.com/token/0x9d5aD64997C26ca505f11fDE71789eb3c664EE60) |
| **WMON** | `0x2cE8C8F4961a54B2e87585f4178467006B76B418` |
| **V2Router02** | `0x9269678eAf155eC5bC5f9d089897c889A60C362b` |
| **V2Factory** | `0x1D05f7Fe52A37f41D3B512b4135057bF3EadEf57` |

### Vault Prize Pools (Live)

| Vault | Key | Pool |
|-------|-----|------|
| 🔐 Vault 1 — Bronze | 100 MON | Live on-chain |
| 🔐 Vault 2 — Silver | 500 MON | Live on-chain |
| 🔐 Vault 3 — Gold | 1,000 MON | Live on-chain |
| 🔐 Vault 4 — Platinum | 10,000 MON | Live on-chain |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Blockchain** | Monad Mainnet (Chain ID 143) |
| **Smart Contract** | Solidity 0.8.24 |
| **Framework** | Foundry |
| **Standards** | ERC-721 (Winner NFT) |
| **Libraries** | OpenZeppelin Contracts |
| **Metadata** | Base64 encoded on-chain |
| **Frontend** | HTML · CSS · JavaScript |
| **Web3** | ethers.js v6 |
| **Hosting** | GitHub Pages |
| **DNS** | Porkbun + Cloudflare |

### Smart Contract Features
- ✅ **ReentrancyGuard** — protected against reentrancy attacks
- ✅ **Ownable** — owner-controlled vault codes
- ✅ **On-chain metadata** — Base64 encoded NFT metadata
- ✅ **4 independent vaults** — each with own prize pool
- ✅ **Hashed codes** — keccak256(code + salt) verification
- ✅ **Winner NFT** — minted automatically on vault unlock

---

## 🚀 Deploy

```bash
# Clone repo
git clone https://github.com/00impera/winnowin-website.git
cd winnowin-website

# Deploy contract (Foundry)
cd winnowin
forge build
forge create src/WINNOWIN.sol:WINNOWIN \
  --rpc-url https://rpc.monad.xyz \
  --private-key YOUR_PRIVATE_KEY \
  --broadcast

# Verify contract
forge verify-contract \
  --rpc-url https://rpc.monad.xyz \
  --verifier sourcify \
  --verifier-url 'https://sourcify-api-monad.blockvision.org/' \
  --chain-id 143 \
  CONTRACT_ADDRESS \
  src/WINNOWIN.sol:WINNOWIN
```

---

## 🌐 Social Links

<div align="center">

[![Twitter](https://img.shields.io/badge/Twitter-@bnbgold277983-1da1f2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/bnbgold277983)
[![Discord](https://img.shields.io/badge/Discord-Join%20Server-5865f2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/channels/1316093079090106472)
[![Telegram](https://img.shields.io/badge/Telegram-Bot-29b6f6?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/eurocoin_monad_bot)
[![MonadVision](https://img.shields.io/badge/Explorer-MonadVision-00ff88?style=for-the-badge)](https://monadvision.com/token/0x9d5aD64997C26ca505f11fDE71789eb3c664EE60)

### 🔗 Related Projects

| Project | Site | Contract |
|---------|------|----------|
| 💶 Euro Coin | [eurocoin.imperamonad.xyz](https://eurocoin.imperamonad.xyz) | `0x28b5cc805D90213D2699CC3B00e28e3f0fbeCA8e` |
| 💎 GemsRock NFT | [gemscoin.imperamonad.xyz](https://gemscoin.imperamonad.xyz) | `0x49931887171BF46922b2b80Aa834537A80C50B70` |
| 🔐 WINNOWIN | [winnowin.imperamonad.xyz](https://winnowin.imperamonad.xyz) | `0x9d5aD64997C26ca505f11fDE71789eb3c664EE60` |

</div>

---

## 📄 License

MIT © 2026 [IMPERIAL INTERNATIONAL](https://imperamonad.xyz) · Built on [Monad Mainnet](https://monad.xyz)
