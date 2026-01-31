import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getAISettings, saveAISettings, AIProvider } from '../hooks/useAISettings';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const [apiKey, setApiKey] = useState('');
    const [provider, setProvider] = useState<AIProvider>('openai');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (isOpen) {
            getAISettings().then((settings) => {
                setApiKey(settings.apiKey || '');
                setProvider(settings.provider);
            });
        }
    }, [isOpen]);

    const handleSave = async () => {
        setSaving(true);
        await saveAISettings({ apiKey: apiKey || null, provider });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="settings-overlay" onClick={onClose}>
            <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
                <div className="settings-header">
                    <h2>Settings</h2>
                    <button className="settings-close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className="settings-content">
                    <div className="settings-section">
                        <h3>AI Configuration</h3>
                        <p className="settings-description">
                            Add your API key to enable AI features like text generation and suggestions.
                        </p>

                        <div className="settings-field">
                            <label>AI Provider</label>
                            <select
                                value={provider}
                                onChange={(e) => setProvider(e.target.value as AIProvider)}
                                className="settings-select"
                            >
                                <option value="openai">OpenAI (GPT-4o-mini)</option>
                                <option value="gemini">Google Gemini</option>
                            </select>
                        </div>

                        <div className="settings-field">
                            <label>
                                {provider === 'openai' ? 'OpenAI API Key' : 'Gemini API Key'}
                            </label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder={provider === 'openai' ? 'sk-...' : 'AI...'}
                                className="settings-input"
                            />
                            <span className="settings-hint">
                                {provider === 'openai'
                                    ? 'Get your key at platform.openai.com'
                                    : 'Get your key at makersuite.google.com'}
                            </span>
                        </div>

                        <button
                            className="settings-save-btn"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Settings'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
