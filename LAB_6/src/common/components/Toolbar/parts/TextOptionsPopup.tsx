import React from 'react';
import { TextOption } from '../constants/textOptions';

interface Props {
  options: TextOption[];
  onSelect: (key: string) => void;
  style?: React.CSSProperties;
}

export default function TextOptionsPopup({ options, onSelect, style }: Props) {
  return (
    <div className="text-options-popup" style={style}>
      {options.map((opt) => (
        <button key={opt.key} className="text-option-button" onClick={() => onSelect(opt.key)}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
