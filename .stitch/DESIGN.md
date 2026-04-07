# Concert Playlist -- Stitch Design Tokens

Mood: music discovery, concert energy, dark mode, bold typography.
Palette: purple/pink/red gradient on a near-black canvas.

## Color Tokens

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#0a0a0a` | Page background, root canvas |
| `--color-surface` | `#141414` | Cards, inputs, panels |
| `--color-surface-hover` | `#1c1c1c` | Surface hover state |
| `--color-surface-active` | `#242424` | Surface active/pressed state |
| `--color-text` | `#f0f0f0` | Primary text |
| `--color-text-muted` | `#a0a0a0` | Secondary labels, descriptions |
| `--color-text-subtle` | `#666666` | Tertiary text, timestamps, metadata |
| `--color-border` | `#1e1e1e` | Default borders |
| `--color-border-hover` | `#333333` | Border hover state |
| `--color-accent` | `#a855f7` | Primary interactive (buttons, links, focus rings) |
| `--color-accent-hover` | `#9333ea` | Accent hover state |
| `--color-accent-dim` | `rgba(168, 85, 247, 0.15)` | Accent tint for backgrounds, selections |
| `--color-accent-secondary` | `#ec4899` | Secondary accent (pink, gradient midpoint) |
| `--color-success` | `#22c55e` | Positive actions, confirmations |
| `--color-danger` | `#ef4444` | Errors, destructive actions, YouTube red |
| `--color-gradient-start` | `#a855f7` | Gradient left (purple) |
| `--color-gradient-mid` | `#ec4899` | Gradient center (pink) |
| `--color-gradient-end` | `#ef4444` | Gradient right (red) |

## Gradient

The signature gradient runs purple to pink to red. Apply it to hero text, progress indicators, and accent borders.

```css
background: linear-gradient(to right, var(--color-gradient-start), var(--color-gradient-mid), var(--color-gradient-end));
```

Tailwind usage:
```html
bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end
```

## Tailwind v4 Usage

These tokens are declared in `src/index.css` inside a `@theme inline` block.
Tailwind v4 auto-generates utility classes from custom properties in `@theme`.

Examples:
- `bg-bg` resolves to `background-color: #0a0a0a`
- `text-text-muted` resolves to `color: #a0a0a0`
- `border-border` resolves to `border-color: #1e1e1e`
- `bg-accent` resolves to `background-color: #a855f7`
- `ring-accent` resolves to `--tw-ring-color: #a855f7`

## Surface Hierarchy

1. `bg` (#0a0a0a) -- page canvas
2. `surface` (#141414) -- first elevation (cards, inputs, dropdowns)
3. `surface-hover` (#1c1c1c) -- interactive hover on surfaces
4. `surface-active` (#242424) -- pressed/selected surfaces

## Text Hierarchy

1. `text` (#f0f0f0) -- headlines, primary content
2. `text-muted` (#a0a0a0) -- descriptions, secondary info
3. `text-subtle` (#666666) -- timestamps, metadata, tertiary

## Next Steps

Components still use hardcoded Tailwind classes (purple-400, gray-950, white/10, etc.).
The design review pass will migrate each component to use these semantic tokens.
