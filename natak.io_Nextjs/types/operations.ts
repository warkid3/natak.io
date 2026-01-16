// Operations Dashboard Types and Constants
// Pipeline step tracking, cost calculation, and QC workflow

export enum PipelineStep {
    BASE_GEN = 1,       // Z-Image Turbo generation
    CLOTH_SWAP = 2,     // Inpainting / cloth replacement
    UPSCALE = 3,        // 5x upscaling
    VIDEO_PREP = 4,     // LTX2 video generation  
    VIDEO_GEN = 5,      // Async video generation/animation
    FINAL_RENDER = 6    // Post-processing / delivery
}

export enum QualityStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

// Cost per pipeline step (in credits)
export const STEP_COSTS = {
    [PipelineStep.BASE_GEN]: 0.02,
    [PipelineStep.CLOTH_SWAP]: 0.03,
    [PipelineStep.UPSCALE]: 0.03,
    [PipelineStep.VIDEO_PREP]: 0.10,
    [PipelineStep.VIDEO_GEN]: 0.00, // Async cost handled by webhook or check
    [PipelineStep.FINAL_RENDER]: 0.00, // No additional cost
} as const;

// Progress percentage per step completion
export const STEP_PROGRESS = {
    [PipelineStep.BASE_GEN]: 20,
    [PipelineStep.CLOTH_SWAP]: 40,
    [PipelineStep.UPSCALE]: 60,
    [PipelineStep.VIDEO_PREP]: 85,
    [PipelineStep.VIDEO_GEN]: 90,
    [PipelineStep.FINAL_RENDER]: 100,
} as const;

// Calculate total cost up to current step
export function calculateJobCost(currentStep: PipelineStep, includeVideo: boolean): number {
    let cost = 0;

    // Sum costs for all completed steps
    for (let step = 1; step <= currentStep; step++) {
        if (step === PipelineStep.VIDEO_PREP && !includeVideo) {
            continue; // Skip video cost if not generating video
        }
        cost += STEP_COSTS[step as PipelineStep] || 0;
    }

    return parseFloat(cost.toFixed(4));
}

// Calculate progress percentage based on current step
export function calculateJobProgress(currentStep: PipelineStep): number {
    return STEP_PROGRESS[currentStep] || 0;
}

// Get step name for UI display
export function getStepName(step: PipelineStep): string {
    const names = {
        [PipelineStep.BASE_GEN]: 'Base Generation',
        [PipelineStep.CLOTH_SWAP]: 'Cloth Swap',
        [PipelineStep.UPSCALE]: 'Upscaling',
        [PipelineStep.VIDEO_PREP]: 'Video Preparation',
        [PipelineStep.VIDEO_GEN]: 'Video Generation',
        [PipelineStep.FINAL_RENDER]: 'Final Render',
    };
    return names[step] || 'Unknown';
}

// Determine platform from config
export function inferPlatform(config: any): 'Twitter' | 'Instagram' | 'Client' {
    // Logic to determine platform from config
    // This is a placeholder - adjust based on actual config structure
    if (config?.platform) return config.platform;
    if (config?.aspectRatio === '9:16') return 'Instagram';
    if (config?.aspectRatio === '16:9') return 'Twitter';
    return 'Client';
}

// Extended Job interface for Operations Dashboard
export interface OperationsJob {
    id: string;
    user_id: string;
    character_id?: string;
    character_name?: string; // Joined from characters table
    platform: 'Twitter' | 'Instagram' | 'Client';
    is_nsfw: boolean;
    format: 'Photo' | 'Video';
    status: 'queued' | 'processing' | 'completed' | 'failed' | 'paused';
    current_step: PipelineStep;
    progress: number; // 0-100
    cost: number;
    quality_status: QualityStatus;
    retry_count: number;
    prompt: string;
    output_url?: string;
    video_url?: string;
    error?: string;
    created_at: string;
}
