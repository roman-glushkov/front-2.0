import React from 'react';
import { Slide, SlideElement, TextElement, ImageElement } from '../../../store/types/presentation';
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
  handleTextChange: (e: React.ChangeEvent<HTMLInputElement>, elId: string) => void;
  handleTextCommit: (e: React.FocusEvent<HTMLInputElement>, elId: string) => void;
  handleTextKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, elId: string) => void;
  preview?: boolean;
}

export default function Workspace({
  slide,
  selElId,
  setSelElId,
  updateSlide,
  handleTextChange,
  handleTextCommit,
  handleTextKeyDown,
  preview,
}: Props) {
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
