# 🗳️ National E-Voting Blockchain System — Project Report

---

## 1. Problem Statement

Traditional voting systems face critical challenges that undermine democratic integrity:

*   **Voter fraud & rigging:** Duplicate voting, booth capturing, and ballot tampering.
*   **Lack of transparency:** Voters cannot independently verify that their vote was counted correctly.
*   **Centralized control:** Single point of failure; manipulation by insiders is possible.
*   **Delayed results:** Manual counting introduces delays and human error.
*   **No audit trail:** Once an election is over, forensic verification is nearly impossible.

This project addresses these issues by building a **decentralized, tamper-proof e-voting system** powered by **Hyperledger Fabric blockchain**, ensuring **transparency, immutability, and verifiability** of every vote cast at a national scale.

---

## 2. Objectives

1.  **Eliminate duplicate voting** — Enforce one-person-one-vote via cryptographic hashing and on-chain state checks.
2.  **Ensure vote immutability** — Every vote is a blockchain transaction that cannot be altered or deleted.
3.  **Provide a full audit trail** — Election Commission observers can trace the complete history of any voter or constituency.
4.  **Role-based access control** — Only the Election Commission (EC) can create constituencies, register candidates/voters, and start/end elections.
5.  **Real-time results** — Public-facing result queries read directly from the blockchain ledger.
6.  **Cross-constituency protection** — Voters can only cast votes for candidates in their registered constituency.
7.  **Election lifecycle management** — Constituencies go through `CREATED` → `VOTING` → `CLOSED` phases, and votes are only accepted during the `VOTING` phase.

---

## 3. System Architecture

The system follows a three-tier architecture:

### Presentation Layer
*   **Technology:** React.js SPA (port 3001)
*   **Responsibility:** User interface for voters, public results, and the admin dashboard.

### Application Layer
*   **Technology:** Express.js API (port 3000)
*   **Responsibility:** REST endpoints, authentication middleware, and Fabric SDK gateway.

### Data / Blockchain Layer
*   **Technology:** Hyperledger Fabric (Docker containers)
*   **Responsibility:** Immutable ledger, smart contract execution (chaincode), and consensus ordering.

---

## 4. Technology Stack

**Backend:**
*   Node.js (v18.x)
*   Express.js (v4.18.2)
*   fabric-network SDK (v2.2.20)
*   fabric-ca-client (v2.2.20)

**Frontend:**
*   React.js (v18.2.0)
*   React Router DOM (v6.22.0)
*   Axios (v1.6.7)

**Blockchain:**
*   Hyperledger Fabric (v2.5.15)
*   Hyperledger Fabric CA (v1.5.17)
*   Docker & Docker Compose

---

## 5. Key Blockchain Concepts Used

### 5.1 Permissioned Blockchain (Hyperledger Fabric)
Unlike public blockchains (e.g., Bitcoin), Fabric is a permissioned network. All participants have known identities via X.509 certificates. There is no cryptocurrency or mining.

### 5.2 Smart Contracts (Chaincode)
The business logic (`EvotingContract`) is deployed to the Fabric peer nodes. It defines what data can be stored (voters, candidates, votes) and what operations are permitted.

### 5.3 SHA-256 Hashing for Voter Privacy
Voter EPIC numbers are never stored in plaintext. They are hashed using SHA-256 before being written to the ledger to protect voter identities.

### 5.4 Membership Service Provider (MSP)
Every transaction is tied to an MSP identity. The chaincode enforces that only `Org1MSP` (The Election Commission) can register voters and manage elections.

### 5.5 Deterministic Timestamps
The chaincode uses the transaction timestamp provided by the blockchain protocol to ensure all peers agree on the exact time a vote was cast.

---

## 6. Smart Contract Design

The `EvotingContract` stores four main data entities on the ledger:
1.  **Constituency:** ID, State ID, Election Phase.
2.  **Candidate:** ID, Name, Party, Constituency ID, Vote Count.
3.  **Voter:** Hashed EPIC, Constituency ID, Registered MSP, Voted Status.
4.  **Vote Record:** Vote Transaction ID, Candidate ID, Constituency ID, Timestamp.

### Vote Validation Pipeline
When a vote is cast, the smart contract performs 5 strict checks:
1.  Does the voter exist?
2.  Is the voter active and eligible?
3.  Has the voter already voted? (Duplicate check)
4.  Are the voter and candidate in the same constituency? (Cross-voting check)
5.  Is the election phase set to `VOTING`?

If all checks pass, the vote is recorded, the candidate's count increments, and the voter is marked as having voted.

---

## 7. REST API Reference

**Admin Endpoints (Requirement: `x-api-key` header)**
*   `POST /api/admin/constituency` — Create a new constituency.
*   `POST /api/admin/constituency/:id/start` — Start an election (`VOTING` phase).
*   `POST /api/admin/constituency/:id/end` — End an election (`CLOSED` phase).
*   `POST /api/admin/candidate` — Register a candidate.
*   `POST /api/voter/register` — Register a voter.
*   `GET /api/voter/history/:epic` — View a voter's audit trail.
*   `GET /api/audit/votes/:id` — View all vote records for a constituency.

**Public Endpoints (No Auth needed)**
*   `POST /api/voter/vote` — Cast a vote.
*   `GET /api/results/:constituencyID` — Fetch live election results.
*   `GET /api/results/constituency/:id` — Fetch constituency status.

---

## 8. Development & Setup Plan

To run this project from a fresh environment, follow these steps:

### Phase 1: Environment Setup
1.  Install WSL 2 (Windows Subsystem for Linux), Docker Desktop (with WSL integration enabled), and Node.js v18 in WSL.
2.  Clone the repository and run `bash bootstrap.sh` in the `fabric-samples` directory to pull Hyperledger binaries.

### Phase 2: Deploy Blockchain Network
1.  Navigate to `fabric-samples/test-network`.
2.  Run `bash deploy.sh` to tear down old networks, start the Fabric CA, create the `mychannel` channel, and deploy the `evoting` chaincode.

### Phase 3: Start Node.js Backend
1.  Run `npm run setup` to generate the `connection-org1.json` profile and enroll the admin identity into the local wallet.
2.  Run `npm start` to launch the Express.js server on port 3000.

### Phase 4: Start React Frontend
1.  Navigate to the `evoting-frontend` directory.
2.  Run `npm install` followed by `npm start`.
3.  The frontend will be available at `http://localhost:3001`.

### Verification & Testing
Run the automated failure simulation suite (`npm run simulate`) to verify that the blockchain correctly rejects duplicate votes, out-of-phase votes, and unauthorized admin actions.
