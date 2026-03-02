# Kevin Taylor — Portfolio Specification

## Vision

A **grotesque-modern editorial** portfolio. Think Swiss design meets fashion magazine meets interactive web art. Sharp geometry, warm materiality, restrained animation that rewards curiosity. The site should feel like a physical object — a well-bound book with surprising details — not a template.

**One sentence:** Clean enough to frame, alive enough to play with.

---

## Design Language

### Aesthetic Pillars

| Pillar | Expression |
|--------|-----------|
| **Sharp** | Zero border-radius everywhere — cards, buttons, badges, inputs, images. Hard 90° edges. |
| **Warm** | Beige/cream background palette. Nothing cold or clinical. Paper-like materiality. |
| **Colorful** | Pale-bright accent palette (coral, periwinkle, violet, teal, amber). Each section gets its own color identity. Never monochrome. |
| **Editorial** | Tight typographic hierarchy. Numbered sections. Generous whitespace. Grid-line aesthetic for card layouts. |
| **Restrained Motion** | Animations are earned — scroll-triggered reveals, subtle tilts, cursor-aware spotlights. No gratuitous loops or bounces. |

### What It Is NOT

- Not dark mode / cyberpunk / neon-on-black
- Not bubbly / rounded / playful (no border-radius, no emojis)
- Not overdone with effects (no particle storms, no heavy WebGL, no parallax on every element)
- Not a SaaS landing page

---

## Color System

### Base Palette

| Token | Hex | Role |
|-------|-----|------|
| `--bg` | `#f2ece4` | Page background — warm beige |
| `--bg-secondary` | `#e8e0d6` | Slightly darker beige for depth |
| `--surface` | `#ebe4db` | Card/component backgrounds |
| `--surface-hover` | `#dfd7cc` | Hovered surface state |
| `--border` | `#d4cabf` | Borders, dividers, grid-lines |
| `--text` | `#2a2520` | Primary text — warm near-black |
| `--text-muted` | `#8a7f72` | Secondary/caption text |

### Accent Palette

Each accent is **pale but saturated** — visible on beige without being aggressive.

| Token | Hex | Section Assignment |
|-------|-----|--------------------|
| `--pink` | `#e85d75` | Section 01 (About), primary CTA, click sparks |
| `--blue` | `#5b8cf5` | Section 02 (Work) |
| `--violet` | `#9b72f2` | Section 03 (Skills), ASCII art tint |
| `--teal` | `#4ecdc4` | Availability status, stat accent |
| `--orange` | `#f2994a` | Section 04 (Contact) |

### Color Rules

- Section numbers (`01`, `02`, etc.) use their section's accent color
- Project cards each get a unique accent (pink, blue, violet, teal) for hover states, tags, and badges
- Gradient text uses the full accent rainbow for emphasis moments
- Stats grid: each stat cell gets its own accent color
- Social icons: each gets a unique accent on hover

---

## Typography

### Fonts

| Role | Font | Weights |
|------|------|---------|
| **Display / Body** | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) | 300, 400, 500, 600, 700 |
| **Mono / Labels** | [Space Mono](https://fonts.google.com/specimen/Space+Mono) | 400, 700 |

### Type Scale

| Element | Size | Weight | Tracking | Notes |
|---------|------|--------|----------|-------|
| Hero heading | `6.5rem` (desktop) / `3rem` (mobile) | 700 | `-0.03em` | Line-height `0.95` |
| Section heading | `3.5rem` (desktop) / `2.5rem` (mobile) | 700 | `-0.02em` | Line-height `1.1` |
| Body text | `1rem` | 400 | normal | Line-height `1.8` |
| Section label | `11px` | 400 (mono) | `0.3em` | Uppercase, mono |
| Card label / Tag | `11px` | 400 (mono) | `0.2em` | Uppercase, mono |
| Nav links | `11px` | 400 (mono) | `0.15em` | Uppercase, mono |

---

## Layout

### Grid

- Max content width: `1152px` (`max-w-6xl`)
- Horizontal padding: `32px` mobile, `48px` desktop
- Section vertical padding: `160px` (`py-40`)

### Card Grid Pattern

Cards use a **1px grid-line** aesthetic instead of traditional gaps:

```
┌────────────┬────────────┐
│            │            │
│   Card 1   │   Card 2   │
│            │            │
├────────────┼────────────┤
│            │            │
│   Card 3   │   Card 4   │
│            │            │
└────────────┴────────────┘
```

Implementation: parent has `gap-px bg-[--border]`, children have `bg-[--surface]`. The 1px gap reveals the border color underneath.

---

## Sections

### Navigation

- Fixed top, transparent → frosted glass on scroll (beige/90% opacity + `backdrop-blur-md`)
- Logo: "KT." in mono, bold — DecryptedText scramble on hover
- Links: `01 About` / `02 Work` / `03 Skills` / `04 Contact` — numbers in section accent color
- Mobile: full-screen overlay, staggered entrance, sharp hamburger (3 lines, animates to X)

### Hero

- Full viewport height, centered content
- **Aurora** component as ambient background — very subtle (opacity ~0.12, heavy blur ~180px), using all five accent colors
- **ASCII art** of the name "KEVIN" — rendered via canvas, tinted violet at low opacity (~0.3 alpha)
- **SplitText** animation on "Creative Developer" — letters slide up on load
- **RotatingText** cycling: "interfaces" / "experiences" / "products" / "interactions"
- Two CTAs: primary (filled, dark bg, sharp rectangle) and secondary (outlined, sharp rectangle)
- Both CTAs wrapped in **Magnet** component for cursor-pull effect
- Scroll indicator at bottom: "SCROLL" label + thin gradient line
- No grid overlay, no excessive decorative elements

### About (Section 01)

- Two-column layout: text left, stats right
- Left: **BlurText** heading animation (word-by-word blur-in), two body paragraphs, availability indicator (square dot + mono text)
- Right: 2×2 stats grid using **SpotlightCard** with 1px grid-line layout
  - Each stat: large **CountUp** number in its accent color + small uppercase label
  - Cursor-following spotlight glow on each card
- **DecryptedText** on section label

### Work (Section 02)

- 2-column grid of project cards using 1px grid-line layout
- Each card wrapped in **TiltedCard** (subtle 5° max tilt) → **SpotlightCard**
- Card contents:
  - Sharp-edged image with hover scale (`1.03`)
  - Year badge (top-right corner, sharp rectangle, accent-colored text)
  - Title that changes to accent color on hover
  - Arrow icon that shifts on hover
  - Description text
  - Tech tags (sharp-edged, `11px` mono, accent-colored on hover)
- **GradientText** on "speak volumes" in section heading
- 4 projects, each with unique accent color identity

### Skills (Section 03)

- **Squares** background — animated diagonal grid, very subtle hover fills
- 4-column grid (responsive: 2 → 4) using 1px grid-line layout
- Each column: category title in accent color with square dot indicator, list of skills with vertical pipe markers
- Hover: entire column bg shifts to `--surface-hover`, text brightens with staggered delays
- Below: full-width **tech marquee** — oversized outlined text (`-webkit-text-stroke: 1px`) scrolling slowly (~40s loop), barely visible (0.05 opacity)

### Contact (Section 04)

- Two-column: info left, form right
- Left: **GradientText** heading, description, email with label, social icons (square, 1px border, each with unique accent hover)
- Right: minimalist form — underline-only inputs (no boxes), focus states use different accent colors per field (pink/blue/violet)
- Submit button: **StarBorder** component (rotating conic gradient border), sharp rectangle
- Social icons wrapped in **Magnet** for pull effect

### Footer

- Minimal single row: "KT." + copyright left, "React + TypeScript | React Bits" right
- Separated by vertical pipe dividers (`w-px h-3`)
- All `11px` mono, muted color

---

## Interactive Components (from [reactbits.dev](https://reactbits.dev))

### Required Components

| Component | Purpose | Config |
|-----------|---------|--------|
| **Aurora** | Hero ambient background | 5 accent colors, blur 180, opacity 0.12, speed 0.6 |
| **ASCIIText** | Hero name display | Canvas-rendered, 5px char size, violet tint |
| **SplitText** | Hero heading entrance | Letter-by-letter translateY reveal, 35ms delay |
| **RotatingText** | Hero subtitle cycling | 2500ms interval, vertical slide transition |
| **BlurText** | About heading entrance | Word-by-word blur + translateY reveal |
| **DecryptedText** | Section labels | Character scramble on scroll-into-view |
| **GradientText** | Emphasis text | Full accent rainbow, 6s animation cycle |
| **CountUp** | Stats numbers | Ease-out cubic, 2.5s duration, scroll-triggered |
| **AnimatedContent** | Scroll reveals | 30px travel, 0.8s duration, staggered delays |
| **SpotlightCard** | Cards | Cursor-following radial gradient, accent-tinted |
| **TiltedCard** | Project cards | 5° max tilt, 1.02 scale, perspective 1000 |
| **Squares** | Skills background | Diagonal, 60px squares, very faint hover fills |
| **Magnet** | Buttons / links | 40-50px activation radius, 0.4 pull strength |
| **ClickSpark** | Global click effect | 8 particles, 4px, coral pink |
| **CustomCursor** | Global cursor | 8px dot + 28px ring, dark on beige, accent on hover |
| **StarBorder** | Submit button | Rotating conic gradient, coral, 6s rotation |

### Animation Philosophy

- **Scroll reveals**: short travel (30px), no rotations, cubic-bezier ease-out
- **Hovers**: color transitions only (300ms), no scale/transform except project images (scale 1.03, 700ms)
- **Tilt**: subtle (5° max), only on project cards
- **Cursor**: small and precise, ring trails smoothly (0.15 lerp), grows on interactive elements
- **Click sparks**: delightful but brief — small, few, fast fade
- **No**: `animate-pulse` on visible elements, parallax scrolling, loading animations, page transitions

---

## Technical Stack

| Tool | Version | Purpose |
|------|---------|---------|
| **Vite** | Latest | Build tool + dev server |
| **React** | 18+ | UI framework |
| **TypeScript** | 5+ | Type safety |
| **Tailwind CSS v4** | Latest | Styling (via `@tailwindcss/vite` plugin) |
| **GSAP** | Latest | Available for advanced animations if needed |
| **Framer Motion** | Latest | Available for layout animations if needed |

### Project Structure

```
src/
├── components/
│   ├── reactbits/          # All ReactBits-style components (copy-paste, no npm package)
│   │   ├── Aurora.tsx
│   │   ├── ASCIIText.tsx
│   │   ├── SplitText.tsx
│   │   ├── RotatingText.tsx
│   │   ├── BlurText.tsx
│   │   ├── DecryptedText.tsx
│   │   ├── GradientText.tsx
│   │   ├── ShinyText.tsx
│   │   ├── CountUp.tsx
│   │   ├── AnimatedContent.tsx
│   │   ├── SpotlightCard.tsx
│   │   ├── TiltedCard.tsx
│   │   ├── Squares.tsx
│   │   ├── Magnet.tsx
│   │   ├── ClickSpark.tsx
│   │   ├── CustomCursor.tsx
│   │   └── StarBorder.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
├── sections/
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Projects.tsx
│   ├── Skills.tsx
│   └── Contact.tsx
├── App.tsx
├── main.tsx
└── index.css               # Tailwind import + @theme tokens
```

### Tailwind v4 Configuration

All design tokens defined via `@theme` in `index.css` — no `tailwind.config`. Colors are referenced as `var(--color-*)` in both Tailwind classes and inline styles.

### Key CSS Notes

- **No global reset** — Tailwind v4 preflight handles it. A manual `* { margin: 0 }` will override all Tailwind spacing utilities due to layer specificity.
- Custom cursor: `cursor: none` on `body`, `a`, and `button`
- Custom scrollbar: 4px width, muted thumb color
- `::selection`: accent pink background, white text
- `-webkit-font-smoothing: antialiased` for crisp type

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| Mobile (`<768px`) | Single column layouts, reduced type scale, hamburger nav, full-screen mobile menu |
| Tablet (`768px+`) | 2-column grids (projects, stats, skills) |
| Desktop (`1024px+`) | Full layout — 2-col about, 2-col projects, 4-col skills, 2-col contact |

---

## Content (Placeholder)

All content is placeholder and should be replaced with real information:

- **Name**: Kevin Taylor
- **Title**: Creative Developer
- **Email**: hello@kevintaylor.dev
- **Projects**: 4 placeholder projects with Unsplash images
- **Stats**: 5+ years, 50+ projects, 30+ clients, 99% coffee
- **Skills**: Frontend (React, Next, TS, Tailwind, Framer, Three.js), Backend (Node, Python, PG, GraphQL, Redis, Docker), Design (Figma, Adobe, Motion, Proto, UX, Brand), Tools (Git, AWS, Vercel, CI/CD, Testing, Agile)
- **Socials**: GitHub, LinkedIn, Twitter, Dribbble

---

## Quality Bar

- [ ] Zero `border-radius` on any visible element
- [ ] Every section reveals on scroll with staggered timing
- [ ] Custom cursor visible and responsive on desktop, hidden on mobile/touch
- [ ] Click anywhere produces subtle spark particles
- [ ] All interactive elements (links, buttons) trigger cursor expansion
- [ ] Each section has its own accent color identity
- [ ] Stats and project grids use 1px grid-line pattern (not card gaps)
- [ ] Type hierarchy is consistent: `11px` mono uppercase for all labels/tags
- [ ] Aurora background is barely perceptible — atmospheric, not distracting
- [ ] ASCII name art visible but ghostly
- [ ] Marquee scrolls slowly and is nearly invisible — texture, not content
- [ ] Form inputs are underline-only with colored focus states
- [ ] Site feels fast — no layout shifts, no jank, no loading spinners
- [ ] Responsive and usable on mobile without custom cursor
