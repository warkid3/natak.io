export interface WorkflowIssue {
    id: string;
    category: 'calendar' | 'gear' | 'finance' | 'files';
    title: string;
    severity: 'high' | 'medium';
}

export interface KanbanItem {
    id: string;
    thumbnail: string;
    status: 'DONE';
    name: string;
}

export enum JobStatus {
    PROCESSING = 'PROCESSING',
    FAILED = 'FAILED',
    QUEUED = 'QUEUED',
    COMPLETED = 'COMPLETED',
    PAUSED = 'PAUSED',
}

export enum PipelineStep {
    VIDEO_PREP = 1,
    UPSCALE = 2,
    BASE_GEN = 3,
    CLOTH_SWAP = 4,
    FINAL_RENDER = 5,
}

export interface Job {
    id: string;
    character: string;
    platform: string;
    isNSFW: boolean;
    format: 'Video' | 'Photo';
    status: JobStatus;
    currentStep: PipelineStep;
    progress: number;
    timestamp: string;
    cost: number;
    retryCount: number;
    error?: string;
    qualityStatus?: string;
}
