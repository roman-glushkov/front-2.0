// src/common/components/Workspace/index.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { Slide, SlideElement, TextElement, ImageElement } from '../../../store/types/presentation';
import { updateTextContent } from '../../../store/editorSlice';
import './styles.css';

import TextElementView from './parts/TextElement';
import ImageElementView from './parts/ImageElement';
import useDrag from './hooks/useDrag';
import useResize from './hooks/useResize';
import bringToFront from './utils/bringToFront';

interface Props {
  slide?: Slide;
  selElId: string;
  onElementClick: (elementId: string) => void;
  setSelElId: (elementId: string) => void;
  updateSlide: (updater: (s: Slide) => Slide) => void;
  preview?: boolean;
  // Убраны handleTextChange, handleTextCommit, handleTextKeyDown
}

export default function Workspace({ slide, selElId, setSelElId, updateSlide, preview }: Props) {
  const dispatch = useDispatch();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>, elId: string) => {
    console.log('handleTextChange called:', e.target.value, elId);
    dispatch(
      updateTextContent({
        elementId: elId,
        content: e.target.value,
      })
    );
  };

  const handleTextCommit = (e: React.FocusEvent<HTMLInputElement>, elId: string) => {
    console.log('handleTextCommit called:', e.target.value, elId);
  };

  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const startDrag = useDrag({
    preview,
    setSelElId,
    bringToFront: (id: string) => bringToFront(updateSlide, id),
    updateSlide,
  });

  const startResize = useResize({ preview, updateSlide });

  return (
    <div className="workspace-panel">
      <div className="workspace">
        {slide ? (
          <div
            className="workspace-content"
            style={{
              backgroundColor: slide.background.type === 'color' ? slide.background.value : 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
            onClick={() => {
              if (!preview) setSelElId('');
            }}
          >
            {slide.elements.map((el: SlideElement) => {
              const isSelected = selElId === el.id;

              if (el.type === 'text') {
                return (
                  <TextElementView
                    key={el.id}
                    el={el as TextElement}
                    isSelected={isSelected}
                    isEditing={false}
                    preview={!!preview}
                    setSelElId={setSelElId}
                    startDrag={startDrag}
                    startResize={startResize}
                    handleTextChange={handleTextChange}
                    handleTextCommit={handleTextCommit}
                    handleTextKeyDown={handleTextKeyDown}
                  />
                );
              }

              if (el.type === 'image') {
                return (
                  <ImageElementView
                    key={el.id}
                    el={el as ImageElement}
                    isSelected={isSelected}
                    preview={!!preview}
                    setSelElId={setSelElId}
                    startDrag={startDrag}
                    startResize={startResize}
                  />
                );
              }

              return null;
            })}
          </div>
        ) : (
          <p>Выберите слайд</p>
        )}
      </div>
    </div>
  );
}
