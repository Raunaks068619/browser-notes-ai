import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Lo-Note",
  version: "1.0.0",
  description: "AI-powered note-taking in your browser's side panel. Rich text editing with code blocks, local storage, and optional AI assistance.",
  icons: {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  permissions: ["sidePanel", "storage"],
  host_permissions: [],
  background: {
    service_worker: "src/service-worker.ts",
    type: "module"
  },
  side_panel: {
    default_path: "index.html"
  },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content-script.ts"]
    }
  ],
  commands: {
    "toggle-sidepanel": {
      suggested_key: {
        default: "Ctrl+Period",
        mac: "Command+Period"
      },
      description: "Toggle Lo-Note side panel"
    }
  },
  homepage_url: "https://github.com/Raunaks068619/browser-notes-ai"
});
