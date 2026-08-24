---
name: LogPlus Sentinel
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#c6c5cf'
  on-secondary: '#2f3038'
  secondary-container: '#4a4b53'
  on-secondary-container: '#bcbbc5'
  tertiary: '#ffb786'
  on-tertiary: '#502400'
  tertiary-container: '#df7412'
  on-tertiary-container: '#461f00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e3e1ec'
  secondary-fixed-dim: '#c6c5cf'
  on-secondary-fixed: '#1a1b22'
  on-secondary-fixed-variant: '#46464e'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1440px
  sidebar-width: 260px
  gutter: 1rem
  section-gap: 1.5rem
  component-padding-x: 0.75rem
  component-padding-y: 0.5rem
---

## Brand & Style

This design system is built for high-stakes Security Operations Center (SOC) environments. The aesthetic is rooted in **Modern Minimalism** with a focus on functional density and cognitive clarity. 

The personality is authoritative, precise, and unobtrusive. It avoids decorative flourishes in favor of structural integrity. The interface recedes into the background to prioritize the visibility of log data and security anomalies. Visual hierarchy is established through subtle shifts in surface luminance and restrained use of status-driven colors. 

The primary emotional response should be one of professional control and systemic reliability.

## Colors

The palette is strictly dark-mode optimized, utilizing a grayscale foundation to manage depth. 

- **Foundation:** The deep neutral (#09090b) anchors the application, reducing eye strain during long monitoring shifts.
- **Surfaces:** Use `surface_secondary` for sidebars and headers, and `surface_tertiary` for nested cards or floating panels.
- **Accents:** The primary blue is used sparingly for interactive states and focus indicators.
- **Semantics:** Status colors are high-contrast against the dark background but restricted to semantic indicators (icons, thin pips, or text). Do not use these colors for large surface areas.

## Typography

The system utilizes **Inter** for all UI elements to ensure maximum legibility and a neutral, professional tone. **JetBrains Mono** is introduced specifically for log data, IP addresses, and hash strings to facilitate character-level recognition.

- **Scale:** Typography is slightly smaller than consumer apps to allow for higher data density.
- **Hierarchy:** Use `label-caps` for section headers in sidebars and table headers.
- **Contrast:** High-importance data uses White (#FFFFFF). Secondary metadata uses Zinc-400 (#a1a1aa). Tertiary or disabled text uses Zinc-500 (#71717a).

## Layout & Spacing

This design system follows a **Fixed-Fluid** hybrid model. 

- **Sidebar:** A fixed 260px sidebar on the left contains primary navigation. It does not collapse on desktop but may transform into a drawer on mobile.
- **Main Content:** Utilizes a fluid grid with a max-width of 1440px for dashboard views to prevent line-lengths from becoming unreadable on ultra-wide monitors.
- **Density:** Spacing is compact. A base unit of 4px is used. Most containers use 16px (1rem) padding, while dense data tables reduce this to 8px or 12px.
- **Breakpoints:**
  - Mobile: < 768px (Single column, hidden sidebar)
  - Tablet: 768px - 1024px (Collapsed sidebar, 2-column grid)
  - Desktop: > 1024px (Full sidebar, multi-column dashboard)

## Elevation & Depth

Depth is communicated through **Tonal Layering** and **Subtle Borders** rather than heavy shadows.

1.  **Level 0 (Base):** #09090b. Used for the main application background.
2.  **Level 1 (Surface):** #18181b. Used for sidebars, navigation bars, and page headers.
3.  **Level 2 (Raised):** #27272a. Used for individual cards, tiles, and modal backgrounds.

**Borders:** All raised surfaces must have a 1px solid border using `#3f3f46`. This provides the necessary definition in a dark environment where shadows are less effective.
**Shadows:** Use only for overlays (modals, dropdowns). Shadows should be sharp, near-black, with a 10% opacity spread to prevent a "floating" look that breaks the flat, professional aesthetic.

## Shapes

The shape language is disciplined and geometric. 

- **Radius:** A standard radius of 6px (Soft/1) is applied to all buttons, input fields, and cards. This provides a modern touch without appearing overly "bubbly" or consumer-oriented.
- **Icons:** Use 20px optical size icons with a 1.5px or 2px stroke weight. Avoid filled icons unless indicating an active/selected state.

## Components

### Buttons
- **Primary:** Background `#3b82f6`, Text White. No gradients.
- **Secondary:** Background transparent, Border `#3f3f46`, Text White.
- **Ghost:** Background transparent, Text `#a1a1aa`. For low-priority actions.
- **Sizing:** Compact (32px height) for dashboards; Standard (40px) for settings/forms.

### Input Fields
- **Default:** Background `#09090b`, Border `#3f3f46`, Text White.
- **Focus:** Border `#3b82f6`, 1px solid. No outer glow.
- **Placeholder:** Text `#71717a`.

### Cards & Panels
- Background `#27272a`, Border `#3f3f46`. 
- Padding: 1.25rem (20px).
- Internal dividers: 1px solid `#3f3f46`.

### Data Tables
- **Header:** Background `#18181b`, Text `#71717a`, Uppercase, 11px.
- **Row:** Border-bottom `#18181b`. Hover state background `#18181b`.
- **Log Row:** Use JetBrains Mono for the message column.

### Status Indicators
- **Badges:** Muted background (10% opacity of status color) with solid text of the status color. Example: Critical badge has background `rgba(239, 68, 68, 0.1)` and text `#ef4444`.
- **Pips:** 8x8px solid circles used next to system names or log levels.

### Additional Components
- **Timeline/Log Stream:** Vertical line `#3f3f46` connecting log entries.
- **Mini-Sparklines:** Used in dashboard cards to show 24h trends of log volume. Use status colors for the line stroke.