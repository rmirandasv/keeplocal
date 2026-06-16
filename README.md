# keeplocal

A suite of private, zero-tracking, client-side web utilities built with **Next.js** and **Tailwind CSS**.

**Repository:** [github.com/rmirandasv/keeplocal](https://github.com/rmirandasv/keeplocal)

---

## 👁️ Philosophy & Design

`keeplocal` was created out of a need for clean, lightweight browser utilities that respect user privacy. All operations are run **100% locally in the browser**.

- **No Backend / Serverless:** Your media, documents, and data never touch a remote server.
- **Zero Tracking:** No tracking scripts, no database logs, no telemetry, and no analytical cookies.
- **No Logins:** Instant functionality. No user databases or tracking profiles.
- **Open Source:** Fully transparent code. Inspect the code, verify the local-only execution yourself.

---

## 🎙️ Core Module: Record Once (`/record-once`)

The first utility is a high-performance audio, video, and screen recorder utilizing standard browser APIs:

- **Audio & Video Capturing:** Record from your camera, screen share, or microphone.
- **In-Memory Buffering:** Captured chunks are stored directly in your computer's RAM, ensuring nothing is saved to a server or local hard disk until you choose to download.
- **Tactile Studio Deck UI:** A dark, retro-modern soundboard interface featuring custom hardware controllers.
- **Live VU Equalizer:** A real-time microphone volume level meter built with the Web Audio API.
- **OOM protection:** Safely capped at 5 minutes to prevent browser out-of-memory errors due to in-memory buffering.

---

## 🖼️ Core Module: EXIF Metadata Stripper (`/exif-stripper`)

Remove hidden metadata from images before sharing them online:

- **Metadata Preview:** Reads EXIF data locally with ExifReader — GPS coordinates, camera model, timestamps, and more.
- **Client-Side Stripping:** Re-encodes images via the Canvas API to produce a clean file with no embedded metadata.
- **Privacy by Design:** Your photos never leave your browser. No uploads, no servers, no tracking.

---

## 🗜️ Core Module: Image Optimizer (`/image-optimizer`)

Resize, compress, and convert images to modern formats before publishing:

- **Format Conversion:** Export to JPEG, PNG, WebP, or AVIF (with automatic WebP fallback when AVIF encoding is unavailable).
- **Local Compression:** Uses `browser-image-compression` with Web Workers — processing runs on your CPU/GPU, not a remote server.
- **Before/After Stats:** Compare file size and dimensions instantly after optimization.

---

## 🔐 Core Module: Password Generator (`/password-gen`)

Generate strong passwords and Diceware-style passphrases entirely in the browser:

- **Cryptographic Randomness:** Uses `crypto.getRandomValues()` for every character and word — no server-side seeds.
- **Dual Modes:** Random passwords with configurable charset, or passphrases from embedded EFF / Diceware word lists (EN/ES).
- **Entropy Meter:** Estimated bits of entropy with strength indicator so you know how robust the output is.
- **Zero Persistence:** Generated secrets live only in RAM; nothing is stored in localStorage or sent over the network.

---

## 🌐 Localization (i18n) & SEO

`keeplocal` supports English (default) and Spanish. The routing is designed with dynamic segment routing (e.g. `/en` and `/es`), which compile into static HTML files during build time. This ensures high SEO rankings and compatibility with pure static hosting (e.g., GitHub Pages).

---

## 📂 Project Structure

```
src/
├── app/                  # Next.js App Router
│   └── [lang]/           # Localized route segments (en, es)
│       ├── page.tsx      # Localized landing page
│       ├── record-once/  # "Record Once" capture interface
│       ├── screen-to-gif/ # Screen recording to GIF converter
│       ├── exif-stripper/ # EXIF metadata removal tool
│       ├── image-optimizer/ # Image resize, compress, and convert
│       └── password-gen/ # Password and passphrase generator
├── components/           # UI Components
│   ├── recorder/         # Record-once and screen-to-gif consoles
│   ├── image/            # EXIF stripper and image optimizer consoles
│   └── crypto/           # Password generator console
├── hooks/                # Custom React Hooks (useRecorder media streams)
├── locales/              # Localized translation dictionary JSON files
└── utils/                # i18n helpers and converters
```

---

## 🛠️ Development Setup

Make sure you have [pnpm](https://pnpm.io/) installed.

### Install Dependencies

```bash
pnpm install
```

### Install AI Skills

To install or update the AI agent skills, run:

```bash
npx skills update
```

> [!NOTE]
> `keeplocal` uses pnpm v11+ with strict script authorizations. Build settings are managed in `pnpm-workspace.yaml` under `allowBuilds` for security.

### Start Development Server

```bash
pnpm dev
```

### Build for Production

This project is fully compatible with Next.js static exports (`output: 'export'`).

```bash
pnpm build
```
