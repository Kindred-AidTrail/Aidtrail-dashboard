# Kindred AidTrail — Decentralized Humanitarian Disbursement Dashboard

<div align="center">

![AidTrail Dashboard Banner](https://img.shields.io/badge/Stellar-Soroban%20v22-blue?style=for-the-badge&logo=stellar)
![Next.js 14](https://img.shields.io/badge/Next.js-14%20App%20Router-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-Apache--2.0-green?style=for-the-badge)

**A decentralized, transparent aid and grant disbursement web application on Stellar & Soroban.**  
*Track every dollar from donor contribution to merchant redemption with cryptographic audit trails, conditional milestone escrows, and offline-resilient beneficiary vouchers.*

[Live Public Explorer](https://aidtrail.example.org/explorer) • [Contracts Repository](https://github.com/Kindred-AidTrail/Aidtrail-contracts) • [Registry API Repository](https://github.com/Kindred-AidTrail/Aidtrail-registry-api)

</div>

---

## 🌟 Executive Summary

Traditional humanitarian aid pipelines suffer from administrative leakage, delayed cross-border settlements, and opaque intermediary reporting. **Kindred AidTrail** solves this by establishing a decentralized, mathematically verifiable chain of custody:

1. **Donors** lock funds directly into Soroban smart contract escrow pools.
2. **Independent Verifiers** evaluate real-world physical deliverables via geotagged IPFS photographic proof and execute **$M$-of-$N$ multi-sig** attestations before funds unlock.
3. **NGOs** mint restricted, categorical aid vouchers (e.g., Clean Water, Nutrition, Medical) strictly backed by unlocked escrow balances.
4. **Beneficiaries** present low-bandwidth dynamic QR codes or 12-digit SMS tokens at whitelisted local merchants.
5. **Whitelisted Merchants** scan vouchers and trigger immediate on-chain settlement, directly receiving USDC/XLM in their Stellar wallets.
6. **Public Watchdogs & Donors** audit real-time solvency invariants and stream machine-readable CSV ledgers without logging in.

---

## 🏗 System Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │          Kindred AidTrail Web App            │
                    │      (Next.js 14 App Router + React 18)      │
                    └──────┬──────────────┬──────────────┬─────────┘
                           │              │              │
           Wallet Connect  │              │ HTTP / JWT   │ RPC Simulation
           (SEP-10 / Kit)  ▼              ▼              ▼
           ┌──────────────────────┐ ┌───────────────┐ ┌──────────────────────┐
           │ Stellar Wallets Kit  │ │  AidTrail     │ │ Soroban RPC Server   │
           │ Freighter / Albedo   │ │  Registry API │ │ Testnet / Mainnet    │
           └──────────────────────┘ └──────┬────────┘ └──────────┬───────────┘
                                           │                     │
                                           ▼                     ▼
                                   PostgreSQL / S3     ┌───────────────────┐
                                   PII Encryption      │ Soroban Contract  │
                                   Event Indexing      │ CAIDTRAIL...00    │
                                                       └───────────────────┘
```

### Key Technical Pillars

- **Next.js 14 App Router**: Modern server and client components with granular route grouping and dynamic metadata.
- **Soroban Contract SDK v22**: Direct client-side transaction simulation (`simulateTransaction`), XDR parsing, and ledger submission.
- **Stellar Wallets Kit & Freighter Integration**: Native support for Freighter hardware and browser extensions alongside demo credentials for seamless testing.
- **PWA & Offline Resilience**: IndexedDB storage queue (`idb`) enabling merchants in rural or disrupted areas to scan vouchers offline and synchronize upon network reconnection.
- **Internationalization (i18n)**: Out-of-the-box support for English, Kiswahili, and Arabic (`en`, `sw`, `ar`).
- **WCAG 2.1 AAA Accessibility**: Integrated high-contrast sunlight mode, reduced-motion controls, and multi-tier font scaling.

---

## 🎭 Role Portals & User Journeys

### 1. 🌍 Public Humanitarian Audit Explorer (`/explorer`)
- **No Login Required**: Open data access for donors, journalists, watchdog organizations, and researchers.
- **Program Transparency Board**: Real-time solvency check verifying:
  $$\text{Contract Escrow Balance} = \text{Total Funded} - \text{Total Released}$$
- **Voucher Audit Feed**: Chronological transaction stream of pseudonymous voucher disbursements.
- **Streaming CSV Export Hub (`/explorer/export`)**: Direct download of machine-readable datasets for disbursements and milestone proofs.

### 2. 💝 Donor Impact Portal (`/donor`)
- **Direct Escrow Funding**: Deposit USDC or native XLM directly into humanitarian contract escrow pools.
- **Impact Milestones Tracker**: Monitor release tranches and review which verifiers signed off.
- **Donor Refund Guarantee**: Trigger direct refunds if program deliverables exceed agreed expiration deadlines.

### 3. 🏛 NGO Command Center (`/ngo`)
- **Program Creation Wizard (`/ngo/create`)**: Step-by-step form to set funding targets, multi-sig verifier thresholds ($M$-of-$N$), and upload IPFS project charters.
- **Milestone Management (`/ngo/milestones`)**: Define programmatic funding tranches, set release sums, and attach proof documentation.
- **Batch Voucher Distribution (`/ngo/vouchers`)**: Issue vouchers to enrolled beneficiaries with strict on-chain category restrictions and validity periods.
- **Merchant Whitelist Directory (`/ngo/vendors`)**: Onboard, authorize, and manage local suppliers.

### 4. 🛡 Independent Verifier Quorum (`/verifier`)
- **Cryptographic Deliverable Attestation**: Inspect field photographs, water purity lab certifications, and geotagged evidence.
- **$M$-of-$N$ Multi-Sig Signing**: Provide cryptographic threshold signatures on Soroban to release tranche funds.
- **Discrepancy Reporting**: Record objections in immutable public audit logs.

### 5. 📱 Beneficiary Mobile Wallet (`/beneficiary`)
- **Mobile-First Experience**: Designed for low-end smartphones with clear categorical aid balances.
- **Outdoor High-Contrast QR Code (`VoucherQrModal`)**: Anti-glare optical QR code view optimized for direct sunlight reading.
- **Low-Bandwidth SMS Passcode**: 12-digit numeric code fallback for SMS and feature phone recipients.
- **Merchant Locator**: Discover nearby authorized food, water, and medical suppliers.

### 6. 🏪 Merchant Redemption Terminal (`/vendor`)
- **Optical Camera Viewfinder Scanner**: In-browser camera decoding of beneficiary voucher QR codes.
- **Immediate Smart Contract Settlement**: Direct call to `redeem_voucher` which credits USDC directly into the merchant's wallet.
- **Offline Mode with Auto-Sync**: Automatically caches transactions in IndexedDB when network coverage drops, syncing as soon as connectivity resumes.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.x` or later
- **npm**: `v10.x` or later
- **Stellar Wallet**: [Freighter Extension](https://www.freighter.app/) (configured for Stellar Testnet)

### Installation

```bash
# Clone the repository
git clone https://github.com/Kindred-AidTrail/Aidtrail-dashboard.git
cd Aidtrail-dashboard

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env.local` file based on `.env.example`:

```env
# Stellar Network Configuration
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"

# Smart Contract Addresses
NEXT_PUBLIC_CONTRACT_ID=CAIDTRAILTESTNETCONTRACTADDRESS000000000000000000000000000000
NEXT_PUBLIC_USDC_TOKEN_ID=CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC

# Registry API Backend
NEXT_PUBLIC_REGISTRY_API_URL=http://localhost:4000
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the AidTrail dashboard.

---

## 🧪 Testing Suite

### Unit Tests (Vitest)
Executes component unit tests, wallet state management, offline queue persistence, and i18n translation coverage:

```bash
npm run test
```

### End-to-End Tests (Playwright)
Executes multi-role end-to-end user navigation across Desktop Chrome and Mobile Safari profiles:

```bash
npx playwright test
```

### Design System Component Workshop (Storybook)
Launch the Storybook design system component catalog:

```bash
npm run storybook
```

---

## 🔒 Security & Threat Model

| Threat Scenario | Defense & Mitigation |
| :--- | :--- |
| **Escrow Insolvency** | The Soroban smart contract mathematically checks $\sum \text{vouchers} \le \text{released\_funds}$ before every issuance. |
| **Merchant Impersonation** | Vouchers are non-transferable and can only be redeemed by addresses present in the contract whitelist map for that category. |
| **Expired Funds Abandonment** | NGOs and donors can call `reclaim_expired` after the expiration deadline to return capital to the program pool. |
| **PII Data Exposure** | Recipient identity names and national IDs are encrypted with AES-256-GCM in the backend; the UI and smart contract strictly use pseudonymous cryptographic hashes. |
| **Network Partition / Disruption** | The PWA service worker and IndexedDB offline queue record signed voucher claims locally, executing cryptographically once the device reconnects. |

---

## 📦 Production Deployment

Build the optimized production bundle:

```bash
npm run build
npm run start
```

Deployable natively on **Vercel**, **AWS Amplify**, or as a containerized Docker container.

---

## 🤝 Kindred AidTrail Ecosystem

This repository is part of the 3-repo **Kindred AidTrail** suite:

1. [**`Aidtrail-contracts`**](https://github.com/Kindred-AidTrail/Aidtrail-contracts): Rust Soroban smart contracts, solvency invariants, multi-sig escrow, and token bindings.
2. [**`Aidtrail-registry-api`**](https://github.com/Kindred-AidTrail/Aidtrail-registry-api): Fastify backend, Postgres/Prisma indexer, AES-256-GCM PII encryption, SEP-10 auth, and S3 evidence storage.
3. [**`Aidtrail-dashboard`**](https://github.com/Kindred-AidTrail/Aidtrail-dashboard): Next.js 14 App Router frontend, multi-role portals, PWA offline redemption queue, and public audit explorer.

---

## 📄 License

Licensed under the [Apache License 2.0](LICENSE).
