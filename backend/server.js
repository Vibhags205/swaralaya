// Load Firebase credentials from env var
const serviceAccountJson = process.env.SERVICE_ACCOUNT_JSON;

if (!serviceAccountJson) {
    console.error("🚨 SERVICE_ACCOUNT_JSON environment variable missing!");
    process.exit(1);
}

let serviceAccount;
try {
    serviceAccount = JSON.parse(serviceAccountJson);
    console.log("✅ Loaded Firebase credentials from SERVICE_ACCOUNT_JSON");
} catch (err) {
    console.error("🚨 Failed to parse SERVICE_ACCOUNT_JSON");
    console.error(err);
    process.exit(1);
}

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

db = admin.firestore();
