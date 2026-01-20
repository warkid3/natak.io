import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Asset } from '@/types';

export function useAssets(userId?: string) {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    const fetchAssets = useCallback(async () => {
        if (!userId) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('assets')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAssets(data as Asset[] || []);
        } catch (err: any) {
            console.error('Error fetching assets:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userId, supabase]);

    useEffect(() => {
        fetchAssets();

        // Real-time subscription for new assets
        if (userId) {
            const channel = supabase
                .channel('assets_changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'assets',
                        filter: `user_id=eq.${userId}`
                    },
                    (payload) => {
                        console.log('Real-time asset update:', payload);
                        fetchAssets(); // Refresh on any change for simplicity
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [userId, fetchAssets, supabase]);

    return { assets, loading, error, refresh: fetchAssets };
}
