# Role: Senior Chrome Extension Developer (Local-First Specialist)

## Project: Lo-Note (Side Panel Edition)
Build a local-first Chrome Extension that acts as a persistent "Side Drawer" OS for note-taking.
**CRITICAL ARCHITECTURE CHANGE:** This project must use the **Chrome Side Panel API** (`side_panel` permission) for the main UI, NOT a Shadow DOM overlay. This is required to maintain a single persistent IndexedDB instance for File System Handles across different tabs.

## 1. Tech Stack
* **Core:** React 18, TypeScript, Vite.
* **Extension Build:** `@crxjs/vite-plugin` (Manifest V3).
* **Editor:** `@blocknote/react` & `@blocknote/core`.
* **Styling:** Tailwind CSS (Standard config, no prefix needed as it runs in Side Panel iframe).
* **Icons:** Lucide-React.
* **State/Storage:** `idb-keyval` (for storing `FileSystemDirectoryHandle`), React Context.

## 2. Core Architecture & Data Flow
### A. The Global UI (Side Panel)
* **Manifest Entry:** `"side_panel": { "default_path": "index.html" }`
* **Behavior:** The main application lives here. It connects to the user's local file system.
* **Persistence:** Because this runs in the extension's origin (`chrome-extension://...`), the `DirectoryHandle` stored in IndexedDB is accessible regardless of the active browser tab.

### B. The Trigger (Content Script)
* **Role:** Minimal "dumb" component injected into webpages.
* **UI:** A small, fixed floating icon (Right-Center).
* **Interaction:** On click, it sends a message (`OPEN_PANEL`) to the Background Service Worker to open the Side Panel.

### C. The Background Worker (`service-worker.ts`)
* Listens for `OPEN_PANEL`.
* Executes `chrome.sidePanel.open({ windowId: sender.tab.windowId })`.

## 3. Data Storage Engine (The "Auto-Discovery" Hook)
Create a custom hook `useLocalFileSystem`:
1.  **Connect:** Uses `window.showDirectoryPicker()`.
2.  **Persist:** Stores the resulting `DirectoryHandle` into IndexedDB using `idb-keyval` (Standard `localStorage` cannot store Handles).
3.  **Restore:** On mount, retrieves the handle from IDB. *Crucial:* If permission is lost (browser restart), show a "Re-verify Permission" button in the UI to call `handle.requestPermission()`.
4.  **IO:**
    * `listNotes()`: Iterates entries to build the dashboard.
    * `saveNote(filename, content)`: Writes JSON/HTML directly to disk.

## 4. UI/UX Specifications (Quip-Inspired Dark Mode)
### View 1: Dashboard
* **Header:** "My Notes", Filter, New Note (+).
* **List:** Virtualized list of files found in the directory.
    * *Visuals:* Dark Grey background (`#121212`), White text.
    * *Meta:* Last modified date (Blue), Sync status dot (Green).

### View 2: Editor (BlockNote)
* **Canvas:** Full height BlockNote instance.
* **Auto-Save:** Debounced write to disk (2s delay).
* **Custom Parsers:**
    * **SQL Detection:** If a block starts with `SELECT`, `UPDATE`, or `FROM`, auto-convert block type to Code.

## 5. Implementation Plan for Agent
1.  **Setup:** Initialize Vite + CRXJS with `manifest.json` configured for `side_panel` and `permissions: ["sidePanel"]`.
2.  **Messaging:** Implement the `Content Script -> Background -> Side Panel` open flow.
3.  **Storage Logic:** Implement `useLocalFileSystem` with `idb-keyval`.
4.  **UI Construction:** Build the Dashboard list and BlockNote integration in the Side Panel entry point.