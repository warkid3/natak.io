'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@/types';

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchUser = useCallback(async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                setUser(null);
                setLoading(false);
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            setUser(profile ? {
                id: profile.id,
                email: profile.email,
                credits: profile.credits,
                tier: profile.tier,
                name: profile.name,
                avatar_url: profile.avatar_url
            } : null);
        } catch (error) {
            console.error('Error fetching user:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        fetchUser();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                fetchUser();
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchUser, supabase.auth]);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return { user, loading, signOut, refresh: fetchUser };
}
