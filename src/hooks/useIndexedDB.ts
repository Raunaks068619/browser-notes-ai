import { get, set } from 'idb-keyval';

const NOTES_KEY = 'lo-note-content';

export function useIndexedDB() {
    const saveNote = async (content: string): Promise<void> => {
        try {
            await set(NOTES_KEY, content);
        } catch (e) {
            console.error('Failed to save to IndexedDB:', e);
            throw e;
        }
    };

    const loadNote = async (): Promise<string | null> => {
        try {
            const content = await get<string>(NOTES_KEY);
            return content ?? null;
        } catch (e) {
            console.error('Failed to load from IndexedDB:', e);
            return null;
        }
    };

    return { saveNote, loadNote };
}
