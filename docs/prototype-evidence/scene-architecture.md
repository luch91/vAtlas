# Layered scene architecture

## Independently rendered objects

- Six floating islands are individual focusable buttons with transparent sprite artwork, independent hover/focus/selection transforms and depth shadows.
- Finalised GenLayer artefacts are separate record islands, never decorative labels.
- Preview card, camera controls and minimap are screen-space UI.

## Animated depth layers

- Sky plate: 0.12 camera factor.
- Atmospheric haze: 0.28 camera factor.
- Object/world plane: 1.0 camera factor.
- Foreground cloud veil: 1.13 camera factor.

## Baked artwork

The distant skyline, tiny background islands and clouds in `atlas-world.jpg` remain non-interactive atmosphere. They are darkened and softened so object sprites read as the active world.

## Camera

The 1800×1050 world uses viewport-derived pan limits, pointer-centred wheel zoom, midpoint-anchored two-pointer pinch, deterministic focus transforms and a world-coordinate minimap with a live viewport rectangle.

