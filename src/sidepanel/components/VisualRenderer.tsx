import React from 'react';

// Types for visual components that AI can generate
export interface VisualCard {
    type: 'card';
    title: string;
    content: string;
    icon?: string;
}

export interface VisualMetric {
    type: 'metric';
    label: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
}

export interface VisualList {
    type: 'list';
    title?: string;
    items: string[];
}

export interface VisualHighlight {
    type: 'highlight';
    text: string;
    variant?: 'info' | 'success' | 'warning' | 'error';
}

export interface VisualSection {
    type: 'section';
    title: string;
    children: VisualElement[];
}

export type VisualElement = VisualCard | VisualMetric | VisualList | VisualHighlight | VisualSection;

export interface VisualData {
    summary?: string;
    elements: VisualElement[];
}

// Render a single visual element
function RenderElement({ element }: { element: VisualElement }) {
    switch (element.type) {
        case 'card':
            return (
                <div className="visual-card">
                    {element.icon && <span className="visual-icon">{element.icon}</span>}
                    <h4>{element.title}</h4>
                    <p>{element.content}</p>
                </div>
            );

        case 'metric':
            return (
                <div className="visual-metric">
                    <span className="metric-label">{element.label}</span>
                    <span className="metric-value">{element.value}</span>
                    {element.change && (
                        <span className={`metric-change ${element.trend || 'neutral'}`}>
                            {element.trend === 'up' ? '↑' : element.trend === 'down' ? '↓' : ''}
                            {element.change}
                        </span>
                    )}
                </div>
            );

        case 'list':
            return (
                <div className="visual-list">
                    {element.title && <h4>{element.title}</h4>}
                    <ul>
                        {element.items.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            );

        case 'highlight':
            return (
                <div className={`visual-highlight ${element.variant || 'info'}`}>
                    {element.text}
                </div>
            );

        case 'section':
            return (
                <div className="visual-section">
                    <h3>{element.title}</h3>
                    <div className="section-content">
                        {element.children.map((child, i) => (
                            <RenderElement key={i} element={child} />
                        ))}
                    </div>
                </div>
            );

        default:
            return null;
    }
}

// Main Visual Renderer component
export function VisualRenderer({ data }: { data: VisualData | null }) {
    if (!data) {
        return (
            <div className="visual-empty">
                <p>Ask AI to summarize your notes or generate insights.</p>
            </div>
        );
    }

    return (
        <div className="visual-container">
            {data.summary && (
                <div className="visual-summary">
                    <p>{data.summary}</p>
                </div>
            )}
            <div className="visual-elements">
                {data.elements.map((element, i) => (
                    <RenderElement key={i} element={element} />
                ))}
            </div>
        </div>
    );
}

// Helper to parse AI response into visual data
export function parseAIResponse(response: string): VisualData {
    try {
        // Try to parse as JSON first
        const parsed = JSON.parse(response);
        if (parsed.elements) {
            return parsed as VisualData;
        }
    } catch {
        // If not JSON, treat as plain text summary
    }

    return {
        summary: response,
        elements: []
    };
}
