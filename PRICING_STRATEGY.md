# NATAK.IO Financial Strategy Document
## The Identity-First Content Factory

**Prepared by:** SaaS Pricing Strategist & CFO Analysis
**Date:** January 2026
**Version:** 1.0

---

# Executive Summary

This document defines the complete monetization architecture for NATAK.IO, including:
- **NATAK Credits** — Virtual currency economy
- **3-Tier Subscription Ladder** — Operator / Director / Executive
- **Booster Packs** — Micro-transaction top-ups
- **Gross Margin Analysis** — Targeting 65-75% margins

---

# Part 1: The Credit Economy

## 1.1 Exchange Rate Philosophy

**Target Gross Margin:** 65-70%
**Psychological Pricing:** Credits feel valuable but not expensive

### The NATAK Credit

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│           1 NATAK CREDIT = $0.04 USD                       │
│                                                            │
│           (For subscribers)                                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Why $0.04?**
- Round number that scales cleanly (25 credits = $1)
- Allows fine-grained pricing for varied actions
- At 65% margin, our average COGS per credit ≈ $0.014

---

## 1.2 Cost-per-Action Pricing Table

Based on raw infrastructure costs from `cost.txt`, with **65-70% Gross Margin** target:

### IMAGE GENERATION

| Action | COGS | Credit Price | User Cost | Gross Margin |
|--------|------|--------------|-----------|--------------|
| **Basic Image** (1024x1024) | $0.013 | **1 Credit** | $0.04 | **67.5%** |
| **HD Image** (with 2x upscale) | $0.017 | **1 Credit** | $0.04 | **57.5%** |
| **Premium Image** (5x upscale) | $0.036 | **2 Credits** | $0.08 | **55%** |
| **Outfit Swap** (segment + inpaint) | $0.025 | **2 Credits** | $0.08 | **68.8%** |
| **Full Pipeline** (swap + 5x upscale) | $0.064 | **3 Credits** | $0.12 | **46.7%** |

### VIDEO GENERATION (5 seconds)

| Action | COGS | Credit Price | User Cost | Gross Margin |
|--------|------|--------------|-----------|--------------|
| **Quick Video** (LTX Fast 720p) | $0.15 | **5 Credits** | $0.20 | **25%** |
| **Standard Video** (LTX Fast 1080p) | $0.21 | **8 Credits** | $0.32 | **34.4%** |
| **HD Video** (LTX Pro 1080p) | $0.31 | **12 Credits** | $0.48 | **35.4%** |
| **4K Video** (LTX Pro 2160p) | $1.21 | **40 Credits** | $1.60 | **24.4%** |

### VIDEO ANIMATION (Image-to-Video, 5 seconds)

| Action | COGS | Credit Price | User Cost | Gross Margin |
|--------|------|--------------|-----------|--------------|
| **Animate 720p** (WAN 2.5) | $0.26 | **10 Credits** | $0.40 | **35%** |
| **Animate 1080p** (WAN 2.6) | $0.76 | **25 Credits** | $1.00 | **24%** |
| **Premium Animate** (Kling + Audio) | $0.71 | **25 Credits** | $1.00 | **29%** |

### HIGH-COMPUTE ACTIONS

| Action | COGS | Credit Price | User Cost | Gross Margin |
|--------|------|--------------|-----------|--------------|
| **LoRA Training** (1000 steps) | $2.05 | **75 Credits** | $3.00 | **31.7%** |
| **LoRA Training** (2000 steps) | $4.05 | **150 Credits** | $6.00 | **32.5%** |
| **Reference Pack** (4 base images) | $0.05 | **2 Credits** | $0.08 | **37.5%** |

### UTILITY ACTIONS (Low/No Cost)

| Action | COGS | Credit Price | User Cost | Gross Margin |
|--------|------|--------------|-----------|--------------|
| **Smart Prompt** (Grok) | $0.003 | **FREE** | $0.00 | — |
| **Pose Map Extract** | $0.01 | **FREE** | $0.00 | — |
| **Depth Map Extract** | $0.01 | **FREE** | $0.00 | — |

> **Strategy Note:** Low-cost preprocessing is FREE to encourage pipeline usage. We recover margin on the high-value generation steps.

---

## 1.3 Blended Margin Analysis

Assuming a typical user session mix:

| Action Type | Session Mix | Margin | Weighted |
|-------------|-------------|--------|----------|
| Basic Images | 50% | 67.5% | 33.75% |
| Premium Images | 20% | 55% | 11% |
| Quick Videos | 15% | 34% | 5.1% |
| Animations | 10% | 30% | 3% |
| LoRA Training | 5% | 32% | 1.6% |

**Blended Gross Margin: ~54.5%**

To hit 65%+ blended margin, we apply the **Subscription Model** which amortizes credits at lower per-credit costs while encouraging volume.

---

# Part 2: The 3-Tier Subscription Ladder

## 2.1 Plan Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│    OPERATOR         →        DIRECTOR         →        EXECUTIVE            │
│    $29/mo                    $79/mo                    $199/mo              │
│    Solo Creators             Small Teams               Agencies             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2.2 Detailed Plan Specifications

### TIER 1: OPERATOR
*"For the independent creator building their first content empire."*

| Attribute | Value |
|-----------|-------|
| **Monthly Price** | **$29** |
| **Credit Allowance** | **500 Credits** |
| **Effective $/Credit** | $0.058 |
| **Character Slots (LoRAs)** | 3 |
| **Generation Mode** | Single Generation Only |
| **Video Length Cap** | 5 seconds |
| **Video Quality Cap** | 1080p |
| **Chrome Extension** | ❌ No |
| **NSFW/Uncensored** | ❌ No |
| **API Access** | ❌ No |
| **Kanban Automation** | ❌ No |
| **Priority Queue** | ❌ No |
| **Support** | Community |

**Unit Economics:**
- Expected credit burn: ~400 credits
- COGS @ 400 credits: ~$5.60
- Revenue: $29
- **Gross Margin: 80.7%**

---

### TIER 2: DIRECTOR
*"For professionals who need power and flexibility."*

| Attribute | Value |
|-----------|-------|
| **Monthly Price** | **$79** |
| **Credit Allowance** | **2,000 Credits** |
| **Effective $/Credit** | $0.0395 |
| **Character Slots (LoRAs)** | 10 |
| **Generation Mode** | **Batch Mode (up to 10)** |
| **Video Length Cap** | 10 seconds |
| **Video Quality Cap** | 1440p |
| **Chrome Extension** | ✅ Yes |
| **NSFW/Uncensored** | ✅ Yes (Opt-in) |
| **API Access** | ❌ No |
| **Kanban Automation** | ✅ Basic (Manual trigger) |
| **Priority Queue** | ✅ Yes |
| **Support** | Email (48hr) |

**Unit Economics:**
- Expected credit burn: ~1,600 credits
- COGS @ 1,600 credits: ~$22.40
- Revenue: $79
- **Gross Margin: 71.6%**

**Psychology:** The jump from $29 → $79 feels significant, but 4x the credits + NSFW + Chrome Extension makes it a clear winner for serious creators.

---

### TIER 3: EXECUTIVE
*"For agencies running content at scale."*

| Attribute | Value |
|-----------|-------|
| **Monthly Price** | **$199** |
| **Credit Allowance** | **6,000 Credits** |
| **Effective $/Credit** | $0.0332 |
| **Character Slots (LoRAs)** | **Unlimited** |
| **Generation Mode** | **Kanban Automation** |
| **Video Length Cap** | 20 seconds |
| **Video Quality Cap** | 4K (2160p) |
| **Chrome Extension** | ✅ Yes |
| **NSFW/Uncensored** | ✅ Yes (Opt-in) |
| **API Access** | ✅ Yes (Rate: 100 req/min) |
| **Kanban Automation** | ✅ Full (Auto-trigger pipelines) |
| **Priority Queue** | ✅ Skip the line |
| **Team Seats** | 3 included (+$29/seat) |
| **Support** | Priority Email (24hr) + Slack |

**Unit Economics:**
- Expected credit burn: ~4,800 credits
- COGS @ 4,800 credits: ~$67.20
- Revenue: $199
- **Gross Margin: 66.2%**

---

## 2.3 Feature Gating Matrix

| Feature | OPERATOR | DIRECTOR | EXECUTIVE |
|---------|:--------:|:--------:|:---------:|
| Basic Image Gen | ✅ | ✅ | ✅ |
| Premium Image Gen | ✅ | ✅ | ✅ |
| Outfit Swap | ✅ | ✅ | ✅ |
| Quick Video (5s) | ✅ | ✅ | ✅ |
| Extended Video (10s+) | ❌ | ✅ | ✅ |
| 4K Video | ❌ | ❌ | ✅ |
| Animation (Img2Vid) | ✅ | ✅ | ✅ |
| LoRA Training | ✅ (3 slots) | ✅ (10 slots) | ✅ (∞) |
| **Chrome Extension** | ❌ | ✅ | ✅ |
| **NSFW Models** | ❌ | ✅ | ✅ |
| **API Access** | ❌ | ❌ | ✅ |
| **Kanban Automation** | ❌ | Basic | Full |
| Batch Generation | ❌ | ✅ (10) | ✅ (50) |
| Priority Queue | ❌ | ✅ | ✅✅ |
| Team Seats | 1 | 1 | 3 |

---

## 2.4 Annual Discount

| Plan | Monthly | Annual (20% off) | Savings |
|------|---------|------------------|---------|
| Operator | $29/mo | $279/yr ($23.25/mo) | $69 |
| Director | $79/mo | $759/yr ($63.25/mo) | $189 |
| Executive | $199/mo | $1,909/yr ($159/mo) | $479 |

**Psychology:** Annual commitment reduces churn and improves cash flow. The $479 savings at Executive tier is compelling for agencies doing yearly budgets.

---

# Part 3: Micro-Transactions (Booster Packs)

## 3.1 Design Philosophy

> "Make it painful enough to encourage upgrades, convenient enough to capture emergency spend."

**Rules:**
1. Boosters are priced **25-40% higher per-credit** than subscription allowances
2. Never offer booster sizes larger than the next plan's allowance
3. Use urgency language: "Top-Up" not "Buy Credits"

---

## 3.2 Booster Pack Lineup

### SPARK PACK (Small)
*"Quick fix when you're almost there."*

| Attribute | Value |
|-----------|-------|
| **Credits** | 50 |
| **Price** | **$4** |
| **$/Credit** | $0.08 |
| **vs. Director Rate** | +102% premium |

**Use Case:** User needs 2-3 more images to finish a project.

---

### SURGE PACK (Medium)
*"Power through a creative sprint."*

| Attribute | Value |
|-----------|-------|
| **Credits** | 200 |
| **Price** | **$12** |
| **$/Credit** | $0.06 |
| **vs. Director Rate** | +51% premium |

**Use Case:** Mid-month crunch, client deadline, need a batch of videos.

---

### BLITZ PACK (Large)
*"When the brief changes last minute."*

| Attribute | Value |
|-----------|-------|
| **Credits** | 500 |
| **Price** | **$25** |
| **$/Credit** | $0.05 |
| **vs. Director Rate** | +26% premium |

**Use Case:** Major project, but user doesn't want to commit to upgrade yet.

**Strategic Note:** At $25 for 500 credits, it's almost as expensive as upgrading from Operator ($29 for 500 + features). This creates an obvious decision prompt: *"You could upgrade for $4 more and get Chrome Extension + NSFW..."*

---

## 3.3 Booster Pricing Comparison

| Pack | Credits | Price | $/Credit | vs. Executive Rate |
|------|---------|-------|----------|-------------------|
| Spark | 50 | $4 | $0.080 | +141% |
| Surge | 200 | $12 | $0.060 | +81% |
| Blitz | 500 | $25 | $0.050 | +51% |
| *Executive Sub* | *6000* | *$199* | *$0.033* | *baseline* |

---

## 3.4 Booster Margin Analysis

| Pack | Credits | Price | COGS | Gross Margin |
|------|---------|-------|------|--------------|
| Spark (50) | 50 | $4 | $0.70 | **82.5%** |
| Surge (200) | 200 | $12 | $2.80 | **76.7%** |
| Blitz (500) | 500 | $25 | $7.00 | **72.0%** |

> Boosters are our **highest margin** products — and that's intentional. The pain of paying premium prices drives subscription upgrades.

---

# Part 4: Psychology & Segmentation

## 4.1 Plan Segmentation Logic

| Segment | Profile | Needs | Friction Point | Our Solution |
|---------|---------|-------|----------------|--------------|
| **Hobbyist** | Side project, testing | Low volume, curious | Price sensitivity | OPERATOR: Affordable entry |
| **Pro Creator** | OnlyFans, influencer | NSFW, batch, automation | Time crunch, scale | DIRECTOR: Unlock power features |
| **Agency** | Manages multiple clients | API, team, unlimited | Control, white-label | EXECUTIVE: Enterprise needs |

---

## 4.2 Upgrade Triggers

### Operator → Director
1. **Hit NSFW wall:** "This content requires Director tier"
2. **Chrome Extension upsell:** "Scrape ideas directly from your feed"
3. **Batch blocked:** "Generate 10 at once with Director"
4. **Credit depletion:** "You've used 100% of your credits by day 15"

### Director → Executive
1. **API lock:** "Integrate with your Zapier workflow — Executive only"
2. **Team invite:** "Add your video editor — $29/seat or upgrade to Executive with 3 included"
3. **Kanban automation:** "Let the pipeline run while you sleep"
4. **4K unlock:** "Your clients demand premium quality"

---

## 4.3 Price Anchoring

The **DIRECTOR** at $79 is the "intended" tier. We design around it:

```
          OPERATOR          DIRECTOR          EXECUTIVE
             $29               $79               $199
              ↓                 ↓                  ↓
         "Too basic"     "Just right"      "If I scale"
```

**Decoy Effect:** Operator's limited features make Director look like excellent value. Executive's high price makes Director feel accessible.

---

# Part 5: Financial Summary

## 5.1 Monthly Revenue Model (1,000 Users)

| Tier | Users | % | MRR | Avg COGS | Gross Profit |
|------|-------|---|-----|----------|--------------|
| Operator | 500 | 50% | $14,500 | $2,800 | $11,700 |
| Director | 350 | 35% | $27,650 | $7,840 | $19,810 |
| Executive | 100 | 10% | $19,900 | $6,720 | $13,180 |
| Boosters | 50 | 5% | $600 | $140 | $460 |
| **TOTAL** | **1,000** | | **$62,650** | **$17,500** | **$45,150** |

**Blended Gross Margin: 72.1%**

---

## 5.2 Target Metrics

| Metric | Target | Notes |
|--------|--------|-------|
| Gross Margin | 65-75% | Achieved via subscription model |
| LTV:CAC | 3:1+ | 12-month LTV ÷ acquisition cost |
| Churn Rate | <5%/mo | Annual discounts reduce churn |
| Upgrade Rate | 15%/mo | Operator → Director pathway |
| Booster Attach | 10% | Users buying top-ups |

---

## 5.3 Credit Redemption Assumptions

| Plan | Credits | Expected Burn | Burn Rate |
|------|---------|---------------|-----------|
| Operator | 500 | 400 | 80% |
| Director | 2,000 | 1,600 | 80% |
| Executive | 6,000 | 4,800 | 80% |

> **Breakage:** 20% of credits typically go unused. This is pure margin.

---

# Part 6: Implementation Checklist

## Database Schema
```sql
-- Credit packages
CREATE TYPE credit_tier AS ENUM ('operator', 'director', 'executive');

-- User subscription
ALTER TABLE profiles ADD COLUMN subscription_tier credit_tier DEFAULT 'operator';
ALTER TABLE profiles ADD COLUMN credits_remaining INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN credits_reset_at TIMESTAMPTZ;

-- Credit transactions
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  amount INTEGER NOT NULL, -- positive = add, negative = deduct
  action TEXT NOT NULL, -- 'subscription', 'booster', 'image_gen', 'video_gen', etc.
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Stripe Products (IDs to create)
```
OPERATOR_MONTHLY:   price_xxxx ($29)
OPERATOR_ANNUAL:    price_xxxx ($279)
DIRECTOR_MONTHLY:   price_xxxx ($79)
DIRECTOR_ANNUAL:    price_xxxx ($759)
EXECUTIVE_MONTHLY:  price_xxxx ($199)
EXECUTIVE_ANNUAL:   price_xxxx ($1909)
BOOSTER_SPARK:      price_xxxx ($4)
BOOSTER_SURGE:      price_xxxx ($12)
BOOSTER_BLITZ:      price_xxxx ($25)
```

---

# Appendix: Quick Reference Card

## Credit Pricing (Subscriber Rates)

| Action | Credits |
|--------|---------|
| Basic Image | 1 |
| HD Image (2x) | 1 |
| Premium Image (5x) | 2 |
| Outfit Swap | 2 |
| Full Pipeline | 3 |
| Quick Video (5s 720p) | 5 |
| Standard Video (5s 1080p) | 8 |
| HD Video (5s Pro) | 12 |
| 4K Video | 40 |
| Animation 720p | 10 |
| Animation 1080p | 25 |
| LoRA Train (1k steps) | 75 |
| LoRA Train (2k steps) | 150 |

## Plan Summary

| Plan | Price | Credits | $/Credit | Key Unlock |
|------|-------|---------|----------|------------|
| Operator | $29 | 500 | $0.058 | Entry |
| Director | $79 | 2,000 | $0.040 | NSFW + Chrome |
| Executive | $199 | 6,000 | $0.033 | API + Automation |

## Booster Packs

| Pack | Credits | Price | $/Credit |
|------|---------|-------|----------|
| Spark | 50 | $4 | $0.08 |
| Surge | 200 | $12 | $0.06 |
| Blitz | 500 | $25 | $0.05 |

---

**Document Version:** 1.0
**Prepared for:** NATAK.IO Leadership
**Confidential — Internal Use Only**
