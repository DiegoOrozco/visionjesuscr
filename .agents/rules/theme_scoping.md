# Theme Scoping Rules for Visión Jesús

1. **Auténticas Theme Isolation (`/autenticas`):**
   - The white background (`#FFFFFF`), coffee/brown text (`var(--accent-coffee)`), gold accents, and `/logo.png` logo are EXCLUSIVELY for the `/autenticas` page.
   - The footer text `© Conferencia de Mujeres Auténticas` belongs ONLY to `/autenticas`.

2. **Official Visión Jesús Theme (All other routes: `/`, `/nosotros`, `/modelo`, `/congresos`, etc.):**
   - All other pages MUST use the official dark theme:
     - Header background: `rgba(3, 8, 18, 0.95)` / `#030812` with backdrop filter.
     - Logo: `/logo_oficial_transparente.png` (Visión Jesús cross logo).
     - Text color: `#EAEDF8` with `#977DFF` (purple) for hover and active state.
     - Body & Root Wrapper Background: `#030812` (dark) by default across all routes to prevent beige stripe leakage.
     - Footer: `© Iglesia Visión Jesús. Todos los derechos reservados.`
