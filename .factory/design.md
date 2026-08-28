# Visual thesis: a paper-cut preflight bench

## Direction and rationale

Firebase Environment Doctor uses a **paper-cut diorama**: a small, calm
inspection bench assembled from layered cardstock. Firebase debugging usually
starts in intangible state—aliases, shells, cached auth, ports, and cloud
projects. Giving each layer a physical edge makes environment boundaries
legible. The visual metaphor is not “medical software”; it is a careful bench
check before a tool touches a live system.

The site is explicitly light-mode. Paper, ink, pencil marks, and cut edges are
the material vocabulary; a dark theme would obscure rather than extend this
thesis. The terminal inset provides a focused dark working surface inside the
light workshop.

## Palette

| Token | Value | Role |
| --- | --- | --- |
| paper | `#F4EBDD` | page background, warm and non-clinical |
| paper-raised | `#FFF9EF` | lifted cut layers |
| ink | `#17243B` | primary text and terminal |
| ink-muted | `#586174` | secondary copy; 5.4:1+ on paper |
| ember | `#C94416` | primary action, derived from Firebase warmth |
| ember-deep | `#9D2E0B` | hover/action contrast |
| teal | `#126D69` | verified/check state |
| mustard | `#A46E06` | caution state |
| danger | `#A52B35` | error state |
| cut-shadow | `rgba(23, 36, 59, .16)` | physical layer depth |

State always includes a label or symbol; color is never the only signal.

## Type

- Headings: **Fraunces**, a locally stored variable serif subset. Its soft,
  irregular shapes feel printed rather than software-generic.
- Interface and terminal: **IBM Plex Mono**, locally stored regular and
  semibold subsets. It connects the paper bench to the command line and uses
  tabular figures for diagnostics.
- Body copy is 16–18px with 1.6 leading and a maximum measure of 68 characters.
  The type scale is 16, 18, 22, 32, and clamp(42–72) px.

## Spacing, composition, and responsive intent

The base rhythm is 4px, with primary spaces at 8, 16, 24, 32, 48, 72, and
96px. Sections alternate between broad unboxed paper and genuinely independent
lifted diagnostic slips. Corners use clipped/chamfered geometry rather than the
rounded-card default. Fine dashed “cut” rules show routes between checks.

Desktop hero is an editorial spread: copy left, illustration right, with the
diagnostic tape crossing their boundary. At 390px it becomes a single story:
headline, primary install action, illustration, then demo. Decorative paper
tabs are reduced and navigation condenses without hiding documentation.

## Interaction grammar and motion

- Buttons depress by 2px as if pressing cardstock.
- The demo's selected case swaps the diagnostic slip in place and announces
  the result through a polite live region.
- On first view, layers rise 8–16px into place over 180–280ms using only
  transform and opacity. Nothing loops.
- With `prefers-reduced-motion: reduce`, transforms and smooth scrolling are
  removed and state changes are instant. Depth remains through static offset
  shadows and overlapping paper edges.
- Focus uses a 3px ink outline with a 3px paper offset, visible on every paper
  and dark-terminal surface.

## Asset plan and provenance

The hero, `site/public/assets/doctor-diorama-dfb324dc.webp`, is an original raster made
for this product with the factory Azure image deployment (`factory-image`) via
`/opt/fleet/lib/gen-image.sh` on 2026-08-28, then locally resized/encoded to
WebP. It is descriptive atmosphere, not required to understand the tool; its
alt text explains the diagnostic stations. License: project-owned generated
asset under this repository's MIT license.

Generation prompt:

> Handcrafted paper-cut diorama of a tiny diagnostic workbench inspecting a
> safe development environment before work begins; layered off-white paper
> landscape, dark navy terminal as the central object, orange beacon, teal
> paper cables linking distinct cloud, local emulator, and rules stations;
> hovering magnifying lens over a checkmark route; tactile stop-motion paper
> craft, visible fibers and subtle cast shadows; wide 3:2 editorial framing;
> parchment, midnight ink, ember, teal, mustard palette; no people, words,
> letters, logos, gradients, glossy 3D, or watermark.

All other marks (check glyphs, paper tabs, cut lines) are original CSS shapes
or plain text symbols. There are no stock icons or third-party runtime assets.
