import React from 'react';
import { Slide } from '../../../store/types/presentation';
import SlidesContainer from './parts/Container';
import { useSlidesDrag } from './hooks/useSlidesDrag';
import './styles.css';

interface Props {
  slides: Slide[];
  selectedSlideId: string;
  selectedSlideIds: string[];
  setSelectedSlideId: React.Dispatch<React.SetStateAction<string>>;
  setSelectedSlideIds: React.Dispatch<React.SetStateAction<string[]>>;
  onSlideClick: (slideId: string, index: number, multi?: boolean) => void;
  onSlidesReorder?: (newOrder: Slide[]) => void;
}

export default function SlidesPanel({
  slides,
  selectedSlideId,
  selectedSlideIds,
  setSelectedSlideId,
  setSelectedSlideIds,
  onSlideClick,
  onSlidesReorder,
}: Props) {
  const { localSlides, hoverIndex, handleDragStart, handleDragEnter, handleDragEnd } =
    useSlidesDrag({ slides, selectedSlideIds, setSelectedSlideIds, onSlidesReorder });

  return (
    <div className="slides-panel">
      <h3>Слайды</h3>
      <SlidesContainer
        slides={localSlides}
        hoverIndex={hoverIndex}
        selectedSlideId={selectedSlideId}
        selectedSlideIds={selectedSlideIds}
        setSelectedSlideId={setSelectedSlideId}
        setSelectedSlideIds={setSelectedSlideIds}
        scale={0.25}
        onSlideClick={onSlideClick}
        handleDragStart={handleDragStart}
        handleDragEnter={handleDragEnter}
        handleDragEnd={handleDragEnd}
      />
    </div>
  );
}
