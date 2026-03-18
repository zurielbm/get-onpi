---
name: ui-design
description: Helps create, fix, and refactor user interfaces by applying Refactoring UI principles. Use when designing UI, improving visual hierarchy, fixing spacing/color/typography issues, or polishing interface aesthetics.
---

# UI Design Skill

This skill provides systematic guidelines for creating beautiful, functional user interfaces based on the Refactoring UI methodology. It helps transform "good enough" designs into professional, polished interfaces.

## When to Use This Skill

- Creating new user interfaces from scratch
- Fixing visual issues (poor hierarchy, bad spacing, color problems)
- Refactoring existing UI to look more professional
- Improving user experience through better design
- Polishing interfaces with depth, shadows, and finishing touches
- Keywords: UI, design, styling, layout, hierarchy, spacing, color, fix UI, improve UI, refactor UI

## Core Principles

Before diving into specifics, remember these foundational rules:

1. **Start with too much white space** — then reduce as needed
2. **Not every element deserves attention** — de-emphasize secondary content
3. **Use HSL for colors**, not hex — it's more intuitive to adjust
4. **Establish systems** — don't use arbitrary values for spacing, colors, or typography
5. **Design in grayscale first** — add color only after hierarchy is clear

---

## 1. Visual Hierarchy

**The most important skill for making designs "feel designed."**

### Size Alone Isn't Enough
Don't rely only on font size to establish hierarchy. Use a combination of:
- **Font weight** — Bold for primary, regular/light for secondary
- **Color contrast** — Dark for important, muted grays for supporting text
- **Spacing** — More space around important elements

### The Three-Level System
For any element, identify:
1. **Primary** — Main content users must see (bold, dark, prominent)
2. **Secondary** — Supporting information (smaller, muted, less weight)
3. **Tertiary** — Metadata and labels (smallest, most muted)

```css
/* Example hierarchy in CSS */
.primary { 
  font-size: 1.25rem; 
  font-weight: 600; 
  color: hsl(220, 30%, 15%); /* Darkest */
}
.secondary { 
  font-size: 1rem; 
  font-weight: 400; 
  color: hsl(220, 15%, 40%); /* Medium */
}
.tertiary { 
  font-size: 0.875rem; 
  font-weight: 400; 
  color: hsl(220, 10%, 55%); /* Muted */
}
```

### De-emphasizing Techniques
- Use softer colors (not just smaller text)
- Lighter font weights
- Move to less prominent positions
- Don't paint icons prominent colors — they're already visually heavy

### Labels vs. Data
If data can speak for itself, labels may be unnecessary:
- ❌ "Email: john@example.com"
- ✅ "john@example.com" (format is self-evident)

When labels are needed, make the data prominent, not the label.

---

## 2. Layout and Spacing

### The Spacing System
Use a predefined scale (multiples of 4px or 8px):
```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;
  --space-10: 128px;
}
```

### Whitespace Rules
1. **Start too spacious** — It's easier to tighten than to loosen
2. **Space around groups > space within groups** — Related elements cluster together
3. **Don't fill the whole screen** — Elements should only take space they need
4. **Use columns wisely** — Wide text is hard to read (45-75 characters ideal)

### Common Fixes
| Problem | Solution |
|---------|----------|
| Cramped UI | Increase padding by 50-100% |
| Disorganized appearance | Group related elements with more internal space between groups |
| Text too wide | Constrain max-width to 65ch |
| Everything floats | Add clear section separators or backgrounds |

---

## 3. Typography (Designing Text)

### Font Size Scale
Use a musical ratio (like golden ratio or major third):
```css
:root {
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
}
```

### Line Height Rules
- **Body text (small)**: 1.5-1.75 line height
- **Headlines (large)**: 1.1-1.3 line height
- **Rule of thumb**: The larger the text, the tighter the line height

### Font Weight Guidelines
- 400: Body text
- 500: Medium emphasis
- 600-700: Headlines, strong emphasis
- Avoid: 300 (thin) for body text — hard to read

### Letter Spacing
- Tight spacing (`-0.02em`) for large headlines
- Normal for body text
- Wide spacing (`0.05em`) for small uppercase labels

### Typography Fixes
| Problem | Solution |
|---------|----------|
| Boring headlines | Use heavier weight + tighter letter spacing |
| Dense paragraphs | Increase line height to 1.5-1.75 |
| All caps unreadable | Add letter spacing + reduce size |
| Text feels weak | Use darker color, not bigger size |

---

## 4. Color

### HSL Color System
Always use HSL (Hue, Saturation, Lightness):
```css
/* Base blue */
--blue-500: hsl(210, 80%, 50%);

/* Variations are intuitive */
--blue-100: hsl(210, 80%, 95%);  /* Lighter - increase L */
--blue-900: hsl(210, 80%, 20%);  /* Darker - decrease L */
```

### Building a Complete Palette
You need more than 5 colors. Build comprehensive shade ranges:

```css
:root {
  /* Greys (8-10 shades) */
  --gray-50: hsl(220, 15%, 97%);
  --gray-100: hsl(220, 15%, 92%);
  --gray-200: hsl(220, 13%, 85%);
  --gray-300: hsl(220, 12%, 75%);
  --gray-400: hsl(220, 10%, 60%);
  --gray-500: hsl(220, 10%, 45%);
  --gray-600: hsl(220, 12%, 35%);
  --gray-700: hsl(220, 14%, 25%);
  --gray-800: hsl(220, 16%, 18%);
  --gray-900: hsl(220, 20%, 10%);

  /* Primary color (8-10 shades each) */
  --primary-50: hsl(210, 100%, 97%);
  --primary-500: hsl(210, 100%, 50%);
  --primary-900: hsl(210, 100%, 20%);

  /* Semantic colors */
  --success: hsl(145, 65%, 40%);
  --warning: hsl(40, 95%, 50%);
  --error: hsl(0, 75%, 55%);
}
```

### Color Application Rules
1. **Use color sparingly** — It should emphasize, not overwhelm
2. **Don't rely on color alone** — Support with icons, text, or patterns for accessibility
3. **Use softer colors for large backgrounds** — Saturated colors for accents only
4. **Define colors for both light and dark states**

### Fixing Color Issues
| Problem | Solution |
|---------|----------|
| Colors feel garish | Reduce saturation, adjust lightness |
| UI looks bland | Add accent colors to key actions |
| Poor contrast | Use darker text, lighter backgrounds |
| Colors clash | Ensure consistent hue temperature |

---

## 5. Creating Depth

### Light Source Mental Model
Imagine light coming from above. This affects:
- **Inset elements**: Darker top edge, lighter bottom edge
- **Raised elements**: Lighter top edge, shadow below
- **Consistent shadows**: All fall the same direction

### Shadow Scale
Define a shadow system:
```css
:root {
  --shadow-sm: 0 1px 2px hsla(220, 20%, 20%, 0.08);
  --shadow-md: 0 2px 4px hsla(220, 20%, 20%, 0.1);
  --shadow-lg: 0 4px 8px hsla(220, 20%, 20%, 0.12);
  --shadow-xl: 0 8px 16px hsla(220, 20%, 20%, 0.15);
  --shadow-2xl: 0 16px 32px hsla(220, 20%, 20%, 0.2);
}
```

### Using Shadows
- **Smaller shadows**: Buttons, inputs, cards close to content
- **Larger shadows**: Modals, dropdowns, elements that "float"
- **Layered shadows**: More realistic depth with multiple shadow layers

```css
/* Layered shadow for realistic effect */
.card {
  box-shadow: 
    0 1px 1px hsla(0, 0%, 0%, 0.04),
    0 2px 4px hsla(0, 0%, 0%, 0.06),
    0 4px 16px hsla(0, 0%, 0%, 0.08);
}
```

### Flat Design with Depth
Even "flat" designs use subtle depth:
- Slight color differences between layers
- Subtle shadows to separate elements
- Overlapping elements

---

## 6. Working with Images

### Image Treatment
- **Don't place text directly on images** — Use overlays or semi-transparent backgrounds
- **Ensure contrast** — Text must be readable
- **Consider colorizing images** — Overlay with brand color at low opacity

### Image Overlays
```css
/* Dark overlay for text on image */
.image-container::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    hsla(0, 0%, 0%, 0.1),
    hsla(0, 0%, 0%, 0.7)
  );
}

/* Brand color overlay */
.hero::after {
  background: hsla(210, 100%, 40%, 0.6);
  mix-blend-mode: multiply;
}
```

### Icon Sizing
- Icons should align with text they accompany
- Don't stretch icons — use proper sizing
- Consider icon weight matching font weight

---

## 7. Finishing Touches

### Subtle Enhancements
1. **Colored borders** — Use brand colors instead of pure gray
2. **Colored shadows** — Tint shadows with the element's color
3. **Accent lines** — Add thin colored bars to cards/sections

```css
/* Colored top border accent */
.card {
  border-top: 4px solid var(--primary-500);
}

/* Colored shadow */
.button-primary {
  box-shadow: 0 4px 12px hsla(210, 100%, 50%, 0.35);
}
```

### Interactive States
Define clear states:
```css
.button {
  /* Default */
  background: var(--primary-500);
  transition: all 150ms ease;
}
.button:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}
.button:active {
  background: var(--primary-700);
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}
.button:focus-visible {
  outline: 2px solid var(--primary-300);
  outline-offset: 2px;
}
```

### Empty States
Design for when there's no content:
- Use friendly illustrations
- Provide clear calls to action
- Never show blank tables/lists

---

## Decision Tree for UI Issues

```
What's the problem with the UI?
├── Looks unprofessional/plain
│   ├── Check hierarchy → Apply 3-level system
│   ├── Check spacing → Use consistent scale
│   └── Add depth → Subtle shadows and borders
│
├── Feels cramped
│   ├── Increase padding → 50-100% more
│   ├── Add group spacing → More between, less within
│   └── Reduce content density → Remove unnecessary elements
│
├── Hard to read
│   ├── Check contrast → Darken text
│   ├── Check line height → Increase to 1.5+
│   └── Check font size → Minimum 16px for body
│
├── Colors look wrong
│   ├── Too garish → Reduce saturation
│   ├── Too bland → Add accent colors
│   └── Inconsistent → Use predefined palette
│
└── Lacks polish
    ├── Add transitions → Smooth hover/active states
    ├── Add subtle accents → Colored borders, shadows
    └── Improve empty states → Add illustrations + CTAs
```

---

## Quick Checklist for UI Review

### Hierarchy
- [ ] Is there a clear primary/secondary/tertiary structure?
- [ ] Are labels de-emphasized, data emphasized?
- [ ] Are icons using muted colors (not competing with text)?

### Spacing
- [ ] Using a consistent spacing scale?
- [ ] Generous whitespace between sections?
- [ ] Related elements grouped tightly?

### Typography
- [ ] Body text at least 16px?
- [ ] Line height 1.5+ for body text?
- [ ] Headlines using proper weight + letter-spacing?

### Color
- [ ] Using HSL for all colors?
- [ ] Complete palette with shade ranges?
- [ ] Sufficient contrast (4.5:1 for text)?

### Depth
- [ ] Layered shadows for raised elements?
- [ ] Consistent light source direction?
- [ ] Subtle depth even in flat designs?

### Polish
- [ ] All interactive elements have hover/active states?
- [ ] Smooth transitions (150-300ms)?
- [ ] Colored accents and shadows?

---

## Examples

### Before/After: Card Component

**Before (common mistakes):**
```css
.card {
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 12px;
}
.card h3 { font-size: 18px; }
.card p { color: #333; }
```

**After (applying principles):**
```css
.card {
  padding: var(--space-6);
  background: white;
  border-radius: 8px;
  border-top: 4px solid var(--primary-500);
  box-shadow: var(--shadow-md);
}
.card h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--gray-900);
  letter-spacing: -0.01em;
}
.card p {
  font-size: var(--text-base);
  color: var(--gray-600);
  line-height: 1.6;
  margin-top: var(--space-2);
}
```

---

## Implementation Approach

When asked to create/fix/refactor UI:

1. **Analyze the current state** — Take screenshots, identify issues
2. **Apply hierarchy first** — Structure content into levels
3. **Fix spacing next** — Use consistent scale, generous whitespace
4. **Refine typography** — Weight, size, line height
5. **Add color systematically** — Build/use a complete palette
6. **Layer in depth** — Shadows, borders, accents
7. **Polish interactions** — States, transitions, micro-animations
8. **Test and iterate** — Verify readability, contrast, usability
