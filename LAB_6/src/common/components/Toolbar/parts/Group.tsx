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
    if (action === 'ADD_SLIDE') handleAddSlideClick();
    else if (action === 'TEXT_COLOR') handleTextColorClick();
    else if (action === 'SHAPE_FILL') handleFillColorClick();
    else if (action === 'SLIDE_BACKGROUND') handleBackgroundColorClick();
    else if (action === 'TEXT_SIZE' || action === 'TEXT_ALIGN' || action === 'TEXT_LINE_HEIGHT') {
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

          {action === 'ADD_SLIDE' && showTemplates && (
            <TemplatePopup onSelect={handleTemplateSelect} />
          )}

          {action === 'TEXT_COLOR' && showTextColorPicker && (
            <ColorSection type="text" onSelect={handleColorSelect} />
          )}

          {action === 'SHAPE_FILL' && showFillColorPicker && (
            <ColorSection type="fill" onSelect={handleColorSelect} />
          )}

          {action === 'SLIDE_BACKGROUND' && showBackgroundColorPicker && (
            <ColorSection type="background" onSelect={handleColorSelect} />
          )}

          {action === 'TEXT_SIZE' && activeTextOption === action && (
            <TextOptionsPopup
              options={TEXT_SIZE_OPTIONS}
              onSelect={(key) => {
                handleTextOptionSelect(key);
                setActiveTextOption(null);
              }}
            />
          )}

          {action === 'TEXT_ALIGN' && activeTextOption === action && (
            <TextAlignPopup
              onSelect={(key) => {
                handleTextOptionSelect(key);
                setActiveTextOption(null);
              }}
            />
          )}

          {action === 'TEXT_LINE_HEIGHT' && activeTextOption === action && (
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
