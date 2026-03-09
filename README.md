# National E-Voting System
## A Blockchain-Based, Privacy-Preserving Electronic Voting Platform

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Hyperledger Fabric](https://img.shields.io/badge/Hyperledger%20Fabric-2.5-2F3134?style=flat-square&logo=hyperledger&logoColor=white)](https://hyperledger-fabric.readthedocs.io/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Research%20Prototype-orange?style=flat-square)]()

---

> **Research Status:** This system is a functional prototype developed for academic and research purposes, demonstrating the feasibility of a cryptographically secure, blockchain-anchored digital election infrastructure. It is not intended for production deployment without further regulatory evaluation and security auditing.

---

## Table of Contents

1. [Abstract](#1-abstract)
2. [Motivation and Problem Statement](#2-motivation-and-problem-statement)
3. [System Architecture](#3-system-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Key Features](#5-key-features)
6. [Cryptographic Design — Blind Signature Protocol](#6-cryptographic-design--blind-signature-protocol)
7. [Project Structure](#7-project-structure)
8. [API Reference](#8-api-reference)
9. [Deployment Guide](#9-deployment-guide)
10. [Security Considerations](#10-security-considerations)
11. [Scalability and Limitations](#11-scalability-and-limitations)
12. [Compliance and Regulatory Notes](#12-compliance-and-regulatory-notes)
13. [Testing](#13-testing)
14. [Roadmap](#14-roadmap)
15. [References](#15-references)

---

## 1. Abstract

This project presents a prototype implementation of a **tamper-resistant, privacy-preserving electronic voting system** leveraging permissioned blockchain technology (Hyperledger Fabric 2.5) and RSA Blind Signatures. The system is designed to address the dual challenge of electoral integrity and voter anonymity — two properties that are mutually exclusive in conventional systems.

The architecture separates the act of voter authentication from the act of vote submission using cryptographic blinding, such that the Election Commission (EC) authority can verify voter eligibility without gaining any information about the voter's choice. All vote records are committed to an immutable distributed ledger, ensuring public verifiability and comprehensive auditability without compromising secret ballot requirements.

This system is designed with India's electoral framework in mind — particularly the Lok Sabha and Vidhan Sabha constituency model — and draws from established best practices in e-voting research.

---

## 2. Motivation and Problem Statement

### 2.1 Existing Limitations of Paper-Based and EVM Systems

Current electronic voting machines (EVMs) and paper ballot systems, while operationally proven, face limitations in the following areas:

- **Transparency deficit:** Vote records are not independently verifiable by voters after submission.
- **Physical logistics:** Deployment, transport, and storage of EVMs at scale incurs significant cost and administrative overhead.
- **Limited auditability:** Post-election audits depend on physical chain-of-custody, which is difficult to enforce at scale.
- **Accessibility barriers:** Remote or diaspora voters cannot participate without physical presence.

### 2.2 Proposed Solution

This system proposes a blockchain-anchored digital voting infrastructure that provides:

- **Cryptographic verifiability:** Each vote is recorded as an immutable transaction on a distributed ledger.
- **Secret ballot preservation:** RSA Blind Signatures ensure the authority cannot link a submitted vote to a specific voter.
- **Real-time transparency:** Results are computable and publicly verifiable at any point after the election closes.
- **Comprehensive audit trail:** Every administrative action — not just votes — is permanently logged on-chain.

---

## 3. System Architecture

The system follows a three-layer architecture that separates the user interface, application logic, and blockchain network.

### Client Layer
- **Voter Booth (React SPA):** Interface for voters to securely cast their votes.
- **Admin Dashboard (React SPA):** Used by the Election Commission to manage constituencies, candidates, and elections.
- **Public Results Portal:** Allows citizens to view election results transparently.
- **Blind Signature Computation:** Performed client-side to ensure voter anonymity.

### Application Layer
- **Node.js + Express API** that handles authentication and voting requests.
- REST endpoints:
  - `/api/admin` – Election Commission operations
  - `/api/voter` – Voter registration and voting
  - `/api/results` – Public election results
  - `/api/audit` – Election audit logs
- **Fabric Gateway (fabric-network SDK)** connects the backend to the blockchain network.

### Blockchain Layer
- **Hyperledger Fabric Network**
- Channel: `mychannel`
- Smart Contract: `evoting`

Ledger objects stored on blockchain:

| Key | Description |
|----|-------------|
| CONST::<id> | Constituency records |
| CAND::<id> | Candidate records |
| VOTER::<epic> | Registered voter records |
| VOTE::<token> | Anonymous vote transactions |
| AUDIT::<txid> | Immutable audit logs |

Network Components:
- **Peer Node** – Executes smart contracts and stores ledger
- **Orderer Node** – Orders transactions into blocks
- **CouchDB** – World state database

### 3.1 Component Responsibilities

| Component | Responsibility |
|---|---|
| Voter Booth UI | Guided, multi-step voting interface; performs all blind signature cryptography client-side |
| Admin Dashboard | Lifecycle management: constituency creation, candidate registration, election start/end |
| Public Results | Real-time, unauthenticated read view of live blockchain vote tallies |
| Backend API | REST gateway; RSA signing authority; relays transactions to Fabric network |
| Hyperledger Fabric | Immutable distributed ledger; enforces all election rules via smart contract (chaincode) |

---

## Architecture Diagram
<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/fe295d99-8d50-4bdb-af5d-052a0480aae3" />


## 4. Technology Stack

| Component | Technology | Version | Justification |
|---|---|---|---|
| Blockchain Network | Hyperledger Fabric | 2.5.15 | Permissioned ledger; enterprise-grade; no public token economy |
| Smart Contracts | Hyperledger Fabric Chaincode (Node.js) | Node 18 | Rich query support; existing team expertise |
| Backend API | Node.js + Express | 18.x / 4.x | Non-blocking I/O; consistent language with chaincode |
| Frontend | React | 18.x | Component-driven SPA; maintainable |
| Cryptography | Native BigInt — RSA Blind Signature | — | No external crypto library dependency; auditable implementation |
| Blockchain SDK | fabric-network, fabric-ca-client | 2.2.20 | Official Hyperledger SDK |
| Containerization | Docker + Docker Compose | — | Reproducible Fabric network deployment |
| State Database | CouchDB | — | JSON document model; rich query support |
| Runtime Environment | WSL 2 — Ubuntu | — | Windows-compatible Linux environment |

---

## 5. Key Features

### 5.1 Privacy and Cryptographic Integrity

- **RSA Blind Signature Voting:** The server authority certifies voter eligibility without learning the vote choice. The mathematical relationship between the blinded token (visible to server) and the unblinded vote (submitted anonymously) is computationally infeasible to reverse.
- **Token-Based Anonymous Submission:** Votes are submitted as (token, signature, candidateID) tuples with no identity information attached.
- **Client-Side Cryptography:** All blinding and unblinding operations execute entirely in the voter's browser. No private voter data transits the network.

### 5.2 Transparency and Auditability

- **Immutable Ledger:** All votes and administrative actions are committed as blockchain transactions; retroactive modification is computationally infeasible.
- **Public Verifiability:** Results are readable without authentication at any time. Any third party can independently query the ledger.
- **Comprehensive Audit Trail:** Administrative actions (constituency creation, candidate registration, election lifecycle changes) are logged on-chain via a dedicated audit route.

### 5.3 Election Administration

- Multi-constituency management with independent election lifecycles
- Candidate registration with constituency association
- Voter registration using EPIC ID (India's Electors Photo Identity Card)
- Election states: `CREATED → ACTIVE → CLOSED`
- Role-based access control: Election Commission API key gates all administrative operations

---

## 6. Cryptographic Design — Blind Signature Protocol

### 6.1 Background

RSA Blind Signatures were introduced by David Chaum (1983) to enable a signer to sign a message without learning its contents. This property maps directly to the requirement that an election authority can authorize a vote without learning who it is cast for.

### 6.2 Protocol Flow

```
Voter (Client Browser)                    Backend Server (EC Authority)
       |                                              |
       |  Step 1: Generate random 256-bit token T     |
       |  Step 2: Fetch server RSA public key (n, e)  |
       |  Step 3: Generate random blinding factor r   |
       |          where gcd(r, n) = 1                 |
       |  Step 4: Compute blinded token:              |
       |          B = T * r^e mod n                   |
       |                                              |
       |-------- POST /api/voter/blind-sign -------->|
       |         { epicId, blindedToken: B }          |
       |                                              |
       |                   Step 5: Verify EPIC ID     |
       |                   Step 6: Check not yet used |
       |                   Step 7: Sign blinded token |
       |                     S_b = B^d mod n          |
       |                   Step 8: Mark voter as used |
       |                                              |
       |<------------- { blindedSignature: S_b } -----|
       |                                              |
       |  Step 9: Unblind the signature:              |
       |          S = S_b * r^(-1) mod n              |
       |          (S is now a valid RSA signature      |
       |           over T, unlinkable to B)            |
       |  Step 10: Select candidate                   |
       |                                              |
       |-------- POST /api/voter/vote ------------->  |
       |         { token: T, signature: S,            |
       |           candidateId: X }                   |
       |         (No identity information sent)       |
       |                                              |
       |              Step 11: Verify signature:      |
       |                T^e ≡ S^... mod n (valid)     |
       |              Step 12: Commit to blockchain   |
       |              Step 13: Return transaction ID  |
       |                                              |
       |<------------- { txId, success: true } -------|
```

### 6.3 Security Properties

| Property | Guarantee |
|---|---|
| **Anonymity** | Server cannot link submitted vote to registered voter |
| **Unforgeability** | Only the EC private key can produce valid vote signatures |
| **One-vote enforcement** | Each voter can obtain exactly one blind signature (enforced on-chain) |
| **Double-spend prevention** | Each token can be submitted exactly once (enforced at chaincode level) |

---

## 7. Project Structure

```
chain/
|
|-- app.js                         Entry point: Express server + route registration
|-- package.json                   Node.js dependencies
|-- .env                           Environment configuration
|
|-- routes/
|   |-- admin.js                   EC-only endpoints: constituency & candidate management
|   |-- voter.js                   Blind signature issuance & anonymous vote submission
|   |-- results.js                 Public results & constituency status queries
|   +-- audit.js                   EC-only audit trail queries
|
|-- fabric/
|   +-- gateway.js                 Hyperledger Fabric gateway connection manager
|
|-- middleware/                    API key authentication middleware
|-- scripts/                       Admin utilities: connection profile builder, CA enrollment
|-- tests/                         Attack simulation suite (double-voting, replay, etc.)
|
|-- evoting-frontend/
|   +-- src/
|       |-- App.js                 React application entry point and router
|       |-- pages/
|       |   |-- VoterBooth.jsx     Multi-step guided voting interface
|       |   |-- AdminDashboard.jsx Full election lifecycle management panel
|       |   |-- AdminLogin.jsx     EC authentication portal
|       |   |-- PublicResults.jsx  Unauthenticated live results viewer
|       |   |-- ResultsPage.jsx    Detailed constituency results
|       |   |-- CandidatesPage.jsx Candidate listing per constituency
|       |   |-- ConstituencyPage.jsx Constituency detail and status
|       |   +-- AuditPage.jsx      Administrative audit trail viewer
|       |-- services/
|       |   |-- api.js             HTTP client for backend communication
|       |   +-- blindSignature.js  Client-side RSA blind signature implementation
|       |-- components/            Shared UI components
|       +-- styles.css             Application design system
|
|-- fabric-samples/
|   +-- test-network/              Hyperledger Fabric test network configuration
|
|-- SETUP_GUIDE.md                 Comprehensive step-by-step deployment instructions
+-- wsl_*.sh                       WSL shell scripts for system lifecycle management
```

---

## 8. API Reference

### 8.1 Election Commission Endpoints

> All endpoints below require the HTTP header: `x-api-key: <EC_API_KEY>`

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `POST` | `/api/admin/constituency` | Register a new constituency | `{ id, name, state }` |
| `POST` | `/api/admin/constituency/:id/start` | Open election for constituency | — |
| `POST` | `/api/admin/constituency/:id/end` | Close election for constituency | — |
| `POST` | `/api/admin/candidate` | Register a candidate | `{ id, name, party, constituencyId }` |
| `POST` | `/api/voter/register` | Register an eligible voter | `{ epicId, constituencyId, name }` |
| `GET` | `/api/audit/voter/:epic` | Retrieve voter activity log | — |
| `GET` | `/api/audit/votes/:constituencyId` | Retrieve all votes for a constituency | — |

### 8.2 Public / Voter Booth Endpoints

> No authentication required.

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `GET` | `/api/voter/public-key` | Retrieve the RSA public key for token blinding | — |
| `POST` | `/api/voter/blind-sign` | Submit blinded token for EC signature | `{ epicId, blindedToken }` |
| `POST` | `/api/voter/vote` | Submit anonymous vote | `{ token, signature, candidateId }` |
| `GET` | `/api/results/:constituencyId` | Query live vote tallies | — |
| `GET` | `/api/results/constituency/:id` | Query constituency metadata and election status | — |
| `GET` | `/api/results/:id/votes` | Query all vote records for a constituency | — |
| `GET` | `/health` | Backend service liveness check | — |

---

## 9. Deployment Guide

### 9.1 System Requirements

| Requirement | Specification |
|---|---|
| Operating System | Windows 10 (Build 19041+) or Windows 11 |
| Subsystem | WSL 2 with Ubuntu distribution |
| Container Runtime | Docker Desktop (latest stable) |
| Node.js | Version 18.x (installed in WSL via nvm) |
| Disk Space | Minimum 10 GB free (for Docker images and Fabric binaries) |

> **Note:** Docker Desktop must be in a Running state before executing any of the following steps.

### 9.2 Environment Configuration

Clone the repository and configure the `.env` file at the project root:

```
FABRIC_SAMPLES_PATH=/mnt/c/projects/chain/fabric-samples
PORT=3000
CHANNEL_NAME=mychannel
CHAINCODE_NAME=evoting
```

> WSL path convention: `C:\projects\chain` becomes `/mnt/c/projects/chain`

### 9.3 Blockchain Network Initialization

**Download Fabric binaries and Docker images:**

```powershell
wsl bash -c "cd /mnt/c/projects/chain/fabric-samples && curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/master/scripts/bootstrap.sh && bash bootstrap.sh 2.5.15 1.5.17 -d -s"

wsl docker pull hyperledger/fabric-nodeenv:2.5
```

**Deploy the blockchain network (orderer, peers, CAs, channel, chaincode):**

```powershell
wsl bash -c "cd /mnt/c/projects/chain/fabric-samples/test-network && bash deploy.sh"
```

Expected output upon success:
```
==========================================
  DEPLOYMENT COMPLETE
==========================================
```

### 9.4 Backend Initialization

```powershell
# Build connection profile and enroll the admin identity with the Certificate Authority
wsl bash -c "bash /mnt/c/projects/chain/wsl_setup.sh"

# Start the backend API server (maintain this terminal session)
wsl bash -c "bash /mnt/c/projects/chain/wsl_start.sh"
```

Service available at: `http://localhost:3000/health`

### 9.5 Frontend Initialization

Open a second terminal session:

```powershell
wsl bash -c "bash /mnt/c/projects/chain/wsl_frontend.sh"
```

Application available at: `http://localhost:3001`

### 9.6 Post-Deployment Verification

| Endpoint | Expected Response |
|---|---|
| `GET http://localhost:3000/health` | `{ "status": "UP", ... }` |
| `http://localhost:3001` | Frontend application loads |

**Default Election Commission API Key:** `EC-NATIONAL-2024`
*(This value should be rotated prior to any real-world evaluation or demonstration.)*

---

## 10. Security Considerations

### 10.1 Implemented Protections

| Threat | Mitigation |
|---|---|
| Voter impersonation | EPIC ID verification at blind-sign step; each voter receives exactly one signature |
| Double voting | Token uniqueness enforced at chaincode level; duplicate token submission is rejected |
| Vote manipulation | All votes committed to immutable blockchain; retroactive modification is not possible |
| Unauthorized admin access | All EC endpoints gated by API key middleware |
| Traffic interception | CORS configured; HTTPS recommended for any external deployment |
| Vote-identity linkage | Blind signature protocol ensures cryptographic unlinkability |

### 10.2 Known Limitations and Mitigations Required Before Production

| Limitation | Recommended Mitigation |
|---|---|
| Solo orderer (single point of failure) | Replace with Raft-based multi-node orderer for production |
| API key authentication | Replace with certificate-based mutual TLS (mTLS) for EC client auth |
| No formal third-party security audit | Independent penetration testing and cryptographic review required |
| No hardware security module (HSM) | EC private key should be stored in an HSM for key material protection |
| Prototype-grade RSA key management | Implement a full PKI with certificate rotation and revocation |

---

## 11. Scalability and Limitations

### 11.1 Current Architecture

The current deployment uses a single-organization Hyperledger Fabric network with a Solo orderer, suitable for demonstration and research purposes. Throughput is bounded by:

- Fabric block cut parameters (default: 500ms block timeout)
- CouchDB query performance on the world state
- Node.js single-threaded event loop on the backend

### 11.2 Production Scaling Considerations

| Concern | Approach |
|---|---|
| Multi-constituency parallelism | Separate channels per state, or parallel chaincode invocations |
| High voter throughput | Raft-based multi-orderer cluster; peer pool with load balancing |
| Horizontal backend scaling | Stateless Express API — horizontally scalable behind a load balancer |
| State database | CouchDB cluster or external database for world state replication |
| Frontend delivery | CDN-hosted static React build; edge caching for results pages |

### 11.3 Stated Limitations

- The prototype uses a two-party trust model (EC and voters). A production deployment should involve multiple verifiable trust anchors.
- The blind signature scheme uses a single RSA keypair. Threshold signing should be considered for distributed key management.
- The system does not currently implement a voter-facing receipt or independent verification mechanism (end-to-end verifiability). This is an identified area for future research.

---

## 12. Compliance and Regulatory Notes

This prototype is designed with awareness of the following frameworks, though it does not claim formal compliance without independent audit:

| Framework / Act | Relevance |
|---|---|
| **IT Act, 2000 (India)** | Electronic records and digital signatures as legally valid instruments |
| **Personal Data Protection (Draft)** | Voter identity data is not stored with vote records; anonymity is cryptographically enforced |
| **Election Commission of India — EVM Guidelines** | System is designed to enforce one-voter-one-vote; results are independently verifiable |
| **CERT-In Guidelines** | Security practices for critical information infrastructure should be reviewed |

> **Disclaimer:** This system is presented as a research prototype. Any use in an official electoral context would require evaluation, certification, and approval by the Election Commission of India and relevant statutory bodies.

---

## 13. Testing

### 13.1 Attack Simulation Suite

```bash
npm run simulate
```

The simulation suite tests the following adversarial scenarios:

- Double vote attempt using the same EPIC ID
- Replay attack using a previously submitted token
- Forged signature submission
- Vote submission to a non-existent or closed constituency
- Unauthorized admin action without API key

### 13.2 Manual Test Flow

1. Admin Login → Create Constituency (`CONST_1`, any state)
2. Register Candidate(s) for `CONST_1`
3. Register Voter with EPIC ID `VOTER_001`
4. Start Election for `CONST_1`
5. Navigate to Voter Booth → enter `VOTER_001` → complete voting flow
6. Query `GET /api/results/CONST_1` → verify vote count on ledger
7. End election → verify results are finalized

---

## 14. Roadmap

The following enhancements are identified for future research and development:

| Priority | Enhancement |
|---|---|
| High | Zero-Knowledge Proofs (zk-SNARKs) for vote validity without revealing content |
| High | Multi-organization Fabric network (Org1 — EC, Org2 — Observer) with Raft consensus |
| Medium | End-to-end verifiability: voter receipt and independent verification mechanism |
| Medium | Aadhaar-based voter authentication integration |
| Medium | Hardware Security Module (HSM) integration for key material protection |
| Low | Progressive Web App (PWA) for booth tablet deployment |
| Low | REST API documentation via OpenAPI 3.0 specification |
| Low | Dockerized single-command deployment for evaluation environments |

---

## 15. References

1. Chaum, D. (1983). *Blind signatures for untraceable payments.* Advances in Cryptology — CRYPTO '82. Springer, New York.
2. Hyperledger Fabric Documentation. (2024). *Hyperledger Fabric v2.5.* https://hyperledger-fabric.readthedocs.io/
3. Election Commission of India. *Electronic Voting Machines — Frequently Asked Questions.* https://eci.gov.in
4. Benaloh, J., & Tuinstra, D. (1994). *Receipt-free secret-ballot elections.* Proceedings of the 26th Annual ACM Symposium on Theory of Computing.
5. Adida, B. (2008). *Helios: Web-based Open-Audit Voting.* USENIX Security Symposium.
6. Ministry of Electronics and Information Technology, Government of India. *The Information Technology Act, 2000.*

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

*Developed as an academic research project. March 2026.*
