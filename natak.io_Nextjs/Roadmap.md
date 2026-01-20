# Roadmap to v0.1 Release

## Todo

### 🔌 Backend Integration
- [ ] **Migrate Assets Page to Real Data**: Replace `mockStore` usage in `AssetsPage` with React Query hooks fetching from Supabase (`assets` table).
- [ ] **Connect Generation API**: Update `AssetsPage` submit handler to call `/api/generate` instead of console logging or mock updates.
- [ ] **Implement Credit Checks in UI**: Display real user credit balance from `profiles` table in the Sidebar/Topbar.

### 🔐 Authentication & Users
- [x] **Resolve Auth Conflict**: Decided on Supabase Auth. Clerk removed for tighter DB consistency.
- [ ] **Profile Creation Trigger**: Ensure a `profiles` row is created immediately upon user signup (via Supabase trigger or webhook).

### 💳 Payments & Credits
- [ ] **Payment Integration**: Implement Stripe or LemonSqueezy checkout to allow users to buy credits.
- [ ] **Webhook Handler**: Create `api/webhooks/payment` to listen for successful payments and top up the user's `credits` in Supabase.

### 🗄️ Storage & Assets
- [ ] **Real File Upload**: Implement S3/Supabase Storage for user uploads (currently strictly UI).
- [ ] **Asset Sync**: Ensure generated images from Fal.ai are uploaded to our storage and not just temporary URLs.

## In Progress

### 🎨 UI/UX Refinement
- [ ] **Responsive Adjustments**: Polishing the Dashboard for mobile views.
- [ ] **Animation Polish**: Fine-tuning Framer Motion transitions (Sidebar, Gallery).

### ⚙️ Core Logic
- [x] **Credit Service**: Fully integrated with API and DB security.
- [/] **Generation Service**: Wired to frontend; verifying live Fal.ai processing.

## Done

### 🏗️ Foundation
- [x] **Project Structure**: Monorepo-style setup with `(app)`, `(auth)`, and `(marketing)` route groups.
- [x] **Design System**: Brutalist Industrial theme implemented with TailwindCSS.
- [x] **UI Components**: Core primitives (Buttons, Inputs, Sidebar, FileUpload) are built.
- [x] **Route Architecture**: Navigation between Assets, Admin, and Settings is set up.

### 📄 Pages
- [x] **Marketing Landing Page**: High-quality implementation with "Zero UI" concept.
- [x] **Assets Dashboard**: Complex grid UI with selection, batching, and filtering (currently using mock data).
- [x] **Credit Logic**: Pricing models for Image, Video, and Training defined in code.
