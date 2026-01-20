import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface SavedPrompt {
    id: string;
    user_id: string;
    prompt: string;
    title: string;
    collection_id?: string;
    generation_type: 'image' | 'video' | 'motion_control';
    tags?: string[];
    source_job_id?: string;
    model_config?: any;
    is_public: boolean;
    share_token: string;
    created_at: string;
    updated_at: string;
    collection?: {
        id: string;
        name: string;
        color: string;
    };
}

export interface PromptCollection {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    color: string;
    created_at: string;
    prompt_count?: number;
}

interface UsePromptsOptions {
    collectionId?: string;
    generationType?: string;
    search?: string;
}

export function usePrompts(userId?: string, options: UsePromptsOptions = {}) {
    const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
    const [collections, setCollections] = useState<PromptCollection[]>([]);
    const [totalPrompts, setTotalPrompts] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPrompts = useCallback(async () => {
        if (!userId) return;

        try {
            const params = new URLSearchParams();
            if (options.collectionId) params.append('collection_id', options.collectionId);
            if (options.generationType) params.append('generation_type', options.generationType);
            if (options.search) params.append('search', options.search);

            const res = await fetch(`/api/prompts?${params.toString()}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setPrompts(data.prompts || []);
        } catch (err: any) {
            setError(err.message);
            console.error('Error fetching prompts:', err);
        }
    }, [userId, options.collectionId, options.generationType, options.search]);

    const fetchCollections = useCallback(async () => {
        if (!userId) return;

        try {
            const res = await fetch('/api/prompts/collections');
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setCollections(data.collections || []);
            setTotalPrompts(data.totalPrompts || 0);
        } catch (err: any) {
            setError(err.message);
            console.error('Error fetching collections:', err);
        }
    }, [userId]);

    const refresh = useCallback(async () => {
        setLoading(true);
        await Promise.all([fetchPrompts(), fetchCollections()]);
        setLoading(false);
    }, [fetchPrompts, fetchCollections]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const savePrompt = async (promptData: {
        prompt: string;
        title?: string;
        collectionId?: string;
        generationType?: 'image' | 'video' | 'motion_control';
        sourceJobId?: string;
        modelConfig?: any;
        tags?: string[];
    }) => {
        try {
            const res = await fetch('/api/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(promptData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            await refresh();
            return { success: true, prompt: data.prompt };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const updatePrompt = async (id: string, updates: {
        title?: string;
        collectionId?: string;
        tags?: string[];
        isPublic?: boolean;
    }) => {
        try {
            const res = await fetch(`/api/prompts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            await refresh();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const deletePrompt = async (id: string) => {
        try {
            const res = await fetch(`/api/prompts/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            await refresh();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const createCollection = async (name: string, description?: string, color?: string) => {
        try {
            const res = await fetch('/api/prompts/collections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, color })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            await fetchCollections();
            return { success: true, collection: data.collection };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const deleteCollection = async (id: string) => {
        try {
            const res = await fetch(`/api/prompts/collections/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            await refresh();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    return {
        prompts,
        collections,
        totalPrompts,
        loading,
        error,
        refresh,
        savePrompt,
        updatePrompt,
        deletePrompt,
        createCollection,
        deleteCollection
    };
}
