import React from 'react';
import { TEMPLATES } from '../constants/templates';

interface Props {
  onSelect: (templateKey: string) => void;
}

export default function TemplatePopup({ onSelect }: Props) {
  return (
    <div className="template-popup">
      {TEMPLATES.map((template) => (
        <div key={template.key} className="template-item" onClick={() => onSelect(template.key)}>
          <div className="template-preview">
            <img
              src={template.preview}
              alt={template.label}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) {
                  fallback.style.display = 'flex';
                }
              }}
            />
            <div className="template-fallback">
              <span>{template.label}</span>
            </div>
          </div>
          <div className="template-label">{template.label}</div>
        </div>
      ))}
    </div>
  );
}
