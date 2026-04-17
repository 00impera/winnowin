import { useState, useEffect, useRef } from "react";
import {
  ThirdwebProvider,
  useActiveAccount,
  useActiveWalletChain,
  BuyWidget,
  useConnect,
} from "thirdweb/react";
import {
  createThirdwebClient,
  defineChain,
  getContract,
  prepareContractCall,
  readContract,
} from "thirdweb";
import { createWallet } from "thirdweb/wallets";
import { useSendTransaction } from "thirdweb/react";
import { parseEther, formatEther } from "ethers/utils";

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const CLIENT_ID = "821819db832d1a313ae3b1a62fbeafb7";
const NEAR_JWT  =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjIwMjUtMDEtMTItdjEifQ.eyJ2IjoxLCJrZXlfdHlwZSI6ImRpc3RyaWJ1dGlvbl9jaGFubmVsIiwicGFydG5lcl9pZCI6ImNyeXB0b2Nhc2gtbmZ0IiwiaWF0IjoxNzczMDc3MzExLCJleHAiOjE4MDQ2MTMzMTF9.Wi55S8cwVmAXPtOG0ymr7ldX-5CXVygzuanbjAAJHP-Am14_52C6i4cQG5FvjcAorw0KD8k8JD_YX5AM4QKhNqYtU5gsI4-KKe0KavO5_69NowzUKc_ubtjYn85eFjWskzZQvICMqSZkdGOSnMT_hNEePA8qYi_wSov4a4bQh4zIfNA0znEdDIV3rGI_bDM9dgOk0PnJRIpwi_aXOQ8Q4e50IO2UMrZEDtBVmUhK5-Mno3S_iS7tZl4QSui_4_bNCapQolFwUPB9Zqyxay_6rPVEr7j-8Ez5-htwkR5ZYvTb1mJaj3DVPpWPL9QTxhjvhbJ7nKrWpibcWX3AVoXZ6g";

const client = createThirdwebClient({ clientId: CLIENT_ID });

const MONAD_MAINNET = defineChain({
  id: 143,
  name: "Monad",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpc: "https://rpc.monad.xyz",
  blockExplorers: [{ name: "Monadscan", url: "https://monadscan.com" }],
});

const CONTRACT_ADDRESS = "0x9d5aD64997C26ca505f11fDE71789eb3c664EE60";

const CONTRACT_ABI = [
  {
    name: "buyKey",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "vaultId", type: "uint256" },
      { name: "keyType", type: "uint8" },
    ],
    outputs: [],
  },
  {
    name: "tryUnlock",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "code", type: "uint256" },
      { name: "salt", type: "bytes32" },
    ],
    outputs: [],
  },
  {
    name: "getAllPools",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
    ],
  },
  {
    name: "getVault",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "", type: "string" },
      { name: "", type: "uint256" },
      { name: "", type: "bool" },
      { name: "", type: "address" },
      { name: "", type: "uint8" },
    ],
  },
  {
    name: "getSession",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
      { name: "", type: "bool" },
    ],
  },
];

// ─── VAULT DATA ───────────────────────────────────────────────────────────────
const KEYS = [
  {
    name: "BRONZE VAULT",
    price: "100",
    keyType: 0,
    vaultId: 1,
    tier: "bronze",
    icon: "🗝️",
    img: "https://raw.githubusercontent.com/00impera/winnowin/b01f15ef4c94f40439e554c14712b4878669f624/SEIF_1.png",
  },
  {
    name: "SILVER VAULT",
    price: "500",
    keyType: 1,
    vaultId: 2,
    tier: "silver",
    icon: "🔑",
    img: "https://raw.githubusercontent.com/00impera/winnowin/b01f15ef4c94f40439e554c14712b4878669f624/SEIF_2.png",
  },
  {
    name: "GOLD VAULT",
    price: "1000",
    keyType: 2,
    vaultId: 3,
    tier: "gold",
    icon: "🏆",
    img: "https://raw.githubusercontent.com/00impera/winnowin/b01f15ef4c94f40439e554c14712b4878669f624/SEIF_3.png",
  },
  {
    name: "PLATINUM VAULT",
    price: "10000",
    keyType: 3,
    vaultId: 4,
    tier: "platinum",
    icon: "💎",
    img: "https://raw.githubusercontent.com/00impera/winnowin/b01f15ef4c94f40439e554c14712b4878669f624/SEIF_4.png",
  },
];

const SALTS = [
  "0x638d6b1aa06cc1b6fd530d63742db65ffa17631395150b129df19362aa2ac153",
  "0x30065d0d393544cf6d22f1aa29cd73ef6699c0831ca7520748d4e236e071ea6d",
  "0xa58e71b2fabf210084348f0bd740d102e352350df954b713167ca966a949cd4c",
  "0xffdf9bdc91801e779aea4ecbebae257cc4d100003a6bad35aed3303b47a5c89b",
];

// ─── NEAR INTENTS API ─────────────────────────────────────────────────────────

async function getNearIntentsTokens() {
  const res = await fetch("https://1click.chaindefuser.com/v0/tokens", {
    headers: { Authorization: "Bearer " + NEAR_JWT },
  });
  return res.json();
}

async function getNearIntentsQuote({ originAsset, destinationAsset, amount, recipient }) {
  const deadline = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const res = await fetch("https://1click.chaindefuser.com/v0/quote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + NEAR_JWT,
    },
    body: JSON.stringify({
      dry: false,
      swapType: "EXACT_INPUT",
      slippageTolerance: 100,
      originAsset,
      depositType: "ORIGIN_CHAIN",
      destinationAsset,
      amount,
      recipient,
      recipientType: "DESTINATION_CHAIN",
      refundTo: recipient,
      refundType: "ORIGIN_CHAIN",
      deadline,
    }),
  });
  return res.json();
}

// ─── CONNECT WALLET BUTTON ────────────────────────────────────────────────────

function ConnectWalletBtn({ label = "Connect Wallet", className = "btn btn-blue", style = {} }) {
  const { connect, isConnecting } = useConnect();

  function handleConnect() {
    connect(async () => {
      const wallet = createWallet("io.metamask");
      await wallet.connect({ client, chain: MONAD_MAINNET });
      return wallet;
    });
  }

  return (
    <button
      className={className}
      onClick={handleConnect}
      disabled={isConnecting}
      style={{
        width: "auto",
        padding: "7px 16px",
        fontSize: 10,
        letterSpacing: "1.5px",
        fontFamily: "'Share Tech Mono', monospace",
        borderRadius: 20,
        fontWeight: 700,
        ...style,
      }}
    >
      {isConnecting ? "CONNECTING…" : label}
    </button>
  );
}

// ─── ROOT EXPORT ──────────────────────────────────────────────────────────────

export default function WinnowinPage() {
  return (
    <ThirdwebProvider>
      <WinnowinApp />
    </ThirdwebProvider>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

function WinnowinApp() {
  const account     = useActiveAccount();
  const activeChain = useActiveWalletChain();

  const [modalOpen,   setModalOpen]   = useState(false);
  const [selectedKey, setSelectedKey] = useState(0);
  const [pools,       setPools]       = useState(["—", "—", "—", "—"]);
  const [bridgeOpen,  setBridgeOpen]  = useState(false);

  useEffect(() => {
    fetchPools();
    const id = setInterval(fetchPools, 20_000);
    return () => clearInterval(id);
  }, []);

  async function fetchPools() {
    try {
      const contract = getContract({
        client,
        chain: MONAD_MAINNET,
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
      });
      const result = await readContract({ contract, method: "getAllPools", params: [] });
      const fmt = (v) =>
        parseFloat(formatEther(v)).toLocaleString(undefined, { maximumFractionDigits: 2 });
      setPools([fmt(result[0]), fmt(result[1]), fmt(result[2]), fmt(result[3])]);
    } catch (e) {
      console.warn("Pool fetch:", e.message);
    }
  }

  function openVault(idx) {
    setSelectedKey(idx);
    setModalOpen(true);
  }

  const isWrongChain = account && activeChain?.id !== 143;

  return (
    <>
      <style>{STYLES}</style>
      <RainCanvas />

      <div className="app">
        {/* HEADER */}
        <header className="header">
          <div className="brand">
            <span className="brand-title">WINNOWIN</span>
            <span className="brand-sub">Vault Game · Monad Mainnet</span>
          </div>
          <div className="header-right">
            <button
              className="bridge-header-btn"
              onClick={() => setBridgeOpen(true)}
              title="Bridge & Buy MON"
            >
              ⬡ GET MON
            </button>
            <div className="chain-badge">
              <span className="pulse-dot" />
              MONAD · 143
            </div>
            {account ? (
              <div className="wallet-connected-badge">
                <span className="pulse-dot green" />
                {account.address.slice(0, 6)}…{account.address.slice(-4)}
              </div>
            ) : (
              <ConnectWalletBtn label="Connect Wallet" />
            )}
          </div>
        </header>

        {isWrongChain && (
          <div className="wrong-chain-banner">
            ⚠️ Wrong network — please switch to Monad Mainnet (Chain ID 143)
          </div>
        )}

        {/* HERO */}
        <section className="hero">
          <h1 className="hero-title">WINNOWIN</h1>
          <p className="hero-sub">Vault Game · Monad Mainnet</p>
          <div className="hero-divider" />
        </section>

        {/* CONTRACT BAR */}
        <div className="contract-bar">
          <span className="label">CONTRACT</span>
          <code>{CONTRACT_ADDRESS}</code>
          <button className="copy-btn" onClick={() => copyText(CONTRACT_ADDRESS)}>COPY</button>
        </div>

        {/* KEY CARDS */}
        <div className="section-title">◈ Choose Your Key</div>
        <div className="keys-grid">
          {KEYS.map((key, idx) => (
            <KeyCard key={key.name} data={key} pool={pools[idx]} onClick={() => openVault(idx)} />
          ))}
        </div>

        {/* VAULT CARDS */}
        <div className="section-title">◈ Live Vaults</div>
        <div className="vaults-grid">
          {KEYS.map((key, idx) => (
            <VaultCard key={key.name} data={key} pool={pools[idx]} onClick={() => openVault(idx)} />
          ))}
        </div>

        <HowToPlay />

        <footer className="footer">
          <div className="footer-links">
            <a href="https://monadscan.com/address/0x9d5aD64997C26ca505f11fDE71789eb3c664EE60" target="_blank" rel="noopener noreferrer" className="footer-link fl-monad">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#00c8ff" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="4" fill="#00c8ff" opacity="0.3" />
                <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="#00c8ff" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              MONADSCAN
            </a>
            <a href="https://monadvision.com/address/0x9d5aD64997C26ca505f11fDE71789eb3c664EE60?portofolio=info" target="_blank" rel="noopener noreferrer" className="footer-link fl-vision">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M2 12C2 12 6 5 12 5s10 7 10 7-4 7-10 7S2 12 2 12z" stroke="#00ff88" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="3" fill="#00ff88" opacity="0.4" />
              </svg>
              MONADVSN
            </a>
            <a href="https://dashboard.blockvision.org/pricing" target="_blank" rel="noopener noreferrer" className="footer-link fl-block">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="8" height="8" rx="2" stroke="#c9a84c" strokeWidth="1.8" />
                <rect x="13" y="3" width="8" height="8" rx="2" stroke="#c9a84c" strokeWidth="1.8" />
                <rect x="3" y="13" width="8" height="8" rx="2" stroke="#c9a84c" strokeWidth="1.8" />
                <rect x="13" y="13" width="8" height="8" rx="2" stroke="#c9a84c" strokeWidth="1.5" strokeDasharray="2 2" />
              </svg>
              BLOCKVISION
            </a>
            <a href="https://twitter.com/bnbgold277983" target="_blank" rel="noopener noreferrer" className="footer-link fl-tw">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#80b8d0">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              TWITTER
            </a>
            <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer" className="footer-link fl-dc">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#9b84ec">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.036.055a19.99 19.99 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.201 13.201 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              DISCORD
            </a>
          </div>
          <div className="footer-copy">
            WINNOWIN · MONAD MAINNET · 2026 · {CONTRACT_ADDRESS}
          </div>
        </footer>
      </div>

      {/* VAULT MODAL */}
      {modalOpen && (
        <VaultModal
          keyIdx={selectedKey}
          account={account}
          onClose={() => setModalOpen(false)}
          onSuccess={fetchPools}
        />
      )}

      {/* BRIDGE / BUY MON MODAL */}
      {bridgeOpen && (
        <BridgeModal
          account={account}
          onClose={() => setBridgeOpen(false)}
        />
      )}
    </>
  );
}

// ─── KEY CARD ─────────────────────────────────────────────────────────────────

function KeyCard({ data, pool, onClick }) {
  return (
    <div className={`key-card ${data.tier}`} onClick={onClick}>
      <div className="key-img-wrap">
        <img src={data.img} alt={data.name} className="key-vault-img" onError={(e) => { e.target.style.display = "none"; }} />
      </div>
      <div className="key-name">{data.name}</div>
      <div className="key-price">{Number(data.price).toLocaleString()} MON</div>
      <div className="key-turns">4 ATTEMPTS · VAULT {data.vaultId}</div>
      <div className="key-pool">Pool: <span>{pool}</span> MON</div>
    </div>
  );
}

// ─── VAULT CARD ───────────────────────────────────────────────────────────────

function VaultCard({ data, pool, onClick }) {
  return (
    <div className={`vault-card ${data.tier}-v`} onClick={onClick}>
      <div className="vault-thumb">
        <img
          src={data.img}
          alt={data.name}
          className="vault-img"
          onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
        />
        <div className="vault-img-fallback">
          <span className="vault-icon-big">{data.icon}</span>
        </div>
      </div>
      <div className="vault-info">
        <div className="vault-name">{data.name}</div>
        <div className="vault-pool-live">{pool}</div>
        <div className="vault-pool-label">MON IN POOL</div>
        <div className="vault-status locked">🔒 LOCKED</div>
      </div>
    </div>
  );
}

// ─── BRIDGE MODAL ─────────────────────────────────────────────────────────────

function BridgeModal({ account, onClose }) {
  const [tab,         setTab]        = useState("card");
  const [swapTokens,  setSwapTokens] = useState([]);
  const [swapOrigin,  setSwapOrigin] = useState("");
  const [swapAmount,  setSwapAmount] = useState("");
  const [swapQuote,   setSwapQuote]  = useState(null);
  const [swapLoading, setSwapLoading]= useState(false);
  const [swapError,   setSwapError]  = useState(null);

  useEffect(() => {
    getNearIntentsTokens()
      .then((tokens) => {
        setSwapTokens(
          tokens.filter((t) =>
            ["eth", "btc", "sol", "usdc", "usdt", "near", "bnb"].some((s) =>
              t.symbol && t.symbol.toLowerCase().includes(s)
            )
          )
        );
      })
      .catch(() => {});
  }, []);

  async function handleGetQuote() {
    if (!swapOrigin || !swapAmount || !account) return;
    setSwapLoading(true);
    setSwapError(null);
    setSwapQuote(null);
    try {
      const destAsset   = "nep141:wrap.near";
      const originToken = swapTokens.find((t) => t.assetId === swapOrigin);
      const decimals    = originToken?.decimals ?? 18;
      const amountRaw   = (
        BigInt(Math.round(parseFloat(swapAmount) * Math.pow(10, decimals)))
      ).toString();
      const quote = await getNearIntentsQuote({
        originAsset: swapOrigin,
        destinationAsset: destAsset,
        amount: amountRaw,
        recipient: account.address,
      });
      setSwapQuote(quote);
    } catch {
      setSwapError("Could not fetch quote. Try a different token or amount.");
    }
    setSwapLoading(false);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal bridge-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-title" style={{ marginBottom: 18 }}>
          ◈ GET MON TO PLAY
        </div>

        {/* TAB ROW */}
        <div className="bridge-tabs">
          <button
            className={`bridge-tab ${tab === "card" ? "active" : ""}`}
            onClick={() => setTab("card")}
          >
            💳 BUY WITH CARD
          </button>
          <button
            className={`bridge-tab ${tab === "bridge" ? "active" : ""}`}
            onClick={() => setTab("bridge")}
          >
            ⬡ NEAR BRIDGE
          </button>
        </div>

        {/* ── BUY WITH CARD TAB ── */}
        {tab === "card" && (
          <div className="bridge-tab-content">
            {!account ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ color: "var(--text)", fontSize: 12, marginBottom: 16 }}>
                  Connect your wallet first to buy MON with a credit or debit card.
                </p>
                <ConnectWalletBtn label="Connect Wallet" />
              </div>
            ) : (
              <>
                <p className="bridge-desc">
                  Buy MON directly with a credit or debit card via Thirdweb Pay. Funds arrive in your wallet ready to play.
                </p>
                <div className="buy-widget-wrap">
                  <BuyWidget
                    client={client}
                    chain={MONAD_MAINNET}
                    theme="dark"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* ── NEAR BRIDGE TAB ── */}
        {tab === "bridge" && (
          <div className="bridge-tab-content">
            {!account ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ color: "var(--text)", fontSize: 12, marginBottom: 16 }}>
                  Connect your wallet to bridge tokens from any chain to MON.
                </p>
                <ConnectWalletBtn label="Connect Wallet" />
              </div>
            ) : (
              <>
                <p className="bridge-desc">
                  Powered by <strong style={{ color: "var(--blue)" }}>NEAR Intents</strong> — swap ETH, BTC, SOL, USDC and more into MON from any chain.
                </p>

                <div className="bridge-field">
                  <label>FROM TOKEN</label>
                  <select
                    value={swapOrigin}
                    onChange={(e) => { setSwapOrigin(e.target.value); setSwapQuote(null); }}
                  >
                    <option value="">Select token…</option>
                    {swapTokens.map((t) => (
                      <option key={t.assetId} value={t.assetId}>
                        {t.symbol}{t.blockchain ? " · " + t.blockchain.toUpperCase() : ""}{t.price ? " ($" + Number(t.price).toFixed(2) + ")" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bridge-field">
                  <label>AMOUNT</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={swapAmount}
                    onChange={(e) => { setSwapAmount(e.target.value); setSwapQuote(null); }}
                  />
                </div>

                <button
                  className="btn btn-blue"
                  onClick={handleGetQuote}
                  disabled={!swapOrigin || !swapAmount || swapLoading}
                >
                  {swapLoading ? "FETCHING QUOTE…" : "◈ GET BRIDGE QUOTE"}
                </button>

                {swapError && (
                  <div className="status-box error" style={{ marginTop: 12 }}>{swapError}</div>
                )}

                {swapQuote && !swapError && (
                  <div className="bridge-quote-box">
                    <div className="bq-row">
                      <span>You Send</span>
                      <span>
                        {swapAmount}{" "}
                        {swapTokens.find((t) => t.assetId === swapOrigin)?.symbol ?? ""}
                      </span>
                    </div>
                    <div className="bq-row">
                      <span>You Receive (est.)</span>
                      <span>{swapQuote.amountOutFormatted ?? "—"} MON</span>
                    </div>
                    <div className="bq-row">
                      <span>Deadline</span>
                      <span>
                        {swapQuote.deadline
                          ? new Date(swapQuote.deadline).toLocaleTimeString()
                          : "10 min"}
                      </span>
                    </div>
                    {swapQuote.depositAddress && (
                      <div className="bridge-deposit-box">
                        <div style={{ color: "var(--blue)", marginBottom: 6, fontSize: 9, letterSpacing: 2 }}>
                          DEPOSIT ADDRESS:
                        </div>
                        <code style={{ fontSize: 11, color: "var(--gold)", wordBreak: "break-all" }}>
                          {swapQuote.depositAddress}
                        </code>
                        <div style={{ marginTop: 8, color: "var(--text)", fontSize: 10, lineHeight: 1.6 }}>
                          Send your tokens to this address. NEAR Intents will complete the bridge and deliver MON to your wallet.
                        </div>
                        <button
                          className="copy-btn"
                          style={{ marginTop: 10, width: "100%", padding: "7px 0" }}
                          onClick={() => copyText(swapQuote.depositAddress)}
                        >
                          COPY ADDRESS
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── VAULT MODAL ──────────────────────────────────────────────────────────────

function VaultModal({ keyIdx, account, onClose, onSuccess }) {
  const key = KEYS[keyIdx];

  const [step,        setStep]       = useState("buy");
  const [spinning,    setSpinning]   = useState(false);
  const [spinDeg,     setSpinDeg]    = useState(0);
  const [dialValues,  setDialValues] = useState([0, 0, 0, 0]);
  const [turnsLeft,   setTurnsLeft]  = useState(4);
  const [statusMsg,   setStatusMsg]  = useState(null);
  const [showBuyCard, setShowBuyCard]= useState(false);

  const { mutate: sendTx, isPending } = useSendTransaction();

  const contract = getContract({
    client,
    chain: MONAD_MAINNET,
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  async function handleBuyKey() {
    if (!account) { setStatusMsg({ text: "Connect your wallet first!", type: "error" }); return; }
    setStatusMsg({ text: "Sending transaction…", type: "info" });
    try {
      const tx = prepareContractCall({
        contract,
        method: "buyKey",
        params: [BigInt(key.vaultId), key.keyType],
        value: parseEther(key.price),
      });
      sendTx(tx, {
        onSuccess: () => {
          setStatusMsg({ text: "✅ Key purchased! Spin the wheel!", type: "success" });
          setTimeout(() => { setStep("spin"); setStatusMsg(null); }, 1200);
        },
        onError: (e) =>
          setStatusMsg({ text: "❌ " + (e.reason || e.message || "Failed").slice(0, 80), type: "error" }),
      });
    } catch (e) {
      setStatusMsg({ text: "❌ " + e.message.slice(0, 80), type: "error" });
    }
  }

  function handleSpin() {
    if (spinning) return;
    setSpinning(true);
    const newDeg = spinDeg + 1440 + Math.floor(Math.random() * 720);
    setSpinDeg(newDeg);
    setStatusMsg({ text: "🌀 Spinning…", type: "info" });
    setTimeout(() => {
      setSpinning(false);
      setStatusMsg({ text: "✅ Done! Enter your 4-digit code.", type: "success" });
      setTimeout(() => { setStep("guess"); setStatusMsg(null); }, 1200);
    }, 4200);
  }

  function incDial(i) {
    setDialValues((prev) => {
      const next = [...prev];
      next[i] = (next[i] + 1) % 10;
      return next;
    });
  }

  async function handleTryCode() {
    if (!account) { setStatusMsg({ text: "Connect wallet first!", type: "error" }); return; }
    const code = dialValues[0] * 1000 + dialValues[1] * 100 + dialValues[2] * 10 + dialValues[3];
    const salt = SALTS[keyIdx];
    setStatusMsg({ text: `Trying code ${String(code).padStart(4, "0")}…`, type: "info" });
    try {
      const tx = prepareContractCall({
        contract,
        method: "tryUnlock",
        params: [BigInt(code), salt],
      });
      sendTx(tx, {
        onSuccess: async () => {
          try {
            const vaultData = await readContract({ contract, method: "getVault", params: [BigInt(key.vaultId)] });
            if (vaultData[2]) { setStep("done"); onSuccess(); return; }
            const session = await readContract({ contract, method: "getSession", params: [account.address] });
            const turns = Number(session[1]);
            setTurnsLeft(turns);
            if (turns === 0) setStep("failed");
            else setStatusMsg({ text: `❌ Wrong — ${turns} attempt${turns !== 1 ? "s" : ""} left.`, type: "error" });
          } catch {
            setStatusMsg({ text: "Code sent. Check your wallet!", type: "info" });
          }
        },
        onError: (e) =>
          setStatusMsg({ text: "❌ " + (e.reason || e.message || "Failed").slice(0, 80), type: "error" }),
      });
    } catch (e) {
      setStatusMsg({ text: "❌ " + e.message.slice(0, 80), type: "error" });
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-vault-img-wrap">
          <img
            src={key.img}
            alt={key.name}
            className="modal-vault-img"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>

        <div className="modal-title">◈ {key.name}</div>

        {/* ── BUY STEP ── */}
        {step === "buy" && (
          <div className="step-section">
            <p className="step-desc">
              Buy a <strong>{key.name.split(" ")[0]}</strong> key for{" "}
              <strong>{Number(key.price).toLocaleString()} MON</strong> and get 4 attempts to crack the vault!
            </p>

            {!account ? (
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "var(--text)", fontSize: 12, marginBottom: 14 }}>
                  Connect your wallet to play.
                </p>
                <ConnectWalletBtn
                  label="Connect Wallet"
                  style={{ width: "100%", padding: "14px", fontSize: 12, letterSpacing: "3px", borderRadius: 12, fontFamily: "'Cinzel', serif", fontWeight: 700 }}
                />
              </div>
            ) : (
              <>
                <button
                  className="btn btn-gold"
                  onClick={handleBuyKey}
                  disabled={isPending}
                >
                  {isPending ? "Sending…" : "◈ Buy Key & Play"}
                </button>

                <button
                  className="btn btn-card"
                  onClick={() => setShowBuyCard((v) => !v)}
                >
                  {showBuyCard ? "✕ CLOSE CARD PURCHASE" : "💳 BUY MON WITH CARD"}
                </button>
                {showBuyCard && (
                  <div className="buy-widget-wrap" style={{ marginTop: 12 }}>
                    <BuyWidget
                      client={client}
                      chain={MONAD_MAINNET}
                      theme="dark"
                    />
                  </div>
                )}
              </>
            )}

            {statusMsg && <StatusBox msg={statusMsg} />}
          </div>
        )}

        {/* ── SPIN STEP ── */}
        {step === "spin" && (
          <div className="step-section">
            <div className="wheel-wrap">
              <div className="wheel-pointer" />
              <div
                className="wheel"
                style={{
                  transition: spinning ? "transform 4s cubic-bezier(0.17,0.67,0.12,0.99)" : "none",
                  transform: `rotate(${spinDeg}deg)`,
                }}
              >
                <div className="wheel-inner"><WheelSVG /></div>
              </div>
            </div>
            <button className="btn btn-blue" onClick={handleSpin} disabled={spinning}>
              {spinning ? "🌀 Spinning…" : "◈ Spin the Wheel"}
            </button>
            {statusMsg && <StatusBox msg={statusMsg} />}
          </div>
        )}

        {/* ── GUESS STEP ── */}
        {step === "guess" && (
          <div className="step-section">
            <div className="turns-box">
              <div className="turns-left">{turnsLeft}</div>
              <div className="turns-label">ATTEMPTS REMAINING</div>
            </div>
            <div className="code-dials">
              {dialValues.map((v, i) => (
                <div key={i} className="dial" onClick={() => incDial(i)}>{v}</div>
              ))}
            </div>
            <button
              className="btn btn-green"
              onClick={handleTryCode}
              disabled={isPending || turnsLeft === 0}
            >
              {isPending ? "Sending…" : "◈ Try This Code"}
            </button>
            {statusMsg && <StatusBox msg={statusMsg} />}
          </div>
        )}

        {/* ── WIN STEP ── */}
        {step === "done" && (
          <div className="step-section" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64, margin: "16px 0" }}>🎉</div>
            <div className="win-text">VAULT CRACKED!</div>
            <p style={{ color: "var(--green)", marginTop: 8 }}>Prize sent to your wallet + Winner NFT minted!</p>
            <button className="btn btn-gold" onClick={onClose} style={{ marginTop: 20 }}>◈ Close</button>
          </div>
        )}

        {/* ── FAILED STEP ── */}
        {step === "failed" && (
          <div className="step-section" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, margin: "16px 0" }}>🔒</div>
            <div style={{ color: "#ff4466", fontFamily: "Cinzel", fontSize: 18, letterSpacing: 2 }}>
              VAULT REMAINS LOCKED
            </div>
            <p style={{ color: "var(--text)", marginTop: 8 }}>No attempts remaining. Better luck next vault!</p>
            <button className="btn btn-gold" onClick={onClose} style={{ marginTop: 20 }}>◈ Try Another Vault</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STATUS BOX ───────────────────────────────────────────────────────────────

function StatusBox({ msg }) {
  return <div className={`status-box ${msg.type}`}>{msg.text}</div>;
}

// ─── WHEEL SVG ────────────────────────────────────────────────────────────────

function WheelSVG() {
  return (
    <svg width="240" height="240" viewBox="0 0 240 240">
      <circle cx="120" cy="120" r="118" fill="none" stroke="#00c8ff" strokeWidth="1" strokeDasharray="4 4" />
      {[
        [120, 55,  "#c9a84c", 24, "7"],
        [185, 130, "#00ff88", 24, "3"],
        [120, 200, "#c9a84c", 24, "9"],
        [55,  130, "#00ff88", 24, "1"],
        [168, 72,  "#a0d8ff", 18, "5"],
        [185, 172, "#a0d8ff", 18, "8"],
        [72,  185, "#a0d8ff", 18, "2"],
        [55,  72,  "#a0d8ff", 18, "4"],
        [145, 42,  "#c9a84c", 14, "6"],
        [200, 100, "#c9a84c", 14, "0"],
      ].map(([x, y, fill, size, text], i) => (
        <text key={i} x={x} y={y} textAnchor="middle" fill={fill} fontSize={size} fontFamily="Cinzel" fontWeight="900">
          {text}
        </text>
      ))}
      <circle cx="120" cy="120" r="20" fill="#020c14" stroke="#00c8ff" strokeWidth="2" />
      <text x="120" y="126" textAnchor="middle" fill="#00c8ff" fontSize="14" fontFamily="Cinzel">⬡</text>
    </svg>
  );
}

// ─── HOW TO PLAY ──────────────────────────────────────────────────────────────

function HowToPlay() {
  const steps = [
    ["1", "Connect Wallet",  "MetaMask on Monad Mainnet · Chain ID 143"],
    ["2", "Get MON",         "Buy with card or bridge from any chain via NEAR Intents"],
    ["3", "Choose a Key",    "Bronze 100 · Silver 500 · Gold 1,000 · Platinum 10,000 MON"],
    ["4", "Spin the Wheel",  "Spin to get your starting combination"],
    ["5", "Try the Code",    "4 attempts to guess the correct 4-digit vault code"],
    ["6", "Win the Pool",    "Crack it → receive full vault pool + Winner NFT!"],
  ];
  return (
    <div className="howto">
      <div className="section-title" style={{ margin: "0 0 12px" }}>◈ How To Play</div>
      <div className="steps">
        {steps.map(([num, title, desc]) => (
          <div key={num} className="step">
            <div className="step-num">{num}</div>
            <div className="step-text">
              <strong>{title}</strong>
              {desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RAIN CANVAS ──────────────────────────────────────────────────────────────

function RainCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);
    const drops = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speed: 1.5 + Math.random() * 4,
      len: 10 + Math.random() * 30,
      color: Math.random() > 0.5 ? "#00c8ff" : "#0044ff",
      alpha: 0.3 + Math.random() * 0.5,
      width: 0.5 + Math.random() * 1.5,
    }));
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drops.forEach((d) => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.width, d.y + d.len);
        ctx.strokeStyle = d.color;
        ctx.globalAlpha = d.alpha;
        ctx.lineWidth = d.width;
        ctx.shadowColor = d.color;
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;
        d.y += d.speed;
        if (d.y > canvas.height) { d.y = -d.len; d.x = Math.random() * canvas.width; }
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: 0, pointerEvents: "none", opacity: 0.18,
      }}
    />
  );
}

// ─── UTIL ─────────────────────────────────────────────────────────────────────

function copyText(text) { navigator.clipboard.writeText(text).catch(() => {}); }

// ─── STYLES ───────────────────────────────────────────────────────────────────

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Share+Tech+Mono&display=swap');

:root {
  --gold: #c9a84c; --gold2: #f0d080;
  --green: #00ff88; --blue: #00c8ff;
  --dark: #000408;  --card: #020c14;
  --border: #0a2a3a; --text: #80b8d0;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--dark);
  color: var(--text);
  font-family: 'Share Tech Mono', monospace;
  min-height: 100vh;
  overflow-x: hidden;
}

body::before {
  content: '';
  position: fixed; inset: 0;
  background-image:
    linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none; z-index: 0;
}

.app {
  position: relative; z-index: 1;
  max-width: 1100px; margin: 0 auto;
  padding: 20px 16px 60px;
}

/* HEADER */
.header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px; margin-bottom: 24px;
  background: rgba(2,12,20,0.9);
  border: 1px solid var(--border); border-radius: 16px;
  backdrop-filter: blur(12px);
}
.brand { display: flex; flex-direction: column; }
.brand-title {
  font-family: 'Cinzel', serif; font-size: clamp(22px, 4vw, 36px);
  font-weight: 900; letter-spacing: 4px;
  background: linear-gradient(135deg, #ff6600, #ffaa00, #00c8ff, #00ff88);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; animation: titleFlow 4s linear infinite; background-size: 300%;
}
@keyframes titleFlow { 0%{background-position:0%} 100%{background-position:300%} }
.brand-sub { font-size: 10px; letter-spacing: 3px; color: #2a6a8a; margin-top: 2px; }
.header-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.chain-badge {
  display: inline-flex; align-items: center; gap: 7px;
  background: var(--card); border: 1px solid var(--border); border-radius: 20px;
  padding: 7px 16px; font-size: 10px; color: var(--blue); letter-spacing: 1px;
}
.pulse-dot {
  width: 7px; height: 7px; background: var(--green);
  border-radius: 50%; animation: pulse 2s infinite; box-shadow: 0 0 8px var(--green);
}
.pulse-dot.green { background: var(--green); box-shadow: 0 0 8px var(--green); }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

/* WALLET CONNECTED BADGE */
.wallet-connected-badge {
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(0,255,136,0.08); border: 1px solid rgba(0,255,136,0.3);
  border-radius: 20px; padding: 7px 16px;
  font-size: 10px; color: var(--green); letter-spacing: 1px;
  font-family: 'Share Tech Mono', monospace;
}

/* GET MON HEADER BUTTON */
.bridge-header-btn {
  background: linear-gradient(135deg, #003a5a, var(--blue));
  border: none; border-radius: 20px;
  padding: 7px 16px; font-size: 10px; letter-spacing: 1.5px;
  color: #000; font-family: 'Share Tech Mono', monospace; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
  box-shadow: 0 0 12px #00c8ff44;
  animation: vibrate 0.12s linear infinite;
}
.bridge-header-btn:hover {
  animation: none; transform: scale(1.08);
  box-shadow: 0 0 22px #00c8ff88;
}

.wrong-chain-banner {
  background: rgba(255,68,0,0.12); border: 1px solid rgba(255,68,0,0.4);
  border-radius: 10px; padding: 12px 20px; margin-bottom: 16px;
  color: #ff8844; font-size: 12px; text-align: center; letter-spacing: 1px;
}

/* HERO */
.hero { text-align: center; padding: 40px 20px 20px; }
.hero-title {
  font-family: 'Cinzel', serif; font-size: clamp(40px, 8vw, 80px); font-weight: 900;
  background: linear-gradient(135deg, #ff6600, #ffaa00, #00c8ff, #00ff88);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; animation: titleFlow 4s linear infinite; background-size: 300%;
}
.hero-sub { font-size: 11px; letter-spacing: 4px; color: #2a6a8a; margin-top: 8px; }
.hero-divider {
  margin: 20px auto; width: 120px; height: 1px;
  background: linear-gradient(90deg, transparent, var(--blue), transparent);
}

/* CONTRACT BAR */
.contract-bar {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 12px; padding: 12px 20px; margin: 0 0 24px;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;
}
.contract-bar .label { font-size: 10px; color: #2a6a8a; letter-spacing: 1px; }
.contract-bar code { font-size: 11px; color: var(--gold); word-break: break-all; }
.copy-btn {
  background: none; border: 1px solid var(--border); border-radius: 6px;
  color: var(--blue); font-size: 10px; padding: 4px 10px; cursor: pointer;
  font-family: 'Share Tech Mono', monospace; transition: border-color 0.2s;
}
.copy-btn:hover { border-color: var(--blue); }

/* SECTION TITLE */
.section-title {
  font-family: 'Cinzel', serif; font-size: 13px; letter-spacing: 4px;
  color: var(--gold); text-transform: uppercase;
  margin: 28px 0 14px; text-align: center;
}

/* KEY CARDS */
.keys-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px; margin-bottom: 28px;
}
.key-card {
  background: var(--card); border-radius: 16px; padding: 20px;
  text-align: center; cursor: pointer; transition: transform 0.3s, box-shadow 0.3s;
  position: relative; overflow: hidden;
}
.key-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
.key-card.bronze  { border: 1px solid #cd7f32; }
.key-card.bronze::before  { background: linear-gradient(90deg, transparent, #cd7f32, transparent); }
.key-card.silver  { border: 1px solid #c0c0c0; }
.key-card.silver::before  { background: linear-gradient(90deg, transparent, #c0c0c0, transparent); }
.key-card.gold    { border: 1px solid var(--gold); }
.key-card.gold::before    { background: linear-gradient(90deg, transparent, var(--gold), transparent); }
.key-card.platinum{ border: 1px solid #a0d8ff; }
.key-card.platinum::before{ background: linear-gradient(90deg, transparent, #a0d8ff, transparent); }
.key-card:hover { transform: translateY(-5px); }
.key-card.bronze:hover   { box-shadow: 0 8px 30px #cd7f3244; }
.key-card.silver:hover   { box-shadow: 0 8px 30px #c0c0c044; }
.key-card.gold:hover     { box-shadow: 0 8px 30px #c9a84c44; }
.key-card.platinum:hover { box-shadow: 0 8px 30px #a0d8ff44; }
.key-img-wrap { width: 80px; height: 80px; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; }
.key-vault-img {
  width: 80px; height: 80px; object-fit: contain;
  filter: drop-shadow(0 0 12px rgba(0,200,255,0.5));
  transition: filter 0.3s, transform 0.3s;
}
.key-card:hover .key-vault-img { filter: drop-shadow(0 0 22px rgba(0,200,255,0.85)); transform: scale(1.08); }
.key-name { font-family: 'Cinzel', serif; font-size: 13px; font-weight: 700; margin-bottom: 5px; }
.key-card.bronze   .key-name { color: #cd7f32; }
.key-card.silver   .key-name { color: #c0c0c0; }
.key-card.gold     .key-name { color: var(--gold); }
.key-card.platinum .key-name { color: #a0d8ff; }
.key-price  { font-size: 22px; font-weight: 700; color: var(--green); margin-bottom: 4px; }
.key-turns  { font-size: 9px; color: #2a6a8a; letter-spacing: 1px; }
.key-pool   { font-size: 11px; color: var(--gold2); margin-top: 8px; padding: 6px; background: #040e18; border-radius: 8px; }

/* VAULT CARDS */
.vaults-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px; margin-bottom: 28px;
}
.vault-card { background: var(--card); border-radius: 20px; overflow: hidden; cursor: pointer; transition: transform 0.4s, box-shadow 0.4s; }
.vault-card:hover { transform: translateY(-6px) scale(1.02); }
.vault-card.bronze-v   { border: 1px solid #cd7f32; }
.vault-card.silver-v   { border: 1px solid #c0c0c0; }
.vault-card.gold-v     { border: 1px solid var(--gold); }
.vault-card.platinum-v { border: 1px solid #a0d8ff; }
.vault-card.bronze-v:hover   { box-shadow: 0 0 30px #cd7f3244; }
.vault-card.silver-v:hover   { box-shadow: 0 0 30px #c0c0c044; }
.vault-card.gold-v:hover     { box-shadow: 0 0 30px #c9a84c55; }
.vault-card.platinum-v:hover { box-shadow: 0 0 40px #a0d8ff55; }
.vault-thumb { width: 100%; height: 200px; position: relative; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #040e18, #020810); overflow: hidden; }
.vault-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s; }
.vault-card:hover .vault-img { transform: scale(1.06); }
.vault-img-fallback { display: none; align-items: center; justify-content: center; width: 100%; height: 100%; position: absolute; inset: 0; }
.vault-icon-big { font-size: 72px; filter: drop-shadow(0 0 20px rgba(0,200,255,0.4)); }
.vault-info { padding: 14px; }
.vault-name { font-family: 'Cinzel', serif; font-size: 12px; font-weight: 700; letter-spacing: 2px; margin-bottom: 6px; }
.vault-card.bronze-v   .vault-name { color: #cd7f32; }
.vault-card.silver-v   .vault-name { color: #c0c0c0; }
.vault-card.gold-v     .vault-name { color: var(--gold); }
.vault-card.platinum-v .vault-name { color: #a0d8ff; }
.vault-pool-live { font-size: 22px; font-weight: 700; color: var(--green); text-shadow: 0 0 12px var(--green); }
.vault-pool-label { font-size: 9px; color: #2a6a8a; letter-spacing: 2px; text-transform: uppercase; }
.vault-status.locked { display: inline-block; margin-top: 6px; padding: 3px 10px; border-radius: 10px; font-size: 9px; letter-spacing: 1px; background: #1a0808; border: 1px solid #ff4444; color: #ff4444; }

/* HOW TO PLAY */
.howto { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 22px; margin: 20px 0; }
.steps { display: flex; flex-direction: column; gap: 12px; margin-top: 14px; }
.step  { display: flex; gap: 14px; align-items: flex-start; }
.step-num { width: 28px; height: 28px; min-width: 28px; border: 1px solid var(--blue); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Cinzel', serif; font-size: 11px; color: var(--blue); }
.step-text { font-size: 11px; line-height: 1.7; padding-top: 3px; }
.step-text strong { color: var(--gold2); display: block; margin-bottom: 1px; letter-spacing: 1px; }

/* FOOTER */
.footer { text-align: center; padding: 28px 0 0; border-top: 1px solid var(--border); }
.footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-bottom: 16px; }
.footer-link {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 10px; letter-spacing: 1.5px; text-decoration: none;
  padding: 8px 16px; border-radius: 20px;
  font-family: 'Share Tech Mono', monospace; font-weight: 700;
  cursor: pointer; animation: vibrate 0.12s linear infinite;
  transition: box-shadow 0.2s, transform 0.2s;
}
.footer-link:hover { animation: none; transform: scale(1.1); }
@keyframes vibrate {
  0%   { transform: translate(0, 0) rotate(0deg); }
  20%  { transform: translate(-1px, 0.5px) rotate(-0.4deg); }
  40%  { transform: translate(1px, -0.5px) rotate(0.4deg); }
  60%  { transform: translate(-0.5px, 1px) rotate(-0.2deg); }
  80%  { transform: translate(0.5px, -1px) rotate(0.2deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}
.fl-monad  { background: #021a2a; border: 1px solid #00c8ff; color: #00c8ff; box-shadow: 0 0 12px #00c8ff33; }
.fl-vision { background: #021a14; border: 1px solid #00ff88; color: #00ff88; box-shadow: 0 0 12px #00ff8833; }
.fl-block  { background: #1a1200; border: 1px solid #c9a84c; color: #c9a84c; box-shadow: 0 0 12px #c9a84c33; }
.fl-tw     { background: #05111a; border: 1px solid #80b8d0; color: #80b8d0; box-shadow: 0 0 12px #80b8d033; }
.fl-dc     { background: #0a0618; border: 1px solid #9b84ec; color: #9b84ec; box-shadow: 0 0 12px #9b84ec33; }
.fl-monad:hover  { box-shadow: 0 0 24px #00c8ff66; }
.fl-vision:hover { box-shadow: 0 0 24px #00ff8866; }
.fl-block:hover  { box-shadow: 0 0 24px #c9a84c66; }
.fl-tw:hover     { box-shadow: 0 0 24px #80b8d066; }
.fl-dc:hover     { box-shadow: 0 0 24px #9b84ec66; }
.footer-copy { font-size: 9px; color: #0a2a3a; letter-spacing: 2px; word-break: break-word; }

/* MODAL SHARED */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,4,8,0.92); z-index: 100;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(8px);
}
.modal {
  background: #020c14; border: 1px solid var(--border); border-radius: 24px;
  padding: 28px; width: 95%; max-width: 420px; text-align: center;
  position: relative; box-shadow: 0 0 60px #00c8ff22;
  max-height: 90vh; overflow-y: auto;
}
.modal::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--blue), var(--green), transparent);
  border-radius: 24px 24px 0 0;
}
.modal-close {
  position: absolute; top: 14px; right: 18px;
  background: none; border: none; color: #2a6a8a; cursor: pointer;
  font-size: 20px; transition: color 0.3s;
}
.modal-close:hover { color: var(--blue); }
.modal-vault-img-wrap { width: 110px; height: 110px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; }
.modal-vault-img {
  width: 110px; height: 110px; object-fit: contain;
  filter: drop-shadow(0 0 18px rgba(0,200,255,0.6));
  animation: floatImg 3s ease-in-out infinite;
}
@keyframes floatImg { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
.modal-title { font-family: 'Cinzel', serif; font-size: 17px; color: var(--gold); letter-spacing: 3px; margin-bottom: 20px; }

/* BRIDGE MODAL SPECIFICS */
.bridge-modal { max-width: 480px; }
.bridge-tabs {
  display: flex; gap: 8px; margin-bottom: 20px;
}
.bridge-tab {
  flex: 1; padding: 10px; border-radius: 10px;
  font-family: 'Share Tech Mono', monospace; font-size: 10px;
  letter-spacing: 1.5px; cursor: pointer; transition: all 0.2s;
  background: none; border: 1px solid var(--border); color: var(--text);
}
.bridge-tab.active {
  background: rgba(0,200,255,0.1); border-color: var(--blue); color: var(--blue);
  box-shadow: 0 0 12px #00c8ff22;
}
.bridge-tab:not(.active):hover { border-color: #2a6a8a; color: #aaccdd; }
.bridge-tab-content { text-align: left; }
.bridge-desc { font-size: 11px; color: var(--text); line-height: 1.8; margin-bottom: 16px; }
.bridge-field { margin-bottom: 12px; }
.bridge-field label {
  display: block; font-size: 9px; letter-spacing: 2px; color: #2a6a8a;
  margin-bottom: 6px; text-transform: uppercase;
}
.bridge-field input, .bridge-field select {
  width: 100%; padding: 10px 12px; border-radius: 8px;
  background: #040e18; border: 1px solid var(--border);
  color: var(--text); font-family: 'Share Tech Mono', monospace; font-size: 13px;
  outline: none; transition: border-color 0.2s;
}
.bridge-field input:focus, .bridge-field select:focus { border-color: var(--blue); }
.bridge-field select option { background: #020c14; }

.bridge-quote-box {
  margin-top: 14px; padding: 14px; border-radius: 10px;
  background: rgba(0,200,255,0.04); border: 1px solid var(--border);
}
.bq-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 7px 0; border-bottom: 1px solid rgba(0,200,255,0.07); font-size: 12px;
}
.bq-row:last-child { border-bottom: none; }
.bq-row span:first-child { color: var(--text); }
.bq-row span:last-child  { color: var(--blue); font-weight: 700; }

.bridge-deposit-box {
  margin-top: 12px; padding: 12px; border-radius: 8px;
  background: rgba(201,168,76,0.06); border: 1px solid rgba(201,168,76,0.3);
}

/* BUY WIDGET WRAPPER */
.buy-widget-wrap {
  border-radius: 12px; overflow: hidden;
  border: 1px solid rgba(0,200,255,0.2);
  background: rgba(5,10,14,0.95);
}

/* VAULT MODAL STEP */
.step-section { display: flex; flex-direction: column; gap: 14px; }
.step-desc { font-size: 12px; color: var(--text); line-height: 1.8; }
.step-desc strong { color: var(--gold); }

/* BUTTONS */
.btn {
  width: 100%; padding: 14px; border: none; border-radius: 12px;
  font-family: 'Cinzel', serif; font-size: 12px; font-weight: 700;
  letter-spacing: 3px; cursor: pointer; transition: all 0.3s; text-transform: uppercase;
}
.btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none !important; }
.btn-gold  { background: linear-gradient(135deg, #7a4a00, var(--gold)); color: #000; }
.btn-gold:not(:disabled):hover  { transform: translateY(-2px); box-shadow: 0 8px 25px #c9a84c44; }
.btn-blue  { background: linear-gradient(135deg, #003a5a, var(--blue)); color: #000; }
.btn-blue:not(:disabled):hover  { transform: translateY(-2px); box-shadow: 0 8px 25px #00c8ff44; }
.btn-green { background: linear-gradient(135deg, #003a20, var(--green)); color: #000; }
.btn-green:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 8px 25px #00ff8844; }
.btn-card  { background: linear-gradient(135deg, #3a2a00, #c9a84c); color: #000;
  width: 100%; padding: 12px; border: none; border-radius: 12px;
  font-family: 'Cinzel', serif; font-size: 11px; font-weight: 700;
  letter-spacing: 2px; cursor: pointer; transition: all 0.3s; text-transform: uppercase;
}
.btn-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px #c9a84c55; }

/* STATUS BOX */
.status-box { padding: 10px; border-radius: 8px; font-size: 10px; letter-spacing: 1px; }
.status-box.info    { background: #00c8ff11; border: 1px solid #00c8ff44; color: var(--blue); }
.status-box.success { background: #00ff8811; border: 1px solid #00ff8844; color: var(--green); }
.status-box.error   { background: #ff004411; border: 1px solid #ff004444; color: #ff4466; }

/* WHEEL */
.wheel-wrap { position: relative; width: 240px; height: 240px; margin: 0 auto 18px; }
.wheel-pointer {
  position: absolute; top: -16px; left: 50%; transform: translateX(-50%);
  width: 0; height: 0;
  border-left: 11px solid transparent; border-right: 11px solid transparent;
  border-bottom: 26px solid var(--gold);
  filter: drop-shadow(0 0 8px var(--gold)); z-index: 10;
}
.wheel {
  width: 240px; height: 240px; border-radius: 50%;
  border: 3px solid var(--blue);
  box-shadow: 0 0 30px #00c8ff33, inset 0 0 40px #00040800;
}
.wheel-inner { width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle, #040e18, #020810); }

/* DIALS */
.turns-box { margin-bottom: 12px; }
.turns-left { font-size: 32px; font-weight: 700; color: var(--gold); font-family: 'Cinzel', serif; }
.turns-label { font-size: 9px; color: #2a6a8a; letter-spacing: 2px; }
.code-dials { display: flex; gap: 10px; justify-content: center; margin: 8px 0; }
.dial {
  width: 58px; height: 76px;
  background: #040e18; border: 2px solid var(--border); border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cinzel', serif; font-size: 30px; font-weight: 900;
  color: var(--blue); text-shadow: 0 0 15px var(--blue);
  cursor: pointer; transition: all 0.3s; user-select: none;
}
.dial:hover { border-color: var(--blue); transform: scale(1.08); color: var(--green); text-shadow: 0 0 20px var(--green); }

/* WIN TEXT */
.win-text { font-family: 'Cinzel', serif; font-size: 24px; font-weight: 900; color: var(--gold); letter-spacing: 4px; text-shadow: 0 0 20px var(--gold); }

@media (max-width: 600px) {
  .header { flex-direction: column; gap: 12px; padding: 14px 16px; }
  .header-right { width: 100%; justify-content: center; }
  .bridge-tabs { flex-direction: column; }
}
`;
