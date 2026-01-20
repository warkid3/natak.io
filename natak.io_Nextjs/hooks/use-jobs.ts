import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GenerationJob } from '@/types';

export function useJobs(userId?: string) {
    const [jobs, setJobs] = useState<GenerationJob[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const pollInterval = useRef<NodeJS.Timeout | null>(null);

    const fetchJobs = useCallback(async () => {
        if (!userId) return;

        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setJobs(data as GenerationJob[]);
        } else {
            console.error('Error fetching jobs:', error);
        }
        setLoading(false);
    }, [userId, supabase]);

    useEffect(() => {
        fetchJobs();

        // Poll if there are active jobs
        const checkForActiveJobs = () => {
            const hasActive = jobs.some(j => ['queued', 'processing'].includes(j.status));
            if (hasActive) {
                if (!pollInterval.current) {
                    pollInterval.current = setInterval(fetchJobs, 2000);
                }
            } else {
                if (pollInterval.current) {
                    clearInterval(pollInterval.current);
                    pollInterval.current = null;
                }
            }
        };

        checkForActiveJobs();

        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, [jobs, fetchJobs]); // Re-run when jobs change to check status

    // Also subscribe to changes for immediate feedback
    useEffect(() => {
        if (userId) {
            const channel = supabase
                .channel('jobs_changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'jobs',
                        filter: `user_id=eq.${userId}`
                    },
                    () => {
                        fetchJobs();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [userId, fetchJobs, supabase]);

    return { jobs, loading, refresh: fetchJobs };
}
