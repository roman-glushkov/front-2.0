import { useToolbarState } from './useState';

export function useToolbarLogic(onAction: (action: string) => void) {
  const {
    activeGroup,
    setActiveGroup,
    showTemplates,
    setShowTemplates,
    showTextColorPicker,
    setShowTextColorPicker,
    showFillColorPicker,
    setShowFillColorPicker,
    showBackgroundColorPicker,
    setShowBackgroundColorPicker,
    resetPopups,
  } = useToolbarState();

  const handleAddSlideClick = () => {
    setShowTemplates(!showTemplates);
    setShowTextColorPicker(false);
    setShowFillColorPicker(false);
  };

  const handleTemplateSelect = (template: string) => {
    onAction(template);
    setShowTemplates(false);
  };

  const handleTextColorClick = () => {
    setShowTextColorPicker(!showTextColorPicker);
    setShowTemplates(false);
    setShowFillColorPicker(false);
  };

  const handleFillColorClick = () => {
    setShowFillColorPicker(!showFillColorPicker);
    setShowTextColorPicker(false);
    setShowTemplates(false);
  };
  const handleBackgroundColorClick = () => {
    setShowBackgroundColorPicker(!showBackgroundColorPicker);
    setShowTextColorPicker(false);
    setShowFillColorPicker(false);
    setShowTemplates(false);
  };

  const handleColorSelect = (type: 'text' | 'fill' | 'background', color: string) => {
    if (type === 'text') onAction(`Изменить цвет текста: ${color}`);
    else if (type === 'fill') onAction(`Изменить фон текста: ${color}`);
    else onAction(`Изменить фон слайда: ${color}`);
    setShowTextColorPicker(false);
    setShowFillColorPicker(false);
    setShowBackgroundColorPicker(false);
  };

  const handleTextOptionSelect = (key: string) => {
    if (key.endsWith('px')) {
      onAction(`Изменить размер текста: ${key}`);
    } else if (['left', 'center', 'right', 'justify'].includes(key)) {
      onAction(`Изменить горизонтальное выравнивание текста: ${key}`);
    } else if (['top', 'middle', 'bottom'].includes(key)) {
      onAction(`Изменить вертикальное выравнивание текста: ${key}`);
    } else if (!isNaN(Number(key))) {
      onAction(`Изменить межстрочный интервал: ${key}`);
    }
  };

  return {
    state: {
      activeGroup,
      showTemplates,
      showTextColorPicker,
      showFillColorPicker,
      showBackgroundColorPicker,
    },
    handlers: {
      setActiveGroup,
      resetPopups,
      handleAddSlideClick,
      handleTemplateSelect,
      handleTextColorClick,
      handleFillColorClick,
      handleBackgroundColorClick,
      handleColorSelect,
      handleTextOptionSelect,
    },
  };
}
