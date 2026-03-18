# Card Component Example

This example demonstrates applying Refactoring UI principles to a common card component.

## Before: Common Mistakes

```html
<div class="card">
  <h3>Card Title</h3>
  <p>This is some card content that explains what the card is about.</p>
  <span>Category</span>
  <button>Learn More</button>
</div>
```

```css
.card {
  border: 1px solid #ddd;
  padding: 15px;
  margin: 10px;
}
.card h3 {
  font-size: 18px;
  margin: 0 0 10px 0;
}
.card p {
  color: #333;
  margin: 0 0 10px 0;
}
.card span {
  background: #eee;
  padding: 3px 6px;
  font-size: 12px;
}
.card button {
  background: blue;
  color: white;
  padding: 8px 16px;
  border: none;
}
```

### Issues:
- ❌ Generic gray border (no depth)
- ❌ Arbitrary spacing values (15px, 10px, 3px)
- ❌ Plain hex colors (not systematic)
- ❌ No visual hierarchy between elements
- ❌ Button uses generic "blue" 
- ❌ No hover states or polish

---

## After: Applying Refactoring UI Principles

```html
<div class="card">
  <div class="card-badge">Featured</div>
  <h3 class="card-title">Card Title</h3>
  <p class="card-description">This is some card content that explains what the card is about.</p>
  <button class="card-button">Learn More →</button>
</div>
```

```css
/* Using the design system variables */
.card {
  /* Generous padding using scale */
  padding: var(--space-6);
  
  /* Depth via shadow instead of border */
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  
  /* Accent border for polish */
  border-top: 4px solid var(--primary-500);
  
  /* Smooth transitions */
  transition: all var(--transition-default);
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

/* Badge - Tertiary hierarchy */
.card-badge {
  display: inline-block;
  padding: var(--space-1) var(--space-2);
  background: var(--primary-50);
  color: var(--primary-700);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  border-radius: var(--radius-default);
  margin-bottom: var(--space-4);
}

/* Title - Primary hierarchy */
.card-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--gray-900);
  letter-spacing: var(--tracking-tight);
  line-height: var(--leading-tight);
  margin: 0 0 var(--space-3) 0;
}

/* Description - Secondary hierarchy */
.card-description {
  font-size: var(--text-base);
  color: var(--gray-600);
  line-height: var(--leading-relaxed);
  margin: 0 0 var(--space-5) 0;
  max-width: var(--max-w-prose);
}

/* Button - Call to action */
.card-button {
  padding: var(--space-3) var(--space-5);
  background: var(--primary-500);
  color: white;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-default);
  box-shadow: var(--shadow-sm);
}

.card-button:hover {
  background: var(--primary-600);
  box-shadow: var(--shadow-primary);
}

.card-button:active {
  background: var(--primary-700);
  transform: translateY(1px);
  box-shadow: var(--shadow-xs);
}

.card-button:focus-visible {
  outline: 2px solid var(--primary-300);
  outline-offset: 2px;
}
```

### Improvements Made:

| Principle | Implementation |
|-----------|----------------|
| **Hierarchy** | Clear primary/secondary/tertiary structure with title, description, and badge |
| **Spacing** | Consistent scale (space-1, space-3, space-5, space-6) |
| **Typography** | Proper weight (semibold titles), letter-spacing, line-height |
| **Color** | HSL-based systematic palette |
| **Depth** | Shadow instead of border, hover elevation |
| **Polish** | Colored accent border, smooth transitions, focus states |

---

## Dark Mode Variant

```css
/* Dark mode using same design system */
@media (prefers-color-scheme: dark) {
  .card {
    background: var(--gray-800);
    border-top-color: var(--primary-400);
    box-shadow: 
      0 4px 6px hsla(0, 0%, 0%, 0.15),
      0 2px 4px hsla(0, 0%, 0%, 0.12);
  }
  
  .card-badge {
    background: var(--primary-900);
    color: var(--primary-200);
  }
  
  .card-title {
    color: var(--gray-50);
  }
  
  .card-description {
    color: var(--gray-300);
  }
}
```
