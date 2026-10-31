# UI Guidelines

## Application shell

Desktop pages use persistent left navigation. The builder collapses navigation to an icon rail to preserve canvas room. Tablet and mobile use a menu header. Primary destinations are Dashboard, Templates, My Flows, Connections, and Activity.

Page content is capped at 1440px, uses spacious section rhythm, and avoids decorative analytics. Every visible action must change local state, open a useful view, or navigate somewhere meaningful.

## Page conventions

- **Dashboard:** workspace totals, recently edited flows, recent simulations, and three recommended templates.
- **Templates:** search and category controls precede a responsive card gallery. Preview is required before or alongside template use.
- **My Flows:** desktop table-like rows collapse into stacked records on small screens. Destructive deletion requires confirmation.
- **Connections:** cards clearly state that accounts are simulated and local-only.
- **Activity:** run selection and step details share one workspace on desktop and stack on smaller widths.

## Builder behavior

Desktop uses a compact navigation rail, canvas, 360px configuration panel, and collapsible execution panel. Selecting a node opens configuration; changes update the node summary immediately. Add controls appear between sequential steps.

Tablet and mobile replace the canvas with a top-to-bottom step overview. Selecting a step opens configuration full-screen. The workflow header retains save and simulation access without forcing three columns into a narrow viewport.

## Interaction rules

- Default to plain-language labels such as “Simulate” and “Connect demo.”
- Preserve the trigger as the first, non-removable step.
- Disable reorder controls when a move would violate sequence constraints.
- Confirm destructive actions and announce save, duplicate, and deletion outcomes.
- Show empty states with one clear next action.
- Keep technical JSON behind expandable step details.

## Responsive and accessibility rules

- Minimum touch target is 40px; navigation targets are 44px on mobile.
- Layouts are checked at 1440px, 768px, and 390px.
- Controls use semantic HTML and `focus-visible` treatment.
- Motion is short, purposeful, and disabled effectively under `prefers-reduced-motion`.
- Error, success, and status states combine language with visual treatment.
