import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Lo-Note (Side Panel)",
  version: "0.0.1",
  description: "Local-first side panel notes with file system sync.",
  permissions: ["sidePanel", "storage"],
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
  }
});
