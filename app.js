'use strict';

/**
 * app.js — National E-Voting Backend
 *
 * Commands:
 *   npm run setup     → builds connection profile + enrolls admin
 *   npm start         → starts server
 *   npm run simulate  → runs Day 4 attack simulation suite
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const adminRoutes = require('./routes/admin');
const voterRoutes = require('./routes/voter');
const resultsRoutes = require('./routes/results');
const auditRoutes = require('./routes/audit');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(morgan('[:date[iso]] :method :url :status :response-time ms'));

// ── Health ─────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        service: 'National E-Voting Backend',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        fabric: {
            channel: process.env.CHANNEL_NAME || 'mychannel',
            chaincode: process.env.CHAINCODE_NAME || 'evoting'
        }
    });
});

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/admin', adminRoutes);    // EC-only: constituency + candidate mgmt
app.use('/api/voter', voterRoutes);    // voter registration + casting vote
app.use('/api/results', resultsRoutes);  // public results + constituency status
app.use('/api/audit', auditRoutes);    // EC-only: audit trail

// ── 404 ────────────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.path}` });
});

// ── Error handler ──────────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
    console.error('[Error]', err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

// ── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log('║        NATIONAL E-VOTING SYSTEM — BACKEND           ║');
    console.log('╚══════════════════════════════════════════════════════╝');
    console.log(`\n  🌐  http://localhost:${PORT}/health\n`);
    console.log('  ── ELECTION COMMISSION (needs x-api-key header) ──');
    console.log('  POST  /api/admin/constituency          create constituency');
    console.log('  POST  /api/admin/constituency/:id/start  start election');
    console.log('  POST  /api/admin/constituency/:id/end    end election');
    console.log('  POST  /api/admin/candidate             register candidate');
    console.log('  POST  /api/voter/register              register voter');
    console.log('  GET   /api/voter/history/:epic         voter audit trail');
    console.log('  GET   /api/audit/voter/:epic           voter history');
    console.log('  GET   /api/audit/votes/:id             all votes in constituency');
    console.log('\n  ── PUBLIC (booth terminals — Blind Signature Flow) ──');
    console.log('  GET   /api/voter/public-key             get RSA public key');
    console.log('  POST  /api/voter/blind-sign             get blinded token signed');
    console.log('  POST  /api/voter/vote                  cast anonymous vote');
    console.log('  GET   /api/results/:constituencyID     live results');
    console.log('  GET   /api/results/constituency/:id    constituency status');
    console.log('  GET   /api/results/:id/votes           vote records\n');
});

module.exports = app;
