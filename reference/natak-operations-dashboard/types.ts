
export enum JobStatus {
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  FAILED = 'FAILED',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED'
}

export enum PipelineStep {
  BASE_GEN = 1,
  CLOTH_SWAP = 2,
  UPSCALE = 3,
  VIDEO_PREP = 4,
  FINAL_RENDER = 5
}

export interface Job {
  id: string;
  character: string;
  platform: 'Twitter' | 'Instagram' | 'Client';
  isNSFW: boolean;
  format: 'Photo' | 'Video';
  status: JobStatus;
  currentStep: PipelineStep;
  progress: number; // 0-100
  timestamp: string;
  cost: number;
  error?: string;
  qualityStatus?: 'Pending' | 'Approved' | 'Rejected';
  retryCount: number;
}

export interface OperationalMetrics {
  acceptRate: number;
  refundRate: number;
  avgQCTime: number;
  totalCreditsSpent: number;
  totalCreditsRefunded: number;
  throughput: number; // Jobs/hour
}
