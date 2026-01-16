/**
 * Credit Service
 * Manages credit transactions, balance checks, and pricing logic
 */

import { supabase } from "@/lib/supabase";
import { OperationsJob, PipelineStep } from "@/types/operations";

export const CREDIT_PRICING = {
    IMAGE: {
        BASIC: 1,      // 1024x1024 Z-Image Turbo
        PREMIUM: 2,    // 5x Upscale or Outfit Swap
        FULL: 3,       // Outfit Swap + Upscale
    },
    VIDEO: {
        FAST_720P: 5,  // LTX Fast 720p (5s)
        FAST_1080P: 8, // LTX Fast 1080p (5s)
        PRO_1080P: 12, // LTX Pro 1080p (5s)
        PRO_4K: 40,    // LTX Pro 4K (5s)
    },
    ANIMATION: {
        HD_720P: 10,   // WAN 2.2 Animate 720p
        FULL_HD: 25,   // WAN 2.6 Pro 1080p
    },
    TRAINING: {
        LORA_FAST: 75, // 1000 steps
        LORA_HQ: 150,  // 2000 steps
    }
} as const;

export class CreditService {

    /**
     * Check if user has enough credits
     */
    async checkBalance(userId: string, cost: number): Promise<boolean> {
        const { data: profile } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();

        return (profile?.credits || 0) >= cost;
    }

    /**
     * Deduct credits for an action
     */
    async deductCredits(userId: string, amount: number, action: string, metadata?: any) {
        if (amount <= 0) return true;

        // Use RPC function for atomic update if available, or simple update
        // Ideally: call a postgres function `deduct_credits(user_id, amount)`
        // Fallback: fetch, subtract, update (optimistic lock would be better)

        const { data: profile, error: readError } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();

        if (readError || !profile) throw new Error("User profile not found");
        if (profile.credits < amount) throw new Error("Insufficient credits");

        const newBalance = profile.credits - amount;

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ credits: newBalance })
            .eq('id', userId);

        if (updateError) throw new Error("Failed to update credit balance");

        // Record transaction
        await supabase.from('credits_ledger').insert({
            user_id: userId,
            amount: -amount,
            action: action,
            metadata: metadata
        });

        return true;
    }

    /**
     * Calculate cost for a generation job config
     */
    calculateCost(config: any): number {
        let cost = 0;

        // Base cost
        if (config.loraSteps) {
            // Training job
            return config.loraSteps > 1000 ? CREDIT_PRICING.TRAINING.LORA_HQ : CREDIT_PRICING.TRAINING.LORA_FAST;
        }

        if (config.animate) {
            // Animation job
            return config.resolution === '1080p' ? CREDIT_PRICING.ANIMATION.FULL_HD : CREDIT_PRICING.ANIMATION.HD_720P;
        }

        // Image Generation
        cost += CREDIT_PRICING.IMAGE.BASIC;

        if (config.changeClothes) {
            cost += 1; // +1 for Swap
        }

        if (config.upscaleFactor && config.upscaleFactor > 1) {
            if (cost < CREDIT_PRICING.IMAGE.PREMIUM) cost = CREDIT_PRICING.IMAGE.PREMIUM;
            if (config.changeClothes) cost = CREDIT_PRICING.IMAGE.FULL;
        }

        // Video Generation
        if (config.generateVideo) {
            if (config.resolution === '4K') cost += CREDIT_PRICING.VIDEO.PRO_4K;
            else if (config.model === 'LTX Pro') cost += CREDIT_PRICING.VIDEO.PRO_1080P;
            else if (config.resolution === '1080p') cost += CREDIT_PRICING.VIDEO.FAST_1080P;
            else cost += CREDIT_PRICING.VIDEO.FAST_720P;
        }

        return cost;
    }

    /**
     * Check if user tier allows the requested configuration
     */
    async checkPermissions(userId: string, config: any): Promise<{ allowed: boolean; error?: string }> {
        const { data: profile } = await supabase
            .from('profiles')
            .select('tier')
            .eq('id', userId)
            .single();

        const tier = profile?.tier || 'Starter';

        // Tier Levels: 
        // 1: Starter/Operator
        // 2: Pro/Director
        // 3: Agency/Executive

        const isDirectorOrHigher = ['Pro', 'Director', 'Agency', 'Executive'].includes(tier);
        const isExecutive = ['Agency', 'Executive'].includes(tier);

        // 1. NSFW Check
        if (config.isNSFW && !isDirectorOrHigher) {
            return { allowed: false, error: "NSFW generation requires Director plan or higher" };
        }

        // 2. Video Restrictions
        if (config.generateVideo) {
            // Duration
            // Operator: 5s, Director: 10s, Exec: 20s
            const duration = config.duration || 5;
            if (duration > 5 && !isDirectorOrHigher) {
                return { allowed: false, error: "Videos longer than 5s require Director plan" };
            }
            if (duration > 10 && !isExecutive) {
                return { allowed: false, error: "Videos longer than 10s require Executive plan" };
            }

            // Resolution
            // Operator: 1080p, Director: 1440p, Exec: 4K
            if (config.resolution === '4K' && !isExecutive) {
                return { allowed: false, error: "4K video requires Executive plan" };
            }
            if (config.resolution === '1440p' && !isDirectorOrHigher) {
                return { allowed: false, error: "1440p video requires Director plan" };
            }
        }

        return { allowed: true };
    }
}

export const creditService = new CreditService();
