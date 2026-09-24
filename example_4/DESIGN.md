---
name: "Clima Agora"
description: "Current-weather lookup as a nocturnal atmospheric signal station."
colors:
  midnight: "#020b17"
  field: "#061528"
  control-surface: "#081a2e"
  fog: "#f8fafc"
  daylight: "#e8f0fa"
  action-dark: "#020617"
  ion: "#67e8f9"
  cyan-deep: "#0e7490"
  ultraviolet: "#a78bfa"
  alert: "#f43f5e"
typography:
  display:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "clamp(3rem, 5vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 0.94
    letterSpacing: "-0.045em"
  body:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.75rem"
  label:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.16em"
  measurement:
    fontFamily: "Azeret Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 600
rounded:
  base: "8px"
  compact: "9px"
  control: "10px"
  toggle: "12px"
  surface: "14px"
spacing:
  compact: "8px"
  control: "20px"
  surface: "24px"
  surface-expanded: "32px"
  section: "56px"
components:
  navigation-header:
    backgroundColor: "transparent"
    textColor: "{colors.fog}"
    padding: "20px 0"
  theme-toggle-active:
    backgroundColor: "{colors.ion}"
    textColor: "#083344"
    rounded: "{rounded.compact}"
    size: "36px"
  search-rail:
    backgroundColor: "{colors.control-surface}"
    textColor: "{colors.fog}"
    rounded: "{rounded.surface}"
    padding: "8px"
  search-action:
    backgroundColor: "{colors.ion}"
    textColor: "#083344"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  weather-bay:
    backgroundColor: "{colors.field}"
    textColor: "{colors.fog}"
    rounded: "{rounded.surface}"
    padding: "24px"
---

# Design System: Clima Agora

## Overview

**Creative North Star: "The Nocturnal Signal Station"**

Clima Agora treats a city lookup as an atmospheric reading rather than a miniature forecast dashboard. The default dark mode is a deep, quiet instrument panel: fog-white information, ion-cyan signals, restrained ultraviolet reference marks, and a low-contrast contour field establish presence without competing with the weather reading.

Expression is functional. The canvas field is a live environmental layer, the query is a scan, and the resolved result is a measurement bay that settles into place. A light mode keeps the same calibrated structure for visitors who choose it; it is a counterpart, not a separate visual identity. The system rejects pale, card-heavy weather dashboards, oversized hero metrics detached from context, and decorative weather imagery.

**Key Characteristics:**

- Midnight instrument surfaces with fog-white reading text and rare ion-cyan signals.
- Fine ruled divisions, exact measurement labels, and a real canvas contour field.
- Instrument Sans for language and Azeret Mono only for numerical measurements.
- A single weather bay that makes condition, temperature, location, and supporting values read in order.

## Colors

The palette is a dark-first atmospheric field: near-black depth holds the interface, cool cyan communicates live signal and interaction, and ultraviolet appears only as a quiet orbital reference.

### Primary

- **Ion Signal:** Carries active dark-mode actions, focused controls, icons, and the selected dark-theme control. Keep it scarce so a signal remains a signal.
- **Deep Cyan Instrument:** Grounds cyan icons, condition labels, the light-mode search hover, and the light canvas field without turning the page into a bright dashboard.

### Secondary

- **Ultraviolet Reference:** Draws the dashed internal orbit and the moving scan wedge; it is an auxiliary coordinate, never a primary CTA color.

### Tertiary

- **Alert Rose:** Reserved for an interrupted signal: the error marker, border, and text state.

### Neutral

- **Midnight:** The initial page field and the dark action base.
- **Atmosphere Field:** The resolved weather bay and state-bay surface in dark mode.
- **Control Surface:** The dark search rail and theme-switch enclosure.
- **Fog:** The high-emphasis reading color on the dark instrument.
- **Daylight:** The pale blue-white counterpart for the light page field.

### Named Rules

**The Rare Signal Rule.** Ion is evidence of a live or actionable system state. Do not use it as a broad fill, a decorative background, or the default color for every label.

**The Single Alarm Rule.** Rose communicates interruption only. Successful, neutral, and loading states stay in the cyan/fog vocabulary and also name their state in text.

## Typography

**Display Font:** Instrument Sans (with sans-serif fallback)

**Body Font:** Instrument Sans (with sans-serif fallback)

**Label/Mono Font:** Azeret Mono (with monospace fallback) for measured values only

**Character:** Instrument Sans makes the proposition direct and contemporary; Azeret Mono gives the measurements an instrument-readout precision without turning prose into a terminal.

### Hierarchy

- **Display:** Owns the short introductory proposition. It is compact, heavy enough to hold the page, and tightly tracked rather than airy.
- **Headline:** The resolved temperature is the dominant live reading. It stays in Instrument Sans so the result feels legible before it feels technical.
- **Title:** Condition and operational messages use clear medium-weight text rather than a second decorative display style.
- **Body:** Explanatory copy uses a relaxed reading rhythm and a constrained introduction width.
- **Label:** Uppercase, widely tracked labels identify sections, state, and data provenance; labels remain short.
- **Measurement:** Azeret Mono is limited to the three result-strip values.

### Named Rules

**The One Mono Rule.** Use Azeret Mono for values that are being measured, not for titles, paragraphs, navigation, or generic UI labels.

## Layout

The page is a full-height instrument sheet within a centered, 72rem-wide frame. A ruled header is followed by a vertically centered desktop two-column composition: proposition and city query on the left, a tall reading bay on the right. The contour canvas stays behind this content and never accepts pointer input. A thin ruled footer closes the sheet.

Space is intentional rather than dense: the introduction-to-query interval is generous, while controls and metric cells use compact internal spacing. At the small breakpoint, the search rail changes from a vertical stack to one row; at the large breakpoint, the sheet becomes two columns. On narrow screens, proposition, query, and bay stack while the query action remains full-height and easy to target.

**The Readout Order Rule.** A resolved result must read location and recency first, condition and temperature second, then the three supporting measurements as one strip. Do not fragment them into unrelated stat cards.

## Elevation & Depth

Depth is primarily tonal and field-based, not shadow-led. The dark mode uses closely related midnight surfaces, spectral rules, and the canvas bloom/contours to create an atmospheric plane; dark cards deliberately have no shadow. The light counterpart adds only a very soft, low-offset shadow below the search rail and weather bay to preserve separation against daylight.

### Shadow Vocabulary

- **Light rail lift:** A restrained shadow underneath the light-mode search enclosure; it distinguishes an input rail without making it float like a generic dashboard card.
- **Light bay lift:** A wider, softer shadow under the light-mode weather bay; it supports the same reading plane as the dark tonal layering.
- **Selected theme lift:** A compact shadow belongs only to the active theme icon button, confirming the selected control.

### Named Rules

**The Field Before Float Rule.** Establish depth with tonal surfaces, hairline rules, and the atmosphere field before adding shadow. Shadows are absent in dark mode and restrained in light mode.

## Shapes

The language is calibrated and softly technical: primary surfaces use the surface-radius token, while actions and compact controls step down through the control and compact tokens. The only circular geometry is meaningful—the concentric orbital condition marker and status dots. Borders are thin, low-contrast spectral rules; split metrics with rules rather than separately rounded containers.

## Components

### Buttons

Search action is a compact, full-height control embedded in the city rail. In the initial dark mode it is ion with midnight text; the light counterpart uses a dark action with white text. Hover shifts the action toward its theme-appropriate cyan, disabled state reduces opacity and removes the implied affordance, and keyboard focus uses an ion ring with a contrasting offset.

### Inputs / Fields

The city search is one enclosed rail: a transparent text field, placeholder city example, and search action share the same surface. The enclosure responds to keyboard focus by strengthening its cyan border. Its mobile stack becomes a horizontal rail at the small breakpoint; do not detach the action into an unrelated control.

### Navigation

The header is quiet and ruled, with a radio-tower glyph, the tracked product label, and an explicit two-button light/dark theme group. The selected theme button gains its own filled surface and compact lift. Unselected choices stay subdued until hover or focus; the default theme is dark unless the visitor has stored a choice.

### Cards / Containers

The weather bay and operational state bay are tall, single surfaces with a spectral border. The weather bay gives the top line to location and recency, the center to temperature plus orbital reading, and the base to a three-column ruled metric strip. State bays preserve the same tall footprint so empty, scanning, and error responses do not reflow the sheet.

### Signal States

State bays use a named status line with a colored dot, an icon, direct message, and data source rule. Loading pulses only the dot while the background canvas animates its violet scan wedge. Error switches to the alert vocabulary and an alert role; it never relies on color alone.

### Orbital Reading

The condition marker is a circular cyan weather icon held between a thin outer orbit and a dashed ultraviolet inner orbit. It is a reading instrument, not a badge or a floating decorative sticker. Keep its form circular and its cyan/ultraviolet marks low-contrast enough that temperature remains the primary result.

### Measurement Strip

Three equal cells—apparent temperature, humidity, and wind—share top and bottom rules with internal vertical divisions. Each cell combines a cyan icon, uppercase label, and mono value. Preserve the three-cell strip as one coherent comparative reading.

## Do's and Don'ts

### Do:

- **Do** begin in dark mode when no stored preference exists, and retain the matched light counterpart for an explicit theme choice.
- **Do** use the contour field, cyan bloom, and scan wedge as atmosphere behind content; keep the canvas decorative and non-interactive.
- **Do** make city lookup state explicit in Portuguese through label, copy, icon, and status semantics.
- **Do** use the surface-radius token for the search and weather/state bays, then reduce radius only for embedded actions and small controls.
- **Do** let current temperature lead the resolved weather bay, with the condition marker as supporting context.

### Don't:

- **Don't** replace the measurement strip with separate KPI cards, pill chips, or a generic forecast grid.
- **Don't** turn the contour field into a photographic background, shipping raster asset, or high-contrast illustration.
- **Don't** use ultraviolet as a general-purpose interactive color or rose outside the interrupted-signal state.
- **Don't** apply broad drop shadows in dark mode or use shadow as the primary way to separate surfaces.
- **Don't** use mono typography for prose, navigation, or the display proposition.
