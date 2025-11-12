import React from 'react';
import { Presentation } from '../../../store/types/presentation';
import './styles.css';

interface Props {
  pres: Presentation;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleCommit: (e: React.FocusEvent<HTMLInputElement>) => void;
  onTitleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  selSlideId: string;
}

export default function ProjectTitle({
  pres,
  onTitleChange,
  onTitleCommit,
  onTitleKeyDown,
}: Props) {
  return (
    <div className="presentation-info top">
      <input
        value={pres.title}
        onChange={onTitleChange}
        onBlur={onTitleCommit}
        onKeyDown={onTitleKeyDown}
        placeholder="Введите название презентации"
      />
    </div>
  );
}
