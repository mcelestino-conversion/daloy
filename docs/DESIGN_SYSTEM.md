# Daloy Design System

## Identity

Daloy means “flow.” The product voice is calm, direct, and approachable. The visual system is dark-first, warm, minimal, and optimized for prolonged workflow editing.

## Color tokens

| Token | Value | Use |
| --- | --- | --- |
| Background | `#141414` | Application ground |
| Canvas | `#1A1917` | Workflow workspace |
| Sidebar | `#1B1A18` | Navigation and utility panels |
| Surface | `#242321` | Cards and panels |
| Elevated | `#292723` | Nodes and raised controls |
| Border | `#393732` | Dividers and control boundaries |
| Sandstone | `#D6C2A4` | Sole brand accent and focus color |
| Ivory | `#F5F0E8` | Primary text |
| Taupe | `#A9A198` | Secondary text |

Status messages use restrained warm variants and always include text or an icon; meaning never depends on color alone.

## Typography and spacing

- Typeface: Geist Sans, with Inter and system sans-serif fallbacks.
- Body copy: 14px with comfortable line height; 12px is reserved for metadata.
- Headings: 18–28px, moderate weight, tight tracking.
- Technical payloads: monospace browser default inside `pre` elements.
- Spacing follows an 8px foundation with 4px half-steps where controls require precision.

## Components

- Cards use 10–12px corners, charcoal fills, and 1px boundaries.
- Buttons use 9px corners and 36–40px heights. Primary actions use sandstone with near-black text.
- Focus-visible states use a 2px sandstone outline with offset.
- Icons are Lucide line icons; they support labels rather than replacing unfamiliar concepts.
- Hover transitions are 150ms. Panels use 200ms. Reduced-motion preferences collapse animation duration.

## Workflow canvas

React Flow renders a dotted background using canvas `#1A1917`, dots `#5D574E`, 20px spacing, and 1.25px dots. Pan, zoom, and fit controls remain available on desktop.

Every workflow node uses the confirmed Warm Sandstone Glow:

```css
.workflow-node {
  background: radial-gradient(
    ellipse at 50% 0%,
    #3B352D 0%,
    #242321 78%
  );
  border: 1px solid #48433C;
  border-radius: 12px;
}

.workflow-node.selected {
  border-color: #D6C2A4;
}
```

This is the only decorative gradient in the product. Node handles and selected boundaries use sandstone; edges remain muted until execution progress reaches them.

## Accessibility

- Interactive controls have visible labels or accessible names.
- Keyboard focus is always visible.
- Native dialogs, buttons, selects, and details elements preserve expected semantics.
- Text and controls are not distinguished only by color.
- Desktop three-panel editing becomes a step list plus full-screen configuration on smaller screens.
