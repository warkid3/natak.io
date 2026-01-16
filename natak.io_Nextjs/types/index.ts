
export type Status = 'scraped' | 'queued' | 'processing' | 'review' | 'posted' | 'failed' | 'archived';

export type PromptingModel = 'Gemini 1.5 Flash' | 'xAI Grok Beta';
export type ImageModel = 'Pony Realism (SDXL)' | 'Nano Banana Pro' | 'Seedream 4.0' | 'Seedream 4.5';
export type VideoModel = 'Kling 2.5 Turbo' | 'Kling 2.6 Pro' | 'Kling Motion Control' | 'Kling O1' | 'Wan 2.2 Animate' | 'Wan 2.5' | 'Wan 2.6' | 'Veo 3.1' | 'LTX-2';

export interface User {
    id: string;
    name?: string;
    email: string;
    tier: 'Starter' | 'Pro' | 'Agency' | 'Operator' | 'Director' | 'Executive';
    credits: number;
    avatar_url?: string;
    timezone?: string;
    theme?: string;
}

export interface Transaction {
    id: string;
    type: 'debit' | 'credit';
    amount: number;
    description: string;
    timestamp: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'job' | 'system' | 'billing';
    read: boolean;
    link?: string;
    timestamp: string;
}

export interface Ticket {
    id: string;
    subject: string;
    status: 'open' | 'closed' | 'pending';
    category: 'billing' | 'technical' | 'general';
    timestamp: string;
}

export interface CharacterModel {
    id: string;
    user_id: string;
    name: string;
    trigger_word: string;
    lora_url?: string;
    status: 'training' | 'ready' | 'failed';
    created_at: string;
}

export interface Asset {
    id: string;
    url: string;
    caption: string;
    collection?: string;
    type: 'image' | 'video';
    source: 'scraped' | 'upload';
}

export interface GenerationJob {
    id: string;
    asset_id?: string;
    character_id: string;
    prompting_model: PromptingModel;
    image_model: ImageModel;
    video_model?: VideoModel;
    status: Status;
    is_nsfw: boolean;
    aspect_ratio?: string; // e.g. "16:9"
    clothing_image_url?: string; // URL to uploaded clothing reference
    prompt: string;
    output_url?: string;
    video_url?: string;
    config?: any; // JSONB
    metadata?: any; // JSONB
    created_at: string;
    progress: number;
    error?: string;
    feedback?: string;
}
