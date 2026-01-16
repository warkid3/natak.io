import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT!,
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
    const publicDomain = process.env.R2_PUBLIC_DOMAIN;
    if (publicDomain) {
        return `${publicDomain}/${key}`;
    }
    // Fallback: This might not work if bucket isn't public, but it's the best we can do without a domain
    return `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${key}`;
};
