# 🗳️ National E-Voting Blockchain — COMPLETE Setup Guide

> Follow this guide EXACTLY step by step. Do NOT skip any step.
> Total time: ~20–30 minutes (mostly downloading).

---

## PART A — INSTALL PREREQUISITES (One-Time Setup)

Your friend's laptop needs these 3 things installed BEFORE doing anything else.

---

### A1. Install WSL 2 (Windows Subsystem for Linux)

1. Open **PowerShell as Administrator**
   - Press `Win` key → type `PowerShell` → Right-click → **Run as Administrator**
2. Run this command:
   ```
   wsl --install
   ```
3. **RESTART the laptop** when prompted.
4. After restart, a terminal will open asking to create a **Linux username and password**.
   - Pick any username (e.g., `user`)
   - Pick any password (e.g., `1234`) — you'll need this later
5. Verify it worked — open PowerShell and run:
   ```
   wsl --status
   ```
   It should say "Default Distribution: Ubuntu"

---

### A2. Install Docker Desktop

1. Download from: **https://www.docker.com/products/docker-desktop/**
2. Run the installer → click **Yes** to everything → **Restart** if it asks.
3. After restart, **open Docker Desktop** — wait until the bottom-left shows a **green "Running"** status.
4. Go to Docker Desktop → **Settings** (⚙️ gear icon) → **Resources** → **WSL Integration**
   - Toggle ON your Ubuntu distro
   - Click **Apply & Restart**
5. Verify it works — open PowerShell and run:
   ```
   wsl docker --version
   ```
   Should show something like `Docker version 29.x.x`

> ⚠️ **Docker Desktop MUST be running** every time you want to use this project.

---

### A3. Install Git for Windows

1. Download from: **https://git-scm.com/download/win**
2. Run the installer → click **Next** on everything → Install
3. Verify — open PowerShell and run:
   ```
   git --version
   ```

---

## PART B — COPY THE PROJECT

---

### B1. Get the ZIP file

Your friend should have sent you a `.zip` file of the project.

1. Copy the ZIP file to your laptop
2. Extract/Unzip it to `D:\chain`
   - Right-click the ZIP → **Extract All** → change path to `D:\chain`
3. After extracting, you should see this folder structure:
   ```
   D:\chain\
   ├── app.js
   ├── package.json
   ├── .env
   ├── SETUP_GUIDE.md        ← This file!
   ├── deploy.sh              (may not be here, that's OK)
   ├── wsl_setup.sh
   ├── wsl_start.sh
   ├── wsl_frontend.sh
   ├── evoting-chaincode\
   ├── evoting-frontend\
   ├── fabric-samples\
   │   └── test-network\
   ├── routes\
   ├── middleware\
   └── scripts\
   ```

---

### B2. Edit the `.env` file

1. Open the file `D:\chain\.env` in Notepad
2. Find this line:
   ```
   FABRIC_SAMPLES_PATH=/mnt/d/chain/fabric-samples
   ```
3. **If your project is at `D:\chain`** → leave it as is ✅
4. **If your project is somewhere else** (e.g., `C:\Users\John\chain`) → change it to:
   ```
   FABRIC_SAMPLES_PATH=/mnt/c/Users/John/chain/fabric-samples
   ```
   Rule: Replace `D:\` with `/mnt/d/`, `C:\` with `/mnt/c/`, and use `/` instead of `\`

---

## PART C — INSTALL NODE.JS IN WSL

---

### C1. Install NVM (Node Version Manager)

Open **PowerShell** and run:
```
wsl bash -c "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash"
```

### C2. Install Node.js version 18

Create a small helper script. Open **PowerShell** and run:
```
wsl bash -c "export NVM_DIR=`$HOME/.nvm && [ -s `$NVM_DIR/nvm.sh ] && . `$NVM_DIR/nvm.sh && nvm install 18"
```

If that gives errors, do it manually:
1. Open a WSL terminal: type `wsl` in PowerShell and press Enter
2. Run these 3 commands one by one:
   ```bash
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
   nvm install 18
   ```
3. Type `exit` to go back to PowerShell

### C3. Verify Node.js is installed

Open WSL (`wsl` in PowerShell) and run:
```bash
node --version
```
Should show `v18.x.x`. Type `exit` to go back.

---

## PART D — DOWNLOAD BLOCKCHAIN BINARIES & DOCKER IMAGES

---

### D1. Download Fabric binaries

Open **PowerShell** and run:
```
wsl bash -c "cd /mnt/d/chain/fabric-samples && curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/master/scripts/bootstrap.sh && bash bootstrap.sh 2.5.15 1.5.17 -d -s"
```

⏱️ Wait ~5–10 minutes. You'll see lots of download progress bars.

At the end you should see:
```
===> List out hyperledger docker images
hyperledger/fabric-peer     ...
hyperledger/fabric-orderer  ...
hyperledger/fabric-ccenv    ...
hyperledger/fabric-baseos   ...
hyperledger/fabric-ca       ...
```

### D2. Pull the Node.js chaincode builder image

```
wsl docker pull hyperledger/fabric-nodeenv:2.5
```

⏱️ Wait ~1–2 minutes.

### D3. Clone the missing test-network scripts (if needed)

```
wsl bash -c "git clone --depth 1 https://github.com/hyperledger/fabric-samples.git /tmp/fs-temp && cp -r /tmp/fs-temp/test-network/scripts /mnt/d/chain/fabric-samples/test-network/ && cp -r /tmp/fs-temp/test-network/configtx /mnt/d/chain/fabric-samples/test-network/ && rm -rf /tmp/fs-temp"
```

---

## PART E — DEPLOY THE BLOCKCHAIN (One Command!)

---

### E1. Run the deploy script

Open **PowerShell** and run:
```
wsl bash -c "sed -i 's/\r$//' /mnt/d/chain/fabric-samples/test-network/deploy.sh && cd /mnt/d/chain/fabric-samples/test-network && bash deploy.sh"
```

⏱️ Wait ~3–5 minutes.

You should see this at the end:
```
==========================================
  ✅ DEPLOYMENT COMPLETE!
==========================================
```

**If it fails**, check the Troubleshooting section at the bottom.

---

## PART F — SETUP & START THE BACKEND

---

### F1. Install backend dependencies + enroll admin

Open **PowerShell** and run:
```
wsl bash -c "sed -i 's/\r$//' /mnt/d/chain/wsl_setup.sh && bash /mnt/d/chain/wsl_setup.sh"
```

You should see:
```
✅ Written: /mnt/d/chain/connection-org1.json
✅ Admin enrolled → wallet: /mnt/d/chain/wallet
```

### F2. Start the backend server

```
wsl bash -c "sed -i 's/\r$//' /mnt/d/chain/wsl_start.sh && bash /mnt/d/chain/wsl_start.sh"
```

You should see:
```
╔══════════════════════════════════════════════════════╗
║        NATIONAL E-VOTING SYSTEM — BACKEND           ║
╚══════════════════════════════════════════════════════╝

  🌐  http://localhost:3000/health
```

**⚠️ Keep this PowerShell window open! Don't close it.**

---

## PART G — START THE FRONTEND

---

### G1. Open a NEW PowerShell window

Press `Win` key → type `PowerShell` → open a **new** window.

### G2. Start the frontend

```
wsl bash -c "sed -i 's/\r$//' /mnt/d/chain/wsl_frontend.sh && bash /mnt/d/chain/wsl_frontend.sh"
```

⏱️ Wait ~3–5 minutes for the first compile.

You should see:
```
Compiled successfully!

  Local:            http://localhost:3001
```

### G3. Open the website

Open your browser and go to: **http://localhost:3001**

---

## ✅ YOU'RE DONE! How to Use the App

| URL | What |
|-----|------|
| http://localhost:3001 | Frontend (main website) |
| http://localhost:3000/health | Backend health check |

### Admin Login
- Click **Admin Login** in the top-right corner of the website
- API Key: **`EC-NATIONAL-2024`**

### Quick Test:
1. Login as Admin → Create a Constituency (e.g., ID: `CONST_1`)
2. Register a Candidate for that constituency
3. Register a Voter (e.g., EPIC ID: `VOTER_1`)
4. Start the Election for that constituency
5. Click **Vote Now** → enter `VOTER_1` → cast your vote
6. Go to homepage → search `CONST_1` → see live blockchain results!

---

## 🔧 Troubleshooting

| Error | Solution |
|-------|----------|
| `wsl --install` does nothing | Enable "Virtual Machine Platform" in Windows Features |
| Docker Desktop won't start | Enable "Virtualization" in BIOS settings |
| `docker: command not found` in WSL | Docker Desktop → Settings → WSL Integration → enable Ubuntu |
| `scripts/utils.sh not found` | Run Part D Step 3 again |
| `Peer binary not found` | Run Part D Step 1 again |
| `jq: command not found` | The deploy script handles this automatically, OR run: `wsl sudo apt install -y jq` |
| `fabric-nodeenv:2.5 not found` | Run: `wsl docker pull hyperledger/fabric-nodeenv:2.5` |
| `npm: command not found` | Run Part C again (install Node.js) |
| `FABRIC_SAMPLES_PATH` error | Edit `.env` file — must use `/mnt/d/...` path, not `D:\...` |
| Backend shows port already in use | Close all PowerShell windows and retry |
| Frontend won't compile | Delete `node_modules`: `Remove-Item -Recurse d:\chain\evoting-frontend\node_modules` and re-run Part G |

---

## 🔄 How to Restart Everything (After Laptop Reboot)

Every time you restart the laptop, do these steps:

1. **Open Docker Desktop** — wait for green "Running" status
2. **Deploy blockchain** (PowerShell):
   ```
   wsl bash -c "cd /mnt/d/chain/fabric-samples/test-network && bash deploy.sh"
   ```
3. **Start backend** (same PowerShell):
   ```
   wsl bash -c "bash /mnt/d/chain/wsl_start.sh"
   ```
4. **Start frontend** (NEW PowerShell window):
   ```
   wsl bash -c "bash /mnt/d/chain/wsl_frontend.sh"
   ```
5. Open browser → **http://localhost:3001**
