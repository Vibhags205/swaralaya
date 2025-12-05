// server.js (C:\Users\gsvib\Documents\MUSIC\backend\server.js)

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config(); 

// --- CONFIGURATION & INITIALIZATION ---
const PORT = process.env.BACKEND_PORT || 3000; 
const SERVICE_ACCOUNT_FILENAME = process.env.SERVICE_ACCOUNT_PATH || 'serviceAccountKey.json'; // Default to serviceAccountKey.json
// Allow requests from localhost (dev) and from your Vercel domain (production)
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'; 

// Resolve the absolute path to the key file, relative to the server.js file's directory
// __dirname is the directory where server.js lives (MUSIC/backend)
const absoluteKeyPath = path.resolve(__dirname, SERVICE_ACCOUNT_FILENAME);

let db;
let app = express();

try {
    // Try to load service account from file first, then fall back to env var
    let serviceAccount;
    
    try {
        // 1. Try loading from file
        serviceAccount = require(absoluteKeyPath);
        console.log(`✅ Loaded service account from file: ${absoluteKeyPath}`);
    } catch (fileError) {
        // 2. Fall back to environment variable (for Render)
        const serviceAccountJson = process.env.SERVICE_ACCOUNT_JSON;
        if (serviceAccountJson) {
            serviceAccount = JSON.parse(serviceAccountJson);
            console.log(`✅ Loaded service account from SERVICE_ACCOUNT_JSON env var`);
        } else {
            throw new Error(
                `Could not load service account key.\n` +
                `Option 1 (File): Place 'serviceAccountKey.json' in backend/ folder and set SERVICE_ACCOUNT_PATH env var\n` +
                `Option 2 (Env): Set SERVICE_ACCOUNT_JSON env var to your service account JSON string`
            );
        }
    }

    // Initialize Firebase Admin SDK
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore(); // Assign the database reference

} catch (e) {
    console.error(`\n🚨 FATAL ERROR: Could not initialize Firebase`);
    console.error(e.message);
    process.exit(1);
}

// --- MIDDLEWARES ---
// Enable CORS for your frontend URL
app.use(cors({ origin: CLIENT_URL }));
// Enable express to read JSON bodies
app.use(express.json());

// --- THE /api/subscribe ENDPOINT ---
app.post('/api/subscribe', async (req, res) => {
    const { email } = req.body; 

    if (!email || !email.includes('@')) {
        return res.status(400).json({ message: "A valid email is required." });
    }

    try {
        const newSubscriber = {
            email: email,
            subscribedAt: admin.firestore.FieldValue.serverTimestamp() 
        };

        // Save to Firestore, using the email as the document ID to prevent duplicates
        await db.collection('subscribers').doc(email).set(newSubscriber);

        console.log(`New subscriber saved: ${email}`);

        // Success response
        res.status(200).json({ message: "Subscribed Successfully! Thanks for joining." });

    } catch (error) {
        // This catches Firebase permission errors, network issues, etc.
        console.error("FIREBASE WRITE ERROR:", error.message);
        res.status(500).json({ message: "Subscription failed due to server error (check Firebase logs)." });
    }
});


// --- START THE SERVER ---
app.listen(PORT, () => {
    console.log(`\n✅ Backend Server running on http://localhost:${PORT}`);
    console.log(`   Waiting for connections from ${CLIENT_URL}`);
});