import React from 'react';
import './styles.css';
import { useToolbarLogic } from './hooks/useLogic';
import ToolbarTabs from './parts/Tabs';
import ToolbarGroup from './parts/Group';

interface Props {
  onAction: (action: string) => void;
}

export default function Toolbar({ onAction }: Props) {
  const { state, handlers } = useToolbarLogic(onAction);

  return (
    <div className="toolbar-container">
      <ToolbarTabs
        activeGroup={state.activeGroup}
        setActiveGroup={handlers.setActiveGroup}
        resetPopups={handlers.resetPopups}
      />

      <ToolbarGroup
        activeGroup={state.activeGroup}
        showTemplates={state.showTemplates}
        showTextColorPicker={state.showTextColorPicker}
        showFillColorPicker={state.showFillColorPicker}
        showBackgroundColorPicker={state.showBackgroundColorPicker}
        handleAddSlideClick={handlers.handleAddSlideClick}
        handleTextColorClick={handlers.handleTextColorClick}
        handleFillColorClick={handlers.handleFillColorClick}
        handleBackgroundColorClick={handlers.handleBackgroundColorClick}
        handleTemplateSelect={handlers.handleTemplateSelect}
        handleColorSelect={handlers.handleColorSelect}
        onAction={onAction}
        handleTextOptionSelect={handlers.handleTextOptionSelect}
      />
    </div>
  );
}
