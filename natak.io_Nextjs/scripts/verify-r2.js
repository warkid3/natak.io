// scripts/verify-r2.js
// Run with: node scripts/verify-r2.js

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Load env vars from .env.local manually for this independent script
const fs = require('fs');
const path = require('path');
const envPath = path.resolve(__dirname, '../.env.local');

if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split(/\r?\n/).forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#')) return;
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
            process.env[key.trim()] = valueParts.join('=').trim();
        }
    });
} else {
    console.error("❌ .env.local file not found!");
    process.exit(1);
}

const s3Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

async function verifyR2() {
    console.log("--> Verifying Cloudflare R2 Connection...");
    console.log(`Endpoint: ${process.env.R2_ENDPOINT}`);
    console.log(`Bucket:   ${process.env.R2_BUCKET_NAME}`);

    try {
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: 'test-connection.txt',
            ContentType: 'text/plain',
        });

        // Try to generate a signed URL
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        console.log("\n✅ SUCCESS: R2 Connection Established!");
        console.log("Generated Presigned URL for upload:");
        console.log(url);
        console.log("\n(You don't need to actually upload, generating this proves your keys are valid)");
    } catch (error) {
        console.error("\n❌ FAILED: Could not connect to R2.");
        console.error(error.message);
        if (error.name === 'InvalidAccessKeyId') {
            console.error("Hint: Check your R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY.");
        }
    }
}

verifyR2();
