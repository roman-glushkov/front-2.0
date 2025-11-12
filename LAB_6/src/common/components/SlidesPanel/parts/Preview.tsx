import React from 'react';
import Workspace from '../../Workspace';
import { Slide } from '../../../../store/types/presentation';

interface Props {
  slide: Slide;
  scale: number;
}

export function SlidePreview({ slide, scale }: Props) {
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
          updateSlide={() => {}}
          handleTextChange={() => {}}
          handleTextCommit={() => {}}
          handleTextKeyDown={() => {}}
          onElementClick={() => {}}
          preview
        />
      </div>
    </div>
  );
}
