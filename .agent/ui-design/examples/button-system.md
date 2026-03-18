# Button System Example

A complete button system demonstrating hierarchy, consistent styling, and interactive states.

## Button Variants

### Primary Button
For main calls to action. Only one per view section.

```css
.btn-primary {
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

.btn-primary:hover {
  background: var(--primary-600);
  box-shadow: var(--shadow-primary);
  transform: translateY(-1px);
}

.btn-primary:active {
  background: var(--primary-700);
  transform: translateY(0);
  box-shadow: var(--shadow-xs);
}

.btn-primary:focus-visible {
  outline: 2px solid var(--primary-300);
  outline-offset: 2px;
}

.btn-primary:disabled {
  background: var(--gray-300);
  color: var(--gray-500);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
```

### Secondary Button
For secondary actions. Can appear multiple times.

```css
.btn-secondary {
  padding: var(--space-3) var(--space-5);
  background: white;
  color: var(--gray-700);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-default);
}

.btn-secondary:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
  color: var(--gray-900);
}

.btn-secondary:active {
  background: var(--gray-100);
}

.btn-secondary:focus-visible {
  outline: 2px solid var(--primary-300);
  outline-offset: 2px;
}
```

### Ghost Button
For tertiary actions or navigation.

```css
.btn-ghost {
  padding: var(--space-3) var(--space-5);
  background: transparent;
  color: var(--gray-600);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-default);
}

.btn-ghost:hover {
  background: var(--gray-100);
  color: var(--gray-900);
}

.btn-ghost:active {
  background: var(--gray-200);
}
```

### Danger Button
For destructive actions (delete, remove).

```css
.btn-danger {
  padding: var(--space-3) var(--space-5);
  background: var(--error-500);
  color: white;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-default);
  box-shadow: var(--shadow-sm);
}

.btn-danger:hover {
  background: var(--error-600);
  box-shadow: var(--shadow-error);
}

.btn-danger:active {
  background: var(--error-700);
}
```

---

## Button Sizes

```css
/* Small - for compact UIs, tables, inline actions */
.btn-sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
  border-radius: var(--radius-default);
}

/* Medium (default) */
.btn-md {
  padding: var(--space-3) var(--space-5);
  font-size: var(--text-sm);
  border-radius: var(--radius-md);
}

/* Large - for hero sections, emphasized CTAs */
.btn-lg {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-base);
  border-radius: var(--radius-lg);
}
```

---

## Icon Buttons

```css
/* Icon only button */
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background: transparent;
  color: var(--gray-500);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-default);
}

.btn-icon:hover {
  background: var(--gray-100);
  color: var(--gray-700);
}

/* Button with icon and text */
.btn-with-icon {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.btn-with-icon svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
```

---

## Button Group

```css
.btn-group {
  display: inline-flex;
}

.btn-group > .btn {
  border-radius: 0;
}

.btn-group > .btn:first-child {
  border-radius: var(--radius-md) 0 0 var(--radius-md);
}

.btn-group > .btn:last-child {
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.btn-group > .btn:not(:last-child) {
  border-right: 1px solid var(--gray-200);
}
```

---

## Usage Guidelines

| Variant | Use When |
|---------|----------|
| **Primary** | Main action in the view (Submit, Save, Confirm) |
| **Secondary** | Alternative actions (Cancel, Back, Edit) |
| **Ghost** | Tertiary actions, navigation links styled as buttons |
| **Danger** | Destructive actions (Delete, Remove) |

### Hierarchy Examples

```
Good: [Ghost: Cancel] [Secondary: Save Draft] [Primary: Publish]
Bad:  [Primary: Cancel] [Primary: Save] [Primary: Publish]
```

Only one primary button per section. Use secondary and ghost for everything else.
