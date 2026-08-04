# MyMo Design System

A design system for **MyMo**, the mobile banking app of **GSB — Government Savings Bank (ธนาคารออมสิน), Thailand**. This system captures MyMo's visual language, typography, color, iconography, components and full-screen UI kits so designers and agents can produce on-brand interfaces, prototypes and marketing assets.

> MyMo is a state-bank consumer app. The brand reads **friendly, soft and approachable** — a warm crimson-pink, rounded SF Pro Display type, generous white cards on a pale gray canvas, soft cool-gray shadows, and pill-shaped gradient buttons. It is a *bank* app, so it stays calm, legible and trustworthy; the playfulness lives in color and the rounded logo, not in decoration.

---

## Sources

Everything here was reverse-engineered from the **MyMo Android app codebase** (read-only, mounted as `main/`). No Figma or brand book was provided.

| Source | Location | Used for |
|---|---|---|
| Android app code | `main/` | The single source of truth |
| Color palette | `main/res/values/colors.xml` | All color tokens |
| Type ramp & text styles | `main/res/values/styles.xml`, `dimens.xml` | Typography tokens |
| Spacing / radius / elevation | `main/res/values/dimens.xml` | Spacing & radius tokens |
| Fonts | `main/res/font/sf_pro_display_*.otf` | Webfonts (copied to `assets/fonts/`) |
| Icons | `main/res/drawable/ic_*.xml` (vector) | Converted to SVG in `assets/icons/` |
| Copy / strings | `main/res/values/strings.xml` | Content & tone analysis |
| Launcher / splash art | `main/ic_launcher-playstore.png`, `uploads/bg_splash_screen.png` | Brand assets |

**Substitution flags:** none for fonts (SF Pro Display `.otf` files were shipped in the app and are used directly). Icons are the app's own vector drawables, converted 1:1 to SVG.

---

## The products inside MyMo

MyMo is one app spanning a wide retail-banking surface area:

- **Core banking** — account balances, transaction timeline, e-passbook, transfers, bill payment
- **Payments** — PromptPay (register / QR / request-to-pay), QuickPay, QR scan, top-up, MyCard / MyCash (ATM withdrawal by QR)
- **Wealth** — mutual funds (buy/sell/onboarding), debentures, digital savings (**Digital Salak** — the digital lottery-bond savings product), Monthly Fixed deposits
- **Insurance** — travel, PA (personal accident), annuity, general insurance, GSB Life
- **Lending** — AimJai Loan, Multi-Product Loan, COVID relief loans, pre-screening, NCB credit scoring
- **Cards** — debit & credit card management, MyCard, virtual pin pad
- **Identity / KYC** — NDID, face recognition (liveness), New Customer ID onboarding
- **Family** — MyMo Parent (linked child accounts)
- **Security** — PDPA consent, VKEY runtime security, root/hook/VPN detection

The primary surface this system recreates is the **consumer mobile app** (Android phone, ~430px design width).

---

## CONTENT FUNDAMENTALS

How MyMo writes. All examples below are verbatim from `strings.xml`.

**Language.** The app is bilingual TH/EN; this system documents the **English** voice. Thai is the primary market language and some flows mix scripts inline (e.g. button copy `"Please click on \"ถัดไป/Next\""`).

**Tone — warm, human, lightly informal.** It speaks like a helpful person, not a bank form. Friendly emoticons (`:)`) appear in success and reassurance moments — these are **ASCII emoticons, never emoji**:
- `"We've found you :)"`
- `"Your savings is on track :)\nDon't forget your tax!"`
- `"All Done! Thank you for helping us test the new MyMo App :)"`
- `"Welcome!"`

**Person.** Second person, addressing the user directly as **"you / your"**. Possessives are personal: **"My Accounts", "My Favorites", "My Card", "My Life", "My Suggestions"** — the "My" prefix is a signature of the brand (it's literally in the name *MyMo*).

**Casing.** **Title Case** for screen titles, menu items and buttons (`Set your passcode`, `Request Statement`, `Bill Payment`). **ALL-CAPS** is reserved for small metadata eyebrows and labels (`MAIN BALANCE`, `AVAILABLE`, `LAST 12 MONTHS`, `INTEREST`, `START FROM`). Sentence case for body/instructional text.

**Instructions are short, polite imperatives**, often prefixed with "Please":
- `"Please enter your Citizen ID"`
- `"Please set your 6-digit passcode"`
- `"Please check your internet connection or try again."`

**Errors are calm and apologetic — never blame the user.** They explain and offer a next step:
- `"Something went wrong\nPlease try again later."`
- `"MyMo has encountered an unexpected error. Please try again later."`
- `"MyMo system is currently unavailable. We are working as quickly as possible to restore the system back in service. Sorry for the inconvenience."`

**Success is celebratory but brief:** `"All Done!"`, `"Transaction Successful"`, `"Statement Request Successful"`, `"You've changed Passcode Successfully!"`.

**Naming.** Product names are kept as proper nouns and frequently bilingual brand coinages: **Digital Salak, MyCard, MyCash, MyPrompt QR, AimJai Loan, GSB Salak**. The app refers to itself as **"MyMo"** (capital M, capital M).

**Vibe in one line:** a trusted local bank that talks to you like a friendly teller — clear, encouraging, never stiff.

---

## VISUAL FOUNDATIONS

**Color.** The brand is built on a single hero hue: **MyMo crimson-pink `#D83152`** (`colorPrimary` = `colorAccent`). It's warmer and pinker than a typical "bank red." Pressed/dark states drop to `#9C233B`. A soft pink family supports it — `#F39AAF` (theme pink), `#EA6B7A` (landing), `#FEE5EF` (pastel chip backgrounds), `#FEB1C4` (status bar tint). Three pale accent themes round it out: cyan-green `#9FEDF2`, yellow `#FAE694`, blue `#76CFF5`. Neutrals are an iOS-style cool gray stack (`#8E8E93`, `#C7C7CC`, `#F4F4F4`). The app canvas is **pale gray `#F4F4F4`** with **white cards** floating on it.

**Gradients — used deliberately, not everywhere.** The signature is the **button gradient** (`#FA7C93 → #F14658`, left-to-right) on the pill primary button, and a **header gradient** (`#FC7C96 → #D83152`, vertical). Product-category cards carry their own gradients (Savings `#E04369→#FF7295`, Loan `#00CDCE→#2CBFCF`, Digital Salak `#FF8840→#F9AD4C`, Fixed `#2796E5→#25CFE7`, GSB Life `#6B67EA→#5EA5E7`). Plain content cards are **flat white**, never gradient. Avoid blue-purple "tech" gradients — they're off-brand except the GSB Life category.

**Typography.** One typeface everywhere: **SF Pro Display**, in five weights (Light 300 / Regular 400 / Medium 500 / SemiBold 600 / Bold 700). Sizes run an 8→45px ramp. Body is 16px Regular; balances and hero numerals are 40px Bold; eyebrows are 11px SemiBold uppercase. `includeFontPadding` is off in the app — type is tight and optically centered.

**Backgrounds.** The brand background motif is **large, soft concentric rings / circles** in tonal pink (see `bg_splash_screen.png` and the landing curve). Headers often use a **bezier/wave bottom curve** (`home_bezier_curve_height: 170dp`, `landing_curve_height`) where a pink gradient header flows into the white content area with a rounded scoop. No photography-heavy backgrounds; no noise/grain; no dark mode (the app is light-only — status bar is black-on-light).

**Corner radius.** Everything is rounded and soft. Cards = **16px** (large) or 8px (small). Buttons = **25px pill**. Dialogs & chips = 20px. Inputs = 8px. Circular elements (avatars, FABs, category icons) are full circles.

**Cards.** White fill, 16px radius, **soft cool-gray shadow** (`shadow_account_card #CCE9E9EA` — a pale blue-gray at ~80% alpha) — diffuse, low-contrast, never a hard drop shadow. Some cards instead use a **1px hairline border** (`#CCE9E9EA` stroke, transparent fill) rather than a shadow. Hairlines/dividers are `#EDEDED`–`#E7E7E7`.

**Buttons.** Primary = pill (25px), gradient `#FA7C93→#F14658`, white bold 18px text, 48px tall, min-width 184px. Secondary = pill outline, 1px `#D83152` stroke, transparent fill, brand-colored text. Disabled primary fades to a muted gradient/gray. There's also a small variant (32px tall, 16px text).

**Shadows / elevation.** Soft and cool-toned. Card elevation ≈ 4–8dp equivalent; FABs and the pink floating "+" carry a brand-tinted glow. Bottom sheets cast an upward shadow.

**Animation.** Gentle and functional — **fades** (`fade_in_fast`, `fade_out_fast`) and **slide-up-from-bottom** for sheets/dialogs (`slide_up_from_bottom_no_delay` / `slide_down_to_bottom`). Shared-element transitions on account card → detail. No bouncy/springy or playful motion; easing is standard ease-in-out. Keep motion subtle.

**Press & hover states.** This is a touch app, so **press** matters more than hover: pressed keys/buttons shift to a slightly darker fill (`custom_keyboard_state_pressed #C9CED6`), and tappable rows get a light ripple/gray highlight. For web recreations: hover = slight darken or subtle shadow lift; press = darken + tiny scale-down (~0.98).

**Transparency & blur.** Used sparingly. Overlays/scrims are black at 40–60% (`#99000000` camera frame, `#8F000000` dialog scrim). White-on-image protection uses white at 56–74% (`#8FFFFFFF`). No heavy frosted-glass blur in the core app.

**Layout rules.** Fixed top toolbar (56px) and fixed bottom tab bar (56px, 5 tabs: Home · Accounts · Pay-by-Scan · History · Settings). 16px screen side gutters. Content scrolls between the fixed chrome. A central **Pay-by-Scan** tab often gets a raised/emphasized treatment.

**Imagery vibe.** Warm and pink-leaning; bright, optimistic, clean. Illustrations are flat and simple. No grain, no duotone, no moody/cool photography.

---

## ICONOGRAPHY

**System.** MyMo ships its **own custom icon set** as Android vector drawables (`res/drawable/ic_*.xml`). There is **no third-party icon font** (no Material Icons / FontAwesome) and **no emoji** used as UI icons. We converted the app's real vector drawables 1:1 into clean SVGs in **`assets/icons/`** — these are the authentic MyMo icons, not substitutes.

**Style.** Two coexisting treatments:
1. **Monochrome marks** — single-color line/solid glyphs (tab bar, search, settings, share, hamburger, arrows). These are exported with `fill/stroke="currentColor"` so they tint to any color via CSS `color:`. Default tint is `--text-tertiary` (`#8E8E93`) inactive, `--color-brand` (`#D83152`) active.
2. **Two-tone "chip" icons** — a soft pastel circular background plus a brand-colored glyph (e.g. `ic_insurance_heart`: `#FDDFE4` chip + `#EA0A4E` heart). These keep their literal colors and are used for product/category entry points.

**Stroke & weight.** Line icons use a ~2.7px stroke at a 24px viewbox, rounded caps and joins (see `ic_tab_scan`) — friendly, medium-weight, never hairline-thin.

**Tab bar set.** `ic_tab_home`, `ic_tab_accounts`, `ic_tab_scan`, `ic_tab_payment`, `ic_tab_history`, `ic_tab_more`.

**Logo.** The **`mymo` wordmark** (`ic_mymo_logo.svg`) is a single rounded-script path in `#D83152` — lowercase, continuous, playful. On pink backgrounds it's rendered white (set `color:#fff`). The app/launcher icon (`assets/brand/ic_launcher.png`) is the wordmark + "GSB" on a pink concentric-ring tile.

**Usage.** Prefer the SVGs in `assets/icons/`. Size at 24px (inline), 18px (dense), 32–48px (feature). If you need an icon not in the set, substitute the **closest match from a rounded line set** (e.g. Lucide / Material Symbols Rounded) and **flag the substitution** — but check `main/res/drawable/ic_*.xml` first, as the app likely already has it.

**Available SVGs** (`assets/icons/`): arrow, billscan, black_arrow_right, book_dstatement, calendar_filter, close, contact_book, digitalsalak_deposit, file_download, hamberger, hotkey_payment, info, insurance_heart, insurance_savings, key, mymo_logo, note, pencil, plus_white, schedule, search, setting_gear, share, tab_accounts, tab_history, tab_home, tab_more, tab_payment, tab_scan, transfer_landing, tune.

---

## INDEX / manifest

Root files:
- `styles.css` — global entry point; `@import`s the four token files. **Consumers link this.**
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skills front-matter wrapper.

`tokens/` — design tokens (`@import`ed by `styles.css`):
- `fonts.css` (SF Pro Display @font-face ×5) · `colors.css` · `typography.css` · `spacing.css`

`assets/`:
- `fonts/` — SF Pro Display `.otf` ×5
- `icons/` — 31 MyMo icons as tintable SVG
- `brand/` — `ic_launcher.png`, `ic_quick_pay.png`, `ic_shield_mymo.png`, `bg_splash_screen.png`

`guidelines/` — foundation specimen cards (Design System tab): colors (brand, pink, accents, neutrals, semantic, categories), type (weights, roles, scale), spacing (scale, radius, elevation), brand (logo, app icon, icon set).

`components/` — reusable React primitives (compiled into `window.MyMoDesignSystem_*`):
- `core/` — **Icon**, **Button**, **Card**, **Badge**, **Avatar**, **AmountText**, **SectionHeader**
- `forms/` — **Input**, **Switch**, **Chip**, **PinDots**
- `navigation/` — **ListRow**, **BottomTabBar**, **TopBar**

`ui_kits/`:
- `mymo_app/` — full interactive MyMo app recreation (login → home, accounts, transfer, scan, history, settings). See its `README.md`.

Starting points (consuming-project picker): Button, Card (Core); PinDots (Forms); ListRow, BottomTabBar (Navigation); the MyMo App screen.


