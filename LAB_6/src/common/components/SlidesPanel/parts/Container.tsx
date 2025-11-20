import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { SlideRow } from './Row';
import { selectSlide, selectSlides } from '../../../../store/editorSlice';
import { useSlidesDrag } from '../hooks/useSlidesDrag';

export default function SlidesContainer() {
  const dispatch = useAppDispatch();
  const slides = useAppSelector((state) => state.editor.presentation.slides);
  const selectedSlideIds = useAppSelector((state) => state.editor.selectedSlideIds);

  const setSelectedSlideIds: React.Dispatch<React.SetStateAction<string[]>> = (ids) => {
    if (typeof ids === 'function') {
      dispatch(selectSlides(ids(selectedSlideIds)));
    } else {
      dispatch(selectSlides(ids));
    }
  };

  const { localSlides, hoverIndex, handleDragStart, handleDragEnter, handleDragEnd } =
    useSlidesDrag({
      slides,
      selectedSlideIds,
      setSelectedSlideIds,
    });

  const handleSlideClick = (slideId: string, multi?: boolean) => {
    if (multi) {
      if (selectedSlideIds.includes(slideId)) {
        if (selectedSlideIds.length > 1) {
          setSelectedSlideIds(selectedSlideIds.filter((id) => id !== slideId));
        }
      } else {
        setSelectedSlideIds([...selectedSlideIds, slideId]);
      }
    } else {
      dispatch(selectSlide(slideId));
    }
  };

  return (
    <div className="slides-container">
      {localSlides.map((slide, index) => (
        <SlideRow
          key={slide.id}
          slide={slide}
          index={index}
          scale={0.25}
          selected={selectedSlideIds.includes(slide.id)}
          hovered={index === hoverIndex}
          onClick={(e) => handleSlideClick(slide.id, e.ctrlKey || e.metaKey)}
          onDragStart={() => handleDragStart(index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDragEnd}
        />
      ))}
    </div>
  );
}
