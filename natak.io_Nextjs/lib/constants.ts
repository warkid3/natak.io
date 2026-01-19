import { JobStatus } from './types';

export const COLORS = {
    ACID_LIME: '#DFFF00',
    CHAOS_RED: '#FF4444',
    DEEP_BLACK: '#000000',
    VOID_GRAY: '#111111',
};

export const STATUS_COLORS: Record<JobStatus, string> = {
    [JobStatus.PROCESSING]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    [JobStatus.FAILED]: 'bg-red-500/10 text-red-400 border-red-500/20',
    [JobStatus.QUEUED]: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    [JobStatus.COMPLETED]: 'bg-lime/10 text-lime border-lime/20',
    [JobStatus.PAUSED]: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};
