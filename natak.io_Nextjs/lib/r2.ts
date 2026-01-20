import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Sanitize Endpoint (remove bucket name if present)
const bucketName = process.env.R2_BUCKET_NAME || '';
let endpoint = process.env.R2_ENDPOINT || '';

if (endpoint.endsWith('/')) endpoint = endpoint.slice(0, -1);
if (bucketName && endpoint.endsWith(bucketName)) {
    endpoint = endpoint.slice(0, -bucketName.length);
}
if (endpoint.endsWith('/')) endpoint = endpoint.slice(0, -1);

if (!endpoint.startsWith('https://')) {
    endpoint = `https://${endpoint}`;
}

console.log('[R2] Initializing Client with Endpoint:', endpoint);

const s3Client = new S3Client({
    region: "auto",
    endpoint: endpoint,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

export const getPresignedUploadUrl = async (key: string, contentType: string) => {
    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        ContentType: contentType,
    });

    // 1-hour expiration for upload window
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

export const uploadFileToR2 = async (key: string, buffer: Buffer, contentType: string) => {
    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: contentType,
    });

    await s3Client.send(command);

    // Construct public URL - assumes R2_PUBLIC_DOMAIN is set or bucket is public
    // If R2_PUBLIC_DOMAIN is not set, we return null or a warning
    const publicDomain = process.env.R2_PUBLIC_DOMAIN || "https://pub-r2.natak.io";
    return `${publicDomain}/${key}`;
};

export const deleteFileFromR2 = async (key: string) => {
    const command = new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
    });

    try {
        await s3Client.send(command);
        return true;
    } catch (error) {
        console.error("Error deleting from R2:", error);
        return false;
    }
};
