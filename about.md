# NATAK.io | Technical Truth & Architectural Blueprint

**Version:** 1.0.0-MVP  
**System Status:** Development / Orchestration Phase  
**Codebase Name:** Project Prism (Legacy) -> NATAK.io (Active)

---

## 1. System Overview
NATAK.io is an **Identity-First Content Factory (IaaS - Identity as a Service)**. Unlike generic AI image generators, NATAK.io is built on an **ETL (Extract, Transform, Load) Pipeline approach** to digital media.

- **Extraction:** Capturing core identity geometry from reference artifacts (images/video).
- **Transformation:** Injecting extracted identities into serverless GPU clusters via custom LoRA weights.
- **Loading:** Orchestrating batch manifests into high-fidelity cinematic outputs for agencies.

**Core Value Proposition:**  
NATAK.io is a **"Painkiller" for Content Agencies**. It solves the "Consistency Gap" in AI production, allowing brands to scale digital twins across thousands of assets without identity drift.

---

## 2. Technical Stack Definition

### Frontend
- **Framework:** Next.js 14 (App Router) / React 19 (Current SPA Implementation).
- **Styling:** Tailwind CSS (Brutalist Protocol).
- **Components:** Shadcn UI (modified for sharp corners), Framer Motion (for fluid state transitions).
- **Icons:** Lucide React.
- **State Management:** Custom `mockStore` (Zustand/Context target) with LocalStorage persistence.

### Backend & Infrastructure
- **BaaS:** Supabase (PostgreSQL for metadata, Auth for Operator sessions).
- **Compute:** Supabase Edge Functions (TypeScript) for orchestration logic.
- **Storage:** Cloudflare R2 (S3-compatible object storage for high-resolution training data and generated artifacts).

### AI & Inference Logic
- **Logic Layer:** Google Gemini 1.5 Flash / Pro (Vision analysis and prompt orchestration) & xAI Grok (Uncensored prompt refinement).
- **Compute Layer:** Fal.ai & Wavespeed.ai (Serverless GPU clusters).
- **Gateway:** Proprietary **NatakRio** gateway for checkpoint injection.

---

## 3. Skeleton Feature Audit

### [Automation Board] (`/studio`)
- **Functionality:** High-level orchestration of the generation queue.
- **UI Elements:** 
  - Kanban/Table toggle.
  - "Run Pipeline" global trigger.
  - Job Status Badges (Queued, Processing, Review, Ready).
  - Inspect Modal with "Source vs. Extraction" split-view.
- **Data Flow:** Job status updates in DB trigger real-time UI refreshes. Completion moves artifacts to the DAM.

### [Creative Mode] (`/creative`)
- **Functionality:** Real-time, single-manifest inference interface.
- **UI Elements:** 
  - Animated Shader Background (Three.js/WebGL).
  - Floating Prompt Input Box with Persona/Engine/Ratio selectors.
  - "Enhance" (BrainCog) button for prompt expansion.
- **Data Flow:** Submission calls the `NatakRio` gateway to initiate immediate GPU inference.

### [Asset DAM] (`/assets`)
- **Functionality:** Centralized Digital Asset Management for reference artifacts.
- **UI Elements:** 
  - Selection grid with multi-select logic.
  - "Queue to Auto" configuration sidebar.
  - NSFW Bypass and Motion Sequence (Video) toggles.
- **Data Flow:** Multi-select artifacts -> Batch Config -> Bulk job creation in the Studio queue.

### [Identity Extraction] (`/characters`)
- **Functionality:** Training digital twins (LoRA/Checkpoints).
- **UI Elements:** 
  - "Initiate Training" modal.
  - Drag-and-drop artifact injection.
  - Training status progress tracker ("Analyzing Geometry").
- **Data Flow:** Uploaded frames -> R2 -> GPU Training Trigger -> Metadata save to Supabase.

### [Resource Command] (`/credits`)
- **Functionality:** Monetization and token management.
- **UI Elements:** 
  - Tier Status (Starter/Pro/Agency).
  - Top-up grid for one-time refills.
  - Transaction Log with impact markers (+/-).

---

## 4. AI Pipeline Specification

### The "NatakRio" Gateway
The gateway acts as an intelligent router between the NATAK frontend and serverless GPU providers.
- **Dynamic Injection:** Automatically appends `<trigger_word>` and LoRA URLs to incoming prompt strings based on selected Persona ID.
- **Failover Logic:** Primary compute is routed to **Fal.ai**. If latency exceeds 5000ms or a 5xx error is caught, the gateway hot-swaps the request to **Wavespeed.ai**.

### Ingestion Flow
1. **Source:** Chrome Extension (Scraper) or Manual Upload.
2. **Buffer:** Assets are temporarily staged in Cloudflare R2.
3. **Analysis:** Google Gemini parses the R2 link, generating a high-fidelity "Manifest Script" (detailed captioning).
4. **Permanent Storage:** Metadata is written to Supabase; assets are indexed in the DAM.

---

## 5. Branding & Theme (The Brutalist Protocol)

**Design Language:**  
The NATAK.io UI is designed to feel like a high-performance command terminal rather than a consumer app.

- **Backgrounds:** `#000000` (Deep Black), `#0F0F11` (Dark Charcoal).
- **Accents:** `#CCFF00` (Acid Lime) - used for interactive states and system alerts.
- **Shapes:** Sharp, beveled corners (`rounded-[2px]`). Zero "softness."
- **Typography:** 
  - Headers: Brutalist, Uppercase, Italic, Extra Bold (Inter).
  - Data: Monospace (Fira Code target) for technical parameters.
- **Motion:** High-speed `BlurFade` transitions and glitched UI states upon error.

---

**End of Technical Truth Document**