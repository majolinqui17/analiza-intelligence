# Design System

## Principles

The product should feel executive, professional, clean, modern, responsive, accessible, and easy to present in meetings. Operational screens should stay dense, calm, and scannable.

## Initial Palette

- Primary navy for structure and navigation.
- Electric blue for active states and primary action accents.
- Very light gray app background.
- White cards for repeated content and bounded tools.
- Red only for alerts and destructive states.
- Green only for positive outcomes.
- Amber for warnings and incomplete data.

## Business Line Identity

The protected BI shell uses one accent color per active business line. The global selector writes the selected context, and the shell applies `data-business-line-theme` so navigation, primary actions, active states and chart variables inherit the correct color.

- Consolidado keeps the executive navy.
- Laboratorio uses indigo as its operating identity.
- Fisioterapia uses teal/green as its operating identity.
- Imagenes uses diagnostic blue as its operating identity.

Line colors identify scope; they do not replace semantic colors. Red remains risk, amber remains warning or incomplete data, and green remains positive performance unless the active line is Fisioterapia.

## Component Guidance

- Use accessible reusable components.
- Use lucide-react icons when an icon exists.
- Use segmented controls for modes, toggles for binary settings, and menus for option sets.
- Keep cards to repeated items, dialogs, and bounded tools.
- Avoid card-in-card layouts.
- Avoid excessive gradients, decorative blobs, 3D charts, and unnecessary animation.
- Every KPI needs a tooltip with definition, formula, source, and last update.

Phase 2 uses a dense executive shell: collapsible sidebar, compact header filters, small KPI cards, and simple 2D bar visualizations. This keeps the BI surface scannable in meetings and avoids misleading decorative charts.

## Branding

Do not invent the logo. Provide configurable slots for:

- group logo
- company logo
- favicon
- corporate colors
