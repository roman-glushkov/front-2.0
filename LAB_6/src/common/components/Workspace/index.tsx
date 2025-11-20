import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { selectElement } from '../../../store/editorSlice';
import { Slide } from '../../../store/types/presentation';
import './styles.css';

import TextElementView from './parts/TextElement';
import ImageElementView from './parts/ImageElement';

interface Props {
  preview?: boolean;
}

export default function Workspace({ preview }: Props) {
  const dispatch = useDispatch();
  const presentation = useSelector((state: RootState) => state.editor.presentation);
  const selectedSlideId = useSelector((state: RootState) => state.editor.selectedSlideId);

  const slide = presentation.slides.find((s: Slide) => s.id === selectedSlideId);

  const handleWorkspaceClick = () => {
    if (!preview) {
      dispatch(selectElement(''));
    }
  };

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
            onClick={handleWorkspaceClick}
          >
            {slide.elements.map((el) => {
              if (el.type === 'text') {
                return <TextElementView key={el.id} elementId={el.id} preview={!!preview} />;
              }

              if (el.type === 'image') {
                return <ImageElementView key={el.id} elementId={el.id} preview={!!preview} />;
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
