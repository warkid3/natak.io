
import { User, CharacterModel, Asset, GenerationJob, Status, PromptingModel, ImageModel, VideoModel, Transaction, Notification, Ticket } from '../types';

const STORAGE_KEYS = {
  USER: 'prism_user',
  CHARACTERS: 'prism_characters',
  ASSETS: 'prism_assets',
  JOBS: 'prism_jobs',
  INBOX: 'prism_inbox',
  STARRED_PROMPTS: 'prism_starred_prompts',
  TRANSACTIONS: 'prism_transactions',
  NOTIFICATIONS: 'prism_notifications',
  TICKETS: 'prism_tickets'
};

export const mockStore = {
  getUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    if (!user) return null;
    return JSON.parse(user);
  },
  setUser: (user: User | null) => {
    if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getTransactions: (): Transaction[] => {
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
  },

  getNotifications: (): Notification[] => {
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
  },
  markNotificationRead: (id: string) => {
    const ns = mockStore.getNotifications();
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(ns.map(n => n.id === id ? { ...n, read: true } : n)));
  },

  getTickets: (): Ticket[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TICKETS);
    if (!data) {
      const initial: Ticket[] = [{ id: 'tk-1', subject: 'API Latency Issues', status: 'closed', category: 'technical', timestamp: '2024-05-10T12:00:00Z' }];
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },
  saveTicket: (ticket: Ticket) => {
    const tks = mockStore.getTickets();
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify([ticket, ...tks]));
  },

  getCharacters: (): CharacterModel[] => {
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
  },
  saveCharacter: (character: CharacterModel) => {
    const chars = mockStore.getCharacters();
    localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify([...chars, character]));
  },
  updateCharacterStatus: (id: string, status: CharacterModel['status']) => {
    const chars = mockStore.getCharacters();
    const updated = chars.map(c => c.id === id ? { ...c, status } : c);
    localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(updated));
  },

  getAssets: (): Asset[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ASSETS);
    if (!data) {
      const initial: Asset[] = [
        { id: 'a1', url: 'https://picsum.photos/seed/prism1/600/800', caption: 'Vibrant Neon Cityscape', type: 'image', source: 'scraped', collection: 'Urban Core' },
        { id: 'a2', url: 'https://picsum.photos/seed/prism2/600/800', caption: 'High Fashion Studio Silhouette', type: 'image', source: 'scraped', collection: 'Vogue X' },
        { id: 'a3', url: 'https://picsum.photos/seed/prism3/600/800', caption: 'Minimalist Tech Noir', type: 'image', source: 'upload' },
        { id: 'a4', url: 'https://picsum.photos/seed/prism4/600/800', caption: 'Cyberpunk Portrait Reference', type: 'image', source: 'scraped', collection: 'Urban Core' }
      ];
      localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  getInbox: (): Asset[] => {
    const data = localStorage.getItem(STORAGE_KEYS.INBOX);
    return data ? JSON.parse(data) : [];
  },
  saveInbox: (item: Asset) => {
    const items = mockStore.getInbox();
    localStorage.setItem(STORAGE_KEYS.INBOX, JSON.stringify([item, ...items]));
  },
  updateInbox: (id: string, caption: string) => {
    const items = mockStore.getInbox();
    const updated = items.map(i => i.id === id ? { ...i, caption } : i);
    localStorage.setItem(STORAGE_KEYS.INBOX, JSON.stringify(updated));
  },

  getJobs: (): GenerationJob[] => {
    const data = localStorage.getItem(STORAGE_KEYS.JOBS);
    if (!data) return [];
    return JSON.parse(data);
  },
  saveJob: (job: GenerationJob) => {
    const jobs = mockStore.getJobs();
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify([job, ...jobs]));
  },
  updateJob: (id: string, updates: Partial<GenerationJob>) => {
    const jobs = mockStore.getJobs();
    const updated = jobs.map(j => j.id === id ? { ...j, ...updates } : j);
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(updated));
  },
  bulkUpdateJobs: (ids: string[], status: Status) => {
    const jobs = mockStore.getJobs();
    const updated = jobs.map(j => ids.includes(j.id) ? { ...j, status } : j);
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(updated));
  },

  getStarredPrompts: (): string[] => {
    const data = localStorage.getItem(STORAGE_KEYS.STARRED_PROMPTS);
    return data ? JSON.parse(data) : [];
  },
  starPrompt: (text: string) => {
    const prompts = mockStore.getStarredPrompts();
    if (!prompts.includes(text)) {
      localStorage.setItem(STORAGE_KEYS.STARRED_PROMPTS, JSON.stringify([...prompts, text]));
    }
  },
  unstarPrompt: (text: string) => {
    const prompts = mockStore.getStarredPrompts();
    localStorage.setItem(STORAGE_KEYS.STARRED_PROMPTS, JSON.stringify(prompts.filter(p => p !== text)));
  }
};
