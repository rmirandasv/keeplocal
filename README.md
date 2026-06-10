# keeplocal

A suite of private, zero-tracking, client-side web utilities built with **Next.js** and **Tailwind CSS**.

**Repository:** [github.com/rmirandasv/keeplocal](https://github.com/rmirandasv/keeplocal)

---

## 👁️ Philosophy & Design

`keeplocal` was created out of a need for clean, lightweight browser utilities that respect user privacy. All operations are run **100% locally in the browser**.

- **No Backend / Serverless:** Your media, documents, and data never touch a remote server.
- **Zero Tracking:** No tracking scripts, no database logs, no telemetry, and no analytical cookies.
- **Offline-First:** Once loaded, the tools can run entirely offline or in air-gapped environments.
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

## 🌐 Localization (i18n) & SEO

`keeplocal` supports English (default) and Spanish. The routing is designed with dynamic segment routing (e.g. `/en` and `/es`), which compile into static HTML files during build time. This ensures high SEO rankings and compatibility with pure static hosting (e.g., GitHub Pages).

---

## 📂 Project Structure

```
src/
├── app/                  # Next.js App Router (separated by Route Groups)
│   ├── (root)/           # Root layout and redirection page
│   └── [lang]/           # Localized route segments (en, es)
│       ├── page.tsx      # Localized landing page
│       └── record-once/  # "Record Once" capture interface
├── components/           # UI Components
│   └── recorder/         # Record-once controls and viewfinder
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
