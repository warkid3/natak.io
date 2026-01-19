
import { User, CharacterModel, Asset, GenerationJob, Status, Transaction, Notification, Ticket } from '@/types';

const STORAGE_KEYS = {
    USER: 'prism_user',
    CHARACTERS: 'prism_characters',
    ASSETS: 'prism_assets',
    COLLECTIONS: 'prism_collections',
    JOBS: 'prism_jobs',
    INBOX: 'prism_inbox',
    STARRED_PROMPTS: 'prism_starred_prompts',
    TRANSACTIONS: 'prism_transactions',
    NOTIFICATIONS: 'prism_notifications',
    TICKETS: 'prism_tickets'
};

class MockStore {
    isClient = typeof window !== 'undefined';

    getUser(): User | null {
        if (!this.isClient) return null;
        const user = localStorage.getItem(STORAGE_KEYS.USER);
        if (!user) return null;
        return JSON.parse(user);
    }

    setUser(user: User | null) {
        if (!this.isClient) return;
        if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        else localStorage.removeItem(STORAGE_KEYS.USER);
    }

    getTransactions(): Transaction[] {
        if (!this.isClient) return [];
        const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        if (!data) {
            const initial: Transaction[] = [
                { id: 'tx-1', type: 'debit', amount: 15, description: 'Batch Generation (5 Images)', timestamp: new Date(Date.now() - 3600000).toISOString() },
                { id: 'tx-2', type: 'debit', amount: 50, description: 'Training Identity (Luna Cyber)', timestamp: new Date(Date.now() - 86400000).toISOString() },
                { id: 'tx-3', type: 'credit', amount: 1000, description: 'Top-up: Studio Pack', timestamp: new Date(Date.now() - 172800000).toISOString() }
            ];
            localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(initial));
            return initial;
        }
        return JSON.parse(data);
    }

    getNotifications(): Notification[] {
        if (!this.isClient) return [];
        const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
        if (!data) {
            const initial: Notification[] = [
                { id: 'n-1', title: 'Extraction Complete', message: 'Job #8234-X has been processed.', type: 'job', read: false, link: '/studio', timestamp: new Date().toISOString() },
                { id: 'n-2', title: 'System Protocol', message: 'Maintenance scheduled for 04:00 UTC.', type: 'system', read: true, timestamp: new Date(Date.now() - 3600000).toISOString() }
            ];
            localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initial));
            return initial;
        }
        return JSON.parse(data);
    }

    markNotificationRead(id: string) {
        if (!this.isClient) return;
        const ns = this.getNotifications();
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(ns.map(n => n.id === id ? { ...n, read: true } : n)));
    }

    getTickets(): Ticket[] {
        if (!this.isClient) return [];
        const data = localStorage.getItem(STORAGE_KEYS.TICKETS);
        if (!data) {
            const initial: Ticket[] = [{ id: 'tk-1', subject: 'API Latency Issues', status: 'closed', category: 'technical', timestamp: '2024-05-10T12:00:00Z' }];
            localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(initial));
            return initial;
        }
        return JSON.parse(data);
    }

    saveTicket(ticket: Ticket) {
        if (!this.isClient) return;
        const tks = this.getTickets();
        localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify([ticket, ...tks]));
    }

    getCharacters(): CharacterModel[] {
        if (!this.isClient) return [];
        const data = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
        if (!data) {
            const initial: CharacterModel[] = [
                { id: 'c1', user_id: '1', name: 'Luna Cyber', trigger_word: 'luna_v3', status: 'ready', created_at: new Date().toISOString() },
                { id: 'c2', user_id: '1', name: 'Kaelen Void', trigger_word: 'kaelen_model', status: 'ready', created_at: new Date().toISOString() }
            ];
            localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(initial));
            return initial;
        }
        return JSON.parse(data);
    }

    saveCharacter(character: CharacterModel) {
        if (!this.isClient) return;
        const chars = this.getCharacters();
        localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify([...chars, character]));
    }

    updateCharacterStatus(id: string, status: CharacterModel['status']) {
        if (!this.isClient) return;
        const chars = this.getCharacters();
        const updated = chars.map(c => c.id === id ? { ...c, status } : c);
        localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(updated));
    }

    getCollections(): any[] {
        if (!this.isClient) return [];
        const data = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
        if (!data) {
            const initial = [
                { id: 'c-1', name: 'Urban Core', count: 12, created_at: new Date().toISOString() },
                { id: 'c-2', name: 'Vogue X', count: 5, created_at: new Date().toISOString() },
                { id: 'c-3', name: 'Cyber Noir', count: 8, created_at: new Date().toISOString() }
            ];
            localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(initial));
            return initial;
        }
        return JSON.parse(data);
    }

    saveCollection(collection: any) {
        if (!this.isClient) return;
        const cols = this.getCollections();
        localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify([...cols, collection]));
    }

    getAssets(): Asset[] {
        if (!this.isClient) return [];
        const data = localStorage.getItem(STORAGE_KEYS.ASSETS);
        if (!data) {
            const initial: Asset[] = [
                { id: '11111111-1111-4111-8111-111111111111', url: 'https://picsum.photos/seed/prism1/600/800', caption: 'Vibrant Neon Cityscape', type: 'image', source: 'scraped', collection_id: 'c-1', tags: ['neon', 'city'] },
                { id: '22222222-2222-4222-8222-222222222222', url: 'https://picsum.photos/seed/prism2/600/800', caption: 'High Fashion Studio Silhouette', type: 'image', source: 'scraped', collection_id: 'c-2', tags: ['fashion', 'studio'] },
                { id: '33333333-3333-4333-8333-333333333333', url: 'https://picsum.photos/seed/prism3/600/800', caption: 'Minimalist Tech Noir', type: 'image', source: 'upload', tags: ['minimal', 'tech'] },
                { id: '44444444-4444-4444-8444-444444444444', url: 'https://picsum.photos/seed/prism4/600/800', caption: 'Cyberpunk Portrait Reference', type: 'image', source: 'scraped', collection_id: 'c-1', tags: ['cyberpunk', 'portrait'] }
            ];
            localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(initial));
            return initial;
        }
        return JSON.parse(data);
    }

    getInbox(): Asset[] {
        if (!this.isClient) return [];
        const data = localStorage.getItem(STORAGE_KEYS.INBOX);
        return data ? JSON.parse(data) : [];
    }

    saveInbox(item: Asset) {
        if (!this.isClient) return;
        const items = this.getInbox();
        localStorage.setItem(STORAGE_KEYS.INBOX, JSON.stringify([item, ...items]));
    }

    updateInbox(id: string, caption: string) {
        if (!this.isClient) return;
        const items = this.getInbox();
        const updated = items.map(i => i.id === id ? { ...i, caption } : i);
        localStorage.setItem(STORAGE_KEYS.INBOX, JSON.stringify(updated));
    }

    getJobs(): GenerationJob[] {
        if (!this.isClient) return [];
        const data = localStorage.getItem(STORAGE_KEYS.JOBS);
        if (!data) return [];
        return JSON.parse(data);
    }

    saveJob(job: GenerationJob) {
        if (!this.isClient) return;
        const jobs = this.getJobs();
        localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify([job, ...jobs]));
    }

    updateJob(id: string, updates: Partial<GenerationJob>) {
        if (!this.isClient) return;
        const jobs = this.getJobs();
        const updated = jobs.map(j => j.id === id ? { ...j, ...updates } : j);
        localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(updated));
    }

    bulkUpdateJobs(ids: string[], status: Status) {
        if (!this.isClient) return;
        const jobs = this.getJobs();
        const updated = jobs.map(j => ids.includes(j.id) ? { ...j, status } : j);
        localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(updated));
    }

    getStarredPrompts(): string[] {
        if (!this.isClient) return [];
        const data = localStorage.getItem(STORAGE_KEYS.STARRED_PROMPTS);
        return data ? JSON.parse(data) : [];
    }

    starPrompt(text: string) {
        if (!this.isClient) return;
        const prompts = this.getStarredPrompts();
        if (!prompts.includes(text)) {
            localStorage.setItem(STORAGE_KEYS.STARRED_PROMPTS, JSON.stringify([...prompts, text]));
        }
    }

    unstarPrompt(text: string) {
        if (!this.isClient) return;
        const prompts = this.getStarredPrompts();
        localStorage.setItem(STORAGE_KEYS.STARRED_PROMPTS, JSON.stringify(prompts.filter(p => p !== text)));
    }
}

export const mockStore = new MockStore();
