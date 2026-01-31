import { useEffect, useState, useRef, useCallback } from "react";
import {
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { codeBlockOptions } from "@blocknote/code-block";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { Sun, Moon, Settings } from "lucide-react";
import { useIndexedDB } from "../hooks/useIndexedDB";
import { useTheme } from "./theme";
import { SettingsModal } from "./SettingsModal";
import { AIView } from "./AIView";

type Mode = 'feed' | 'ai';

// Default content with Title and description
const DEFAULT_CONTENT = [
  {
    type: "heading",
    props: { level: 2 },
    content: [{ type: "text", text: "Untitled Note" }]
  },
  {
    type: "paragraph",
    content: [{ type: "text", text: "Start writing your note here..." }]
  },
  {
    type: "paragraph",
    content: []
  }
];

export function App() {
  const { saveNote, loadNote } = useIndexedDB();
  const { theme, setTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('feed');

  // Create editor with code block support
  const editor = useCreateBlockNote({
    initialContent: DEFAULT_CONTENT as any,
    codeBlock: codeBlockOptions,
  });

  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  // Use refs for immediate save on close
  const editorRef = useRef(editor);
  const saveNoteRef = useRef(saveNote);

  // Keep refs updated
  useEffect(() => {
    editorRef.current = editor;
    saveNoteRef.current = saveNote;
  }, [editor, saveNote]);

  // Load content on mount
  useEffect(() => {
    if (!editor || initialized) return;

    (async () => {
      try {
        const content = await loadNote();
        if (content) {
          const parsed = JSON.parse(content);
          if (parsed.length > 0) {
            editor.replaceBlocks(editor.document, parsed);
          }
        }
        setInitialized(true);
        setLoading(false);
      } catch (e) {
        console.error("Failed to load note:", e);
        setInitialized(true);
        setLoading(false);
      }
    })();
  }, [editor, initialized, loadNote]);

  // Save function
  const saveImmediately = useCallback(async () => {
    if (!editorRef.current) return;
    try {
      const content = JSON.stringify(editorRef.current.document, null, 2);
      await saveNoteRef.current(content);
    } catch (e) {
      console.error("Failed to save:", e);
    }
  }, []);

  // Auto-save on content change, blur, visibility change, and unload
  useEffect(() => {
    if (!editor || !initialized) return;

    let saveTimer: number | undefined;

    const handleChange = () => {
      if (saveTimer) window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(() => {
        saveImmediately();
      }, 300);
    };

    editor.onChange(handleChange);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        saveImmediately();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleBeforeUnload = () => {
      saveImmediately();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    const handleBlur = () => {
      saveImmediately();
    };
    window.addEventListener("blur", handleBlur);

    return () => {
      if (saveTimer) window.clearTimeout(saveTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("blur", handleBlur);
      saveImmediately();
    };
  }, [editor, initialized, saveImmediately]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Get note content as plain text for AI context
  const getNoteContent = useCallback(() => {
    if (!editor) return '';

    // Helper to extract text and URLs from content items
    const extractContent = (content: any[]): string => {
      return content.map((c: any) => {
        let text = c.text || '';
        // If it's a link, include the URL
        if (c.type === 'link' && c.href) {
          const linkText = c.content?.map((lc: any) => lc.text || '').join('') || c.href;
          return `[${linkText}](${c.href})`;
        }
        return text;
      }).join('');
    };

    // Convert blocks to markdown-like text
    return editor.document
      .map((block: any) => {
        if (block.content && Array.isArray(block.content)) {
          return extractContent(block.content);
        }
        // Handle nested children (for lists, etc.)
        if (block.children && Array.isArray(block.children)) {
          return block.children.map((child: any) => {
            if (child.content && Array.isArray(child.content)) {
              return '- ' + extractContent(child.content);
            }
            return '';
          }).join('\n');
        }
        return '';
      })
      .filter(Boolean)
      .join('\n');
  }, [editor]);

  if (loading) {
    return (
      <>
        <nav className="navbar">
          <div className="navbar-title">
            <span className="navbar-logo">Lo</span>
            Lo-Note
          </div>
        </nav>
        <div className="loading-container">
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-title">
          <span className="navbar-logo">Lo</span>
          Lo-Note
        </div>
        <div className="navbar-actions">
          {/* Mode Toggle */}
          <div className="mode-toggle">
            <button
              className={`mode-btn ${mode === 'feed' ? 'active' : ''}`}
              onClick={() => setMode('feed')}
            >
              Feed
            </button>
            <button
              className={`mode-btn ${mode === 'ai' ? 'active' : ''}`}
              onClick={() => setMode('ai')}
            >
              AI
            </button>
          </div>

          <button className="navbar-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="navbar-btn" onClick={() => setSettingsOpen(true)} title="Settings">
            <Settings size={18} />
          </button>
        </div>
      </nav>
      <main className="main-content">
        {mode === 'feed' ? (
          <div className="editor-container">
            <BlockNoteView
              editor={editor}
              theme={theme}
            />
          </div>
        ) : (
          <AIView noteContent={getNoteContent()} />
        )}
      </main>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
