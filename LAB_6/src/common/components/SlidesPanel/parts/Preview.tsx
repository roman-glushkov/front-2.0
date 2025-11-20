import React from 'react';
import Workspace from '../../Workspace';
import { Slide } from '../../../../store/types/presentation';
import { useAppDispatch } from '../../../../store/hooks';
import { handleAction } from '../../../../store/editorSlice';

interface Props {
  slide: Slide;
  scale: number;
}

export function SlidePreview({ slide, scale }: Props) {
  const dispatch = useAppDispatch();

  // Оборачиваем handleAction в updater для Workspace
  const updateSlide = (updater: (s: Slide) => Slide) => {
    const updatedSlide = updater(slide);
    dispatch(handleAction(`update slide ${updatedSlide.id}`));
  };

  return (
    <div className="slide-preview-wrapper">
      <div
        className="slide-preview"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: '960px',
          height: '540px',
          pointerEvents: 'none',
        }}
      >
        <Workspace
          slide={slide}
          selElId=""
          setSelElId={() => {}}
          updateSlide={updateSlide}
          onElementClick={() => {}}
          preview
        />
      </div>
    </div>
  );
}
