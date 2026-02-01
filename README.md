# Lo-Note - AI-Powered Browser Notes

A Chrome extension that provides a powerful note-taking experience right in your browser's side panel. Take notes with rich text editing, code blocks, and AI-powered assistance.

## ✨ Features

- **📝 Rich Text Editor** - BlockNote-based editor with headings, lists, code blocks (40+ languages with syntax highlighting)
- **🤖 AI Assistant** - Chat with AI about your notes using your own OpenAI or Gemini API key
  - Summarize notes
  - Extract information (URLs, dates, etc.)
  - Format data (JSON, lists, tables)
  - Generate content based on notes
- **💾 Local Storage** - All notes stored locally using IndexedDB - your data never leaves your browser
- **🎨 Dark/Light Mode** - Seamless theme switching with system preference detection
- **⌨️ Keyboard Shortcut** - Quick access with `Cmd+.` (Mac) or `Ctrl+.` (Windows/Linux)
- **📱 Side Panel** - Always accessible without disrupting your workflow

## 🚀 Installation

### From Chrome Web Store (Coming Soon)
1. Visit the [Chrome Web Store listing](#)
2. Click "Add to Chrome"

### Manual Installation (Development)
1. Download or clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the extension
4. Open Chrome and go to `chrome://extensions`
5. Enable "Developer mode" (top right)
6. Click "Load unpacked"
7. Select the `dist` folder from this project

## 🎯 Usage

1. **Open the side panel**
   - Click the "Lo" button that appears on any webpage
   - Or press `Cmd+.` (Mac) / `Ctrl+.` (Windows/Linux)
   - <img width="1509" height="860" alt="Screenshot 2026-02-01 at 3 18 43 PM" src="https://github.com/user-attachments/assets/eee5a1ae-df5d-4e78-bb8a-9cdfccb1d63e" />


2. **Start taking notes**
   - Type to add paragraphs
   - Use `/` to insert blocks (headings, code, etc.)
   - Format text with markdown shortcuts
   - <img width="1511" height="857" alt="Screenshot 2026-02-01 at 3 19 14 PM" src="https://github.com/user-attachments/assets/17335261-6c25-4087-a3b2-86b12f2ef557" />


3. **Use AI features** (optional)
   - Click Settings (⚙️) to add your API key
   - Switch to "AI" mode in the navbar
   - Ask questions about your notes
   - Get summaries, extract data, format content
   - <img width="938" height="833" alt="Screenshot 2026-02-01 at 3 20 05 PM" src="https://github.com/user-attachments/assets/789d1ec1-f1e9-4248-8e83-f4f13691038c" />
   - <img width="1512" height="855" alt="Screenshot 2026-02-01 at 3 20 28 PM" src="https://github.com/user-attachments/assets/7dc832d8-754f-4f4c-9c7d-a28e7dcf22dd" />
   - <img width="1512" height="865" alt="Screenshot 2026-02-01 at 3 20 54 PM" src="https://github.com/user-attachments/assets/d706bafd-20c9-4cec-a5f1-496eef0d01dc" />



## 🔐 Privacy & Security

- **100% Local** - All notes are stored in your browser's IndexedDB
- **No Cloud Sync** - Your data never leaves your device
- **API Keys** - Stored locally, never transmitted to any server except OpenAI/Gemini
- **No Tracking** - We don't collect any analytics or usage data

See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for full details.

## 🛠️ Technical Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **BlockNote** - Rich text editor
- **Vite** - Build tool
- **IndexedDB** - Local storage
- **Chrome Extension Manifest V3**

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🤝 Support

- **Issues**: [GitHub Issues](https://github.com/Raunaks068619/browser-notes-ai/issues)
- **Email**: [Your support email]

## 🔗 Links

- [GitHub Repository](https://github.com/Raunaks068619/browser-notes-ai)
- [Privacy Policy](PRIVACY_POLICY.md)

---

Made with ❤️ by [Your Name]
