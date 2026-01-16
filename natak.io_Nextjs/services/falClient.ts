/**
 * Fal.ai API Client
 * Centralized client for all Fal.ai API calls with sync/async support
 */

const FAL_KEY = process.env.FAL_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Fal.ai Endpoints
export const FAL_ENDPOINTS = {
    // Image Generation
    ZIMAGE_TURBO_LORA: 'fal-ai/z-image/turbo/lora',
    ZIMAGE_TURBO_INPAINT: 'fal-ai/z-image/turbo/inpaint',

    // Preprocessing
    SAM3_SEGMENT: 'fal-ai/sam-3/image',
    DWPOSE: 'fal-ai/dwpose',
    DEPTH_MAP: 'fal-ai/imageutils/depth',

    // Post-processing
    SEEDVR_UPSCALE: 'fal-ai/seedvr/upscale/image',

    // Video
    LTX_VIDEO_V2: 'fal-ai/ltx-video/v2',

    // Animation
    WAN_ANIMATE: 'fal-ai/wan/v2.2-14b/animate/move',

    // Training
    ZIMAGE_TRAINER: 'fal-ai/z-image-trainer',
};

interface FalResult<T = any> {
    data: T;
    requestId?: string;
}

interface FalQueueStatus {
    status: 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    response_url?: string;
    logs?: any[];
}

/**
 * Make a synchronous Fal.ai API call
 * Best for fast operations (<30s): image gen, upscale, segmentation
 */
export async function falRun<T = any>(
    endpoint: string,
    input: Record<string, any>
): Promise<FalResult<T>> {
    const url = `https://fal.run/${endpoint}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Key ${FAL_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || error.detail || `Fal API Error: ${response.status}`);
    }

    return { data: await response.json() };
}

/**
 * Submit a job to Fal.ai queue (async)
 * Returns request ID for polling or webhook
 * Best for long operations: video, training
 */
export async function falQueue(
    endpoint: string,
    input: Record<string, any>,
    webhookUrl?: string
): Promise<{ requestId: string }> {
    const url = `https://queue.fal.run/${endpoint}`;

    const body: any = { ...input };
    if (webhookUrl) {
        body.webhook_url = webhookUrl;
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Key ${FAL_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Fal Queue Error: ${response.status}`);
    }

    const data = await response.json();
    return { requestId: data.request_id };
}

/**
 * Check status of a queued job
 */
export async function falStatus(
    endpoint: string,
    requestId: string
): Promise<FalQueueStatus> {
    const url = `https://queue.fal.run/${endpoint}/requests/${requestId}/status`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Key ${FAL_KEY}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to get status: ${response.status}`);
    }

    return await response.json();
}

/**
 * Get result of a completed queued job
 */
export async function falResult<T = any>(
    endpoint: string,
    requestId: string
): Promise<T> {
    const url = `https://queue.fal.run/${endpoint}/requests/${requestId}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Key ${FAL_KEY}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to get result: ${response.status}`);
    }

    return await response.json();
}

/**
 * Poll for job completion (with timeout)
 */
export async function falPollUntilComplete<T = any>(
    endpoint: string,
    requestId: string,
    maxWaitMs = 300000, // 5 minutes
    pollIntervalMs = 2000
): Promise<T> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitMs) {
        const status = await falStatus(endpoint, requestId);

        if (status.status === 'COMPLETED') {
            return await falResult<T>(endpoint, requestId);
        }

        if (status.status === 'FAILED') {
            throw new Error('Fal job failed');
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
    }

    throw new Error('Fal job timed out');
}

/**
 * Generate webhook URL for a job
 */
export function getWebhookUrl(jobId: string, type: 'video' | 'training' | 'animate'): string {
    return `${APP_URL}/api/webhooks/fal/${type}?job_id=${jobId}`;
}

// ============================================
// High-level convenience functions
// ============================================

/**
 * Generate image with Z-Image Turbo + LoRA
 */
export async function generateImage(params: {
    prompt: string;
    loraUrl: string;
    loraScale?: number;
    triggerWord?: string;
    aspectRatio?: string;
    enableSafetyChecker?: boolean;
}) {
    const input: any = {
        prompt: params.triggerWord
            ? `${params.triggerWord}, ${params.prompt}`
            : params.prompt,
        loras: [{
            path: params.loraUrl,
            scale: params.loraScale || 1.0,
        }],
        enable_safety_checker: params.enableSafetyChecker ?? true,
    };

    // Map aspect ratio to Fal format
    if (params.aspectRatio) {
        input.image_size = mapAspectRatio(params.aspectRatio);
    }

    const result = await falRun(FAL_ENDPOINTS.ZIMAGE_TURBO_LORA, input);
    return result.data.images?.[0]?.url || result.data.image?.url;
}

/**
 * Segment clothing from image using SAM-3
 */
export async function segmentClothing(imageUrl: string) {
    const result = await falRun(FAL_ENDPOINTS.SAM3_SEGMENT, {
        image_url: imageUrl,
        prompts: [{ type: 'text', text: 'clothing' }],
    });
    return result.data.masks?.[0] || result.data;
}

/**
 * Inpaint with Z-Image Turbo
 */
export async function inpaintImage(params: {
    imageUrl: string;
    maskUrl: string;
    prompt: string;
}) {
    const result = await falRun(FAL_ENDPOINTS.ZIMAGE_TURBO_INPAINT, {
        image_url: params.imageUrl,
        mask_url: params.maskUrl,
        prompt: params.prompt,
    });
    return result.data.images?.[0]?.url;
}

/**
 * Upscale image with SeedVR
 */
export async function upscaleImage(imageUrl: string, factor = 5) {
    const result = await falRun(FAL_ENDPOINTS.SEEDVR_UPSCALE, {
        image_url: imageUrl,
        upscale_mode: 'factor',
        upscale_factor: factor,
    });
    return result.data.image?.url;
}

/**
 * Generate video with LTX-2 (async with webhook)
 */
export async function generateVideo(params: {
    prompt: string;
    imageUrl?: string;
    jobId: string;
    resolution?: '720p' | '1080p' | '1440p';
    duration?: number;
}) {
    const webhookUrl = getWebhookUrl(params.jobId, 'video');

    const input: any = {
        prompt: params.prompt,
        resolution: params.resolution || '1080p',
        duration_seconds: params.duration || 5,
    };

    if (params.imageUrl) {
        input.image_url = params.imageUrl;
    }

    return await falQueue(FAL_ENDPOINTS.LTX_VIDEO_V2, input, webhookUrl);
}

// Helper to map aspect ratio string to Fal format
function mapAspectRatio(ar: string): string {
    const map: Record<string, string> = {
        '16:9': 'landscape_16_9',
        '9:16': 'portrait_16_9',
        '4:3': 'landscape_4_3',
        '3:4': 'portrait_4_3',
        '2:3': 'portrait_2_3',
        '3:2': 'landscape_3_2',
        '1:1': 'square_hd',
    };
    return map[ar] || 'square_hd';
}
