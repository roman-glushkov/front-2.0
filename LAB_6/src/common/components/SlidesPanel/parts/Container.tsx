import React from 'react';
import { Slide } from '../../../../store/types/presentation';
import { SlideRow } from './Row';

interface Props {
  slides: Slide[];
  hoverIndex: number | null;
  selectedSlideId: string;
  selectedSlideIds: string[];
  setSelectedSlideId: React.Dispatch<React.SetStateAction<string>>;
  setSelectedSlideIds: React.Dispatch<React.SetStateAction<string[]>>;
  scale: number;
  onSlideClick?: (slideId: string, index: number, multi?: boolean) => void;
  handleDragStart: (index: number) => void;
  handleDragEnter: (index: number) => void;
  handleDragEnd: () => void;
}

export default function SlidesContainer({
  slides,
  hoverIndex,
  selectedSlideIds,
  scale,
  onSlideClick,
  handleDragStart,
  handleDragEnter,
  handleDragEnd,
}: Props) {
  const handleClick = (e: React.MouseEvent, slideId: string, index: number) => {
    const multi = e.ctrlKey || e.metaKey;
    onSlideClick?.(slideId, index, multi);
  };

  return (
    <div className="slides-container">
      {slides.map((slide, i) => (
        <SlideRow
          key={slide.id}
          slide={slide}
          index={i}
          scale={scale}
          selected={selectedSlideIds.includes(slide.id)}
          hovered={i === hoverIndex}
          onClick={(e) => handleClick(e, slide.id, i)}
          onDragStart={() => handleDragStart(i)}
          onDragEnter={() => handleDragEnter(i)}
          onDragEnd={handleDragEnd}
        />
      ))}
    </div>
  );
}
