import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { updateTextContent, selectElement, updateSlide } from '../../../../store/editorSlice';
import { TextElement as TextElementType } from '../../../../store/types/presentation';
import ResizeHandle from './ResizeHandle';
import useDrag from '../hooks/useDrag';
import useResize from '../hooks/useResize';

interface Props {
  elementId: string;
  preview: boolean;
}

export default function TextElementView({ elementId, preview }: Props) {
  const dispatch = useDispatch();

  // Все данные из store
  const element = useSelector((state: RootState) => {
    const slide = state.editor.presentation.slides.find((s) =>
      s.elements.some((el) => el.id === elementId)
    );
    return slide?.elements.find((el) => el.id === elementId) as TextElementType | undefined;
  });

  const isSelected = useSelector(
    (state: RootState) => state.editor.selectedElementId === elementId
  );

  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(element?.content || '');

  const startDrag = useDrag({
    preview,
    setSelElId: (id: string) => dispatch(selectElement(id)),
    bringToFront: () => {}, // Убрали неиспользуемый параметр id
    updateSlide: (updater) => dispatch(updateSlide(updater)),
  });

  const startResize = useResize({
    preview,
    updateSlide: (updater) => dispatch(updateSlide(updater)),
  });

  // Исправлен useEffect
  useEffect(() => {
    if (element) {
      setLocalContent(element.content);
    }
  }, [element]);

  if (!element || element.type !== 'text') return null;

  const showPlaceholder = !element.content && element.placeholder && !isEditing;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(selectElement(elementId));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    dispatch(
      updateTextContent({
        elementId: elementId,
        content: newContent,
      })
    );
  };

  const handleTextCommit = () => {
    setIsEditing(false);
  };

  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!preview) {
      setLocalContent(element.content);
      setIsEditing(true);
    }
  };

  return (
    <div
      className={`element ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onPointerDown={(e) => startDrag(e, element)}
      style={{
        position: 'absolute',
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        fontFamily: element.font,
        fontSize: `${element.fontSize}px`,
        color: showPlaceholder ? '#999' : element.color || '#1f2937',
        backgroundColor: element.backgroundColor || 'transparent',
        textAlign: element.align || 'left',
        lineHeight: element.lineHeight || 1.2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent:
          element.verticalAlign === 'top'
            ? 'flex-start'
            : element.verticalAlign === 'middle'
              ? 'center'
              : 'flex-end',
        cursor: preview ? 'default' : 'grab',
        userSelect: 'none',
        padding: 4,
        boxSizing: 'border-box',
        whiteSpace: 'pre-wrap',
        fontWeight: element.bold ? 'bold' : 'normal',
        fontStyle: showPlaceholder ? 'italic' : element.italic ? 'italic' : 'normal',
        textDecoration: element.underline ? 'underline' : 'none',
        border: preview ? 'none' : '1px solid #d1d5db',
      }}
    >
      {preview ? (
        element.content
      ) : isEditing ? (
        <input
          autoFocus
          value={localContent}
          placeholder={element.placeholder}
          onChange={handleTextChange}
          onKeyDown={handleTextKeyDown}
          onBlur={handleTextCommit}
          style={{
            width: '100%',
            height: '100%',
            color: element.color || '#1f2937',
            backgroundColor: element.backgroundColor || 'transparent',
            border: 'none',
            outline: 'none',
            textAlign: element.align || 'left',
            fontFamily: element.font,
            fontSize: `${element.fontSize}px`,
            lineHeight: element.lineHeight || 1.2,
            fontWeight: element.bold ? 'bold' : 'normal',
            fontStyle: element.italic ? 'italic' : 'normal',
            textDecoration: element.underline ? 'underline' : 'none',
          }}
        />
      ) : showPlaceholder ? (
        element.placeholder
      ) : (
        element.content
      )}

      {isSelected && !preview && (
        <>
          {(['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'] as const).map((c) => (
            <ResizeHandle key={c} corner={c} onPointerDown={(e) => startResize(e, element, c)} />
          ))}
        </>
      )}
    </div>
  );
}
