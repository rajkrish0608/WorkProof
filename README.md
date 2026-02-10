<h1 align="center">WorkProof</h1>

<p align="center">
  <strong>Trust-first ledger for workforce verification and payment proof</strong>
</p>

<p align="center">
  Immutable records · Banking-grade UI · Optical 3D · Motion discipline
</p>

<p align="center">
  <img src="docs/preview-dashboard.png" alt="WorkProof Dashboard Preview" width="800" />
</p>

<p align="center">
  <a href="https://workproof.vercel.app"><strong>Live Demo →</strong></a>
</p>

## Project Overview

WorkProof is a trust-critical B2B SaaS platform engineered for the immutable recording of daily wage work, attendance, and payment verification. Designed for industries where labor transparency is paramount, it serves as a digital ledger that bridges the gap between workforce management and financial compliance. By providing verifiable proof of work and payment, the system reduces disputes, ensures regulatory alignment, and brings institutional-grade accountability to high-frequency labor environments.

This is a serious system designed for reliability and global scalability.

---


## Design & Motion DNA

<p align="center">
  <img src="docs/motion-dna.png" alt="WorkProof Motion & 3D System" width="700" />
</p>

The WorkProof interface is governed by the "Banking Terminal" standard. It prioritizes clarity and operational efficiency over decorative elements. The visual language is defined by a Zinc-first neutral palette, utilizing Indigo accents exclusively to signal trust, active states, and successful outcomes.

Motion in WorkProof is treated as **invisible engineering** rather than decoration. Its purpose is strictly functional:
- **Attention Guidance**: Subtle transitions lead the eye to critical data points.
- **Cognitive Load Reduction**: Logical entrances explain the relationship between UI elements.
- **Action Confirmation**: Immediate, understated feedback confirms that the system has processed a request.

We explicitly reject flashy animations, elastic/bounce motion, and high-frequency visual noise. Motion exists to serve the user, not to entertain them.

## Motion Preview (Intentional & Restrained)

<p align="center">
  <img src="docs/hero-motion.webp" alt="WorkProof Optical 3D Motion Preview" width="700" />
</p>

Motion in WorkProof exists to guide attention and confirm state — never to distract.

## 3D & Animation DNA

Depth and spatial hierarchy in WorkProof are achieved through Optical 3D—a technique that uses standard UI properties to create a sense of physical layering without the overhead of heavy 3D rendering engines.

- **Perspective Rendering**: UI cards in high-level overview sections utilize specific perspective tilts to establish hierarchy.
- **Layered Depth**: We use a disciplined application of shadows, blurs, and scale to separate the interaction layer from the data layer.
- **Temporal Rhythm**: Ambient motion is kept to an extremely slow frequency (12–18s) to ensure the interface feels alive but never distracting.
- **Interaction Restraint**: Motion is intentionally minimized within the dashboard to maintain focus during complex data entry or auditing tasks.

## System Architecture (High-Level)

<p align="center">
  <img src="docs/architecture.png" alt="WorkProof Architecture Diagram" width="700" />
</p>

WorkProof is designed for predictability, auditability, and long-term maintenance.

## UI Standards (“Banking Terminal” Rule)

WorkProof dashboards are intentionally calm. We follow a strict 90/10 rule: 90% of the interface remains neutral (Zinc/White/Black) while 10% is reserved for context-critical color. 

- **Muted Status Indicators**: Operational statuses use desaturated tones to avoid creating false urgency.
- **Interaction Decay**: Motion and entrance animations disappear after the first interaction, allowing the professional user to operate in a high-speed, static environment.
- **Typography**: Focused on legibility and information density, supporting long-duration usage without visual fatigue.

## Technology Stack

<p align="center">
  <img src="docs/tech-stack.png" alt="WorkProof Tech Stack" width="600" />
</p>

- **Frontend:** Next.js (App Router), React, Tailwind CSS  
- **Motion:** Framer Motion (tokenized system)  
- **Backend:** Next.js Route Handlers  
- **Database:** PostgreSQL + Prisma  
- **Auth:** JWT (stateless)  
- **Validation:** Zod (runtime schema enforcement)

The architecture is selected for its predictability, scalability, and strict type safety.

---

## Motion Tokens & Interaction Rules

Motion is standardized as a series of system-wide tokens to ensure consistency.

- **Timing**: Transitions are gated between 150ms and 300ms. Non-interactive ambient cycles operate at 12s-18s.
- **Easing**: We utilize custom bezier curves to mimic natural Newtonian physics, avoiding linear or erratic movement.
- **Scale Limits**: Hover states are restricted to a 2% scale increase (1.02x) to provide feedback without breaking the visual grid.
- **Standardized States**: All buttons, inputs, and cards follow a uniform state transition map (Rest -> Hover -> Press -> Success/Error).

---

## Project Structure

The codebase is organized for modularity and long-term maintainability:
- **app/**: Next.js App Router pages and API routes, structured by functional domain.
- **components/**: Atomic UI components, shared layouts, and the core design system.
- **lib/**: Shared utilities, service wrappers, and business logic.
- **prisma/**: Database schema definitions and migration history.

This structure ensures that the system is easily auditable and scalable for multi-developer environments.

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- PostgreSQL instance

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/workproof"
   JWT_SECRET="your-secret-key"
   ```
4. Initialize the database:
   ```bash
   npx prisma generate
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Contribution Philosophy

We maintain a high standard for code and design discipline. Reviewers prioritize:
- **Restraint**: We prefer removal over addition. Every new feature must justify its visual and cognitive weight.
- **Predictability**: Code should follow established patterns. Novelty is discouraged unless it solves a fundamental performance or security issue.
- **Performance**: Every interaction must be lightweight and accessible.
- **Documentation**: All logic changes must be reflected in the documentation system.

## Closing Statement

WorkProof is built to earn trust — not attention.
