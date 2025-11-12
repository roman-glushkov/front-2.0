import React, { useState } from 'react';
import { GroupKey } from '../hooks/useState';
import { GROUPS } from '../constants/config';
import TemplatePopup from './TemplatePopup';
import ColorSection from './ColorSection';
import TextOptionsPopup from './TextOptionsPopup';
import TextAlignPopup from './TextAlignPopup';
import { TEXT_SIZE_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants/textOptions';

interface Props {
  activeGroup: GroupKey;
  showTemplates: boolean;
  showTextColorPicker: boolean;
  showFillColorPicker: boolean;
  showBackgroundColorPicker: boolean;
  handleAddSlideClick: () => void;
  handleTextColorClick: () => void;
  handleFillColorClick: () => void;
  handleBackgroundColorClick: () => void;
  handleTemplateSelect: (template: string) => void;
  handleColorSelect: (type: 'text' | 'fill' | 'background', color: string) => void;
  handleTextOptionSelect: (key: string) => void;
  onAction: (action: string) => void;
}

export default function ToolbarGroup({
  activeGroup,
  showTemplates,
  showTextColorPicker,
  showFillColorPicker,
  showBackgroundColorPicker,
  handleAddSlideClick,
  handleTextColorClick,
  handleFillColorClick,
  handleBackgroundColorClick,
  handleTemplateSelect,
  handleColorSelect,
  handleTextOptionSelect,
  onAction,
}: Props) {
  const [activeTextOption, setActiveTextOption] = useState<string | null>(null);

  const handleButtonClick = (action: string) => {
    if (action === 'Добавить слайд') handleAddSlideClick();
    else if (action === 'Изменить цвет текста') handleTextColorClick();
    else if (action === 'Изменить фон текста') handleFillColorClick();
    else if (action === 'Изменить фон слайда') handleBackgroundColorClick();
    else if (
      action === 'Изменить размер текста' ||
      action === 'text-align' ||
      action === 'Изменить межстрочный интервал'
    ) {
      setActiveTextOption(activeTextOption === action ? null : action);
    } else {
      onAction(action);
    }
  };

  return (
    <div className="toolbar-group">
      {GROUPS[activeGroup].map(({ label, action }) => (
        <div key={action} className="toolbar-button-wrapper">
          <button onClick={() => handleButtonClick(action)}>{label}</button>

          {action === 'Добавить слайд' && showTemplates && (
            <TemplatePopup onSelect={handleTemplateSelect} />
          )}

          {action === 'Изменить цвет текста' && showTextColorPicker && (
            <ColorSection type="text" onSelect={handleColorSelect} />
          )}

          {action === 'Изменить фон текста' && showFillColorPicker && (
            <ColorSection type="fill" onSelect={handleColorSelect} />
          )}

          {action === 'Изменить фон слайда' && showBackgroundColorPicker && (
            <ColorSection type="background" onSelect={handleColorSelect} />
          )}

          {action === 'Изменить размер текста' && activeTextOption === action && (
            <TextOptionsPopup
              options={TEXT_SIZE_OPTIONS}
              onSelect={(key) => {
                handleTextOptionSelect(key);
                setActiveTextOption(null);
              }}
            />
          )}

          {action === 'text-align' && activeTextOption === action && (
            <TextAlignPopup
              onSelect={(key) => {
                handleTextOptionSelect(key);
                setActiveTextOption(null);
              }}
            />
          )}

          {action === 'Изменить межстрочный интервал' && activeTextOption === action && (
            <TextOptionsPopup
              options={LINE_HEIGHT_OPTIONS}
              onSelect={(key) => {
                handleTextOptionSelect(key);
                setActiveTextOption(null);
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
