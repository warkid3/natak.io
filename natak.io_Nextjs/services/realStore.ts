import { supabase } from '@/lib/supabase';
import { User, Transaction, Notification, Ticket, CharacterModel, Asset, GenerationJob, Status } from '@/types';

class RealStore {
    // AUTH
    async getUser(): Promise<User | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        // Fetch profile details
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        return profile ? {
            id: profile.id,
            email: profile.email,
            credits: profile.credits,
            tier: profile.tier,
            name: profile.name,
            avatar_url: profile.avatar_url
        } : null;
    }

    async setUser(user: User | null) {
        if (!user) {
            await supabase.auth.signOut();
        }
        // Supabase handles user setting via Auth UI/client usually, 
        // but we'll use this if we need manual profile updates.
    }

    // JOBS & REALTIME
    async getJobs(): Promise<GenerationJob[]> {
        const { data } = await supabase
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false });
        return data || [];
    }

    subscribeToJobs(callback: (payload: any) => void) {
        return supabase
            .channel('public:jobs')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, callback)
            .subscribe();
    }

    async saveJob(job: Partial<GenerationJob>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        return await supabase.from('jobs').insert([{
            ...job,
            user_id: user.id
        }]);
    }

    async updateJob(id: string, updates: Partial<GenerationJob>) {
        return await supabase.from('jobs').update(updates).eq('id', id);
    }

    // ASSETS
    async getAssets(): Promise<Asset[]> {
        const { data } = await supabase.from('assets').select('*').order('created_at', { ascending: false });
        return data || [];
    }

    async saveAsset(asset: Partial<Asset>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        return await supabase.from('assets').insert([{ ...asset, user_id: user.id }]);
    }

    // CHARACTERS
    async getCharacters(): Promise<CharacterModel[]> {
        const { data } = await supabase.from('characters').select('*').order('created_at', { ascending: false });
        return data || [];
    }

    async saveCharacter(character: Partial<CharacterModel>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        return await supabase.from('characters').insert([{ ...character, user_id: user.id }]);
    }

    // TRANSACTIONS
    async getTransactions(): Promise<Transaction[]> {
        const { data } = await supabase.from('credits_ledger').select('*').order('timestamp', { ascending: false });
        return data || [];
    }

    // NOTIFICATIONS
    async getNotifications(): Promise<Notification[]> {
        const { data } = await supabase.from('notifications').select('*').order('timestamp', { ascending: false });
        // Note: I didn't add the notification table to SQL yet, I should probably add it or use an enum
        return data || [];
    }

    async markNotificationRead(id: string) {
        return await supabase.from('notifications').update({ read: true }).eq('id', id);
    }

    // TICKETS
    async getTickets(): Promise<Ticket[]> {
        const { data } = await supabase.from('tickets').select('*').order('timestamp', { ascending: false });
        return data || [];
    }

    async saveTicket(ticket: Partial<Ticket>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        return await supabase.from('tickets').insert([{ ...ticket, user_id: user.id }]);
    }

    // PROMPTS
    async getStarredPrompts(): Promise<string[]> {
        const { data } = await supabase.from('starred_prompts').select('text');
        return data?.map(d => d.text) || [];
    }

    async starPrompt(text: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        return await supabase.from('starred_prompts').upsert([{ user_id: user.id, text }]);
    }

    async unstarPrompt(text: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        return await supabase.from('starred_prompts').delete().eq('user_id', user.id).eq('text', text);
    }
}

export const realStore = new RealStore();
