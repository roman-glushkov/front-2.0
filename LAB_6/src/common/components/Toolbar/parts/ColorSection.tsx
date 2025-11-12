import React from 'react';
import { THEME_COLUMNS, STANDARD_COLORS } from '../constants/colors';
import ThemeColorButton from './ThemeButton';

interface Props {
  type: 'text' | 'fill' | 'background';
  onSelect: (type: 'text' | 'fill' | 'background', color: string) => void;
}

export default function ColorSection({ type, onSelect }: Props) {
  return (
    <div className="color-picker-popup">
      <div className="color-section">
        <div className="color-section-title">Цвета темы</div>
        <div className="theme-colors">
          {THEME_COLUMNS.map((column, ci) => (
            <div key={ci} className="theme-column">
              {column.map((color) => (
                <ThemeColorButton key={color} color={color} onClick={() => onSelect(type, color)} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="color-section">
        <div className="color-section-title">Стандартные цвета</div>
        <div className="standard-colors">
          {STANDARD_COLORS.map((color) => (
            <ThemeColorButton key={color} color={color} onClick={() => onSelect(type, color)} />
          ))}
        </div>
      </div>
    </div>
  );
}
