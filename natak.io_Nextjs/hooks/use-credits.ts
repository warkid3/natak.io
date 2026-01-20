import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface CreditInfo {
    credits: number;
    tier: string;
}

export function useCredits(userId?: string) {
    const [info, setInfo] = useState<CreditInfo>({ credits: 0, tier: 'Starter' });
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchCredits = useCallback(async () => {
        if (!userId) return;

        const { data, error } = await supabase
            .from('profiles')
            .select('credits, tier')
            .eq('id', userId)
            .single();

        if (!error && data) {
            setInfo(data as CreditInfo);
        }
        setLoading(false);
    }, [userId, supabase]);

    useEffect(() => {
        fetchCredits();

        // Subscribe to profile changes
        if (userId) {
            const channel = supabase
                .channel('credits_changes')
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'profiles',
                        filter: `id=eq.${userId}`
                    },
                    (payload) => {
                        setInfo(payload.new as CreditInfo);
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [userId, fetchCredits, supabase]);

    return { ...info, loading, refresh: fetchCredits };
}
