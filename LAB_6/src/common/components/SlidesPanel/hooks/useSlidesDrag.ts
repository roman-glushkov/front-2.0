import React, { useState, useEffect } from 'react';
import { Slide } from '../../../../store/types/presentation';

interface UseSlidesLogicArgs {
  slides: Slide[];
  selectedSlideIds: string[];
  setSelectedSlideIds: React.Dispatch<React.SetStateAction<string[]>>;
  onSlidesReorder?: (newOrder: Slide[]) => void;
}

export function useSlidesDrag({
  slides,
  selectedSlideIds,
  setSelectedSlideIds,
  onSlidesReorder,
}: UseSlidesLogicArgs) {
  const [localSlides, setLocalSlides] = useState(slides);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    setLocalSlides(slides);
  }, [slides]);

  const handleDragStart = (index: number) => {
    const slideId = localSlides[index].id;
    if (!selectedSlideIds.includes(slideId)) {
      setSelectedSlideIds([slideId]);
    }

    setDragIndex(index);
  };

  const handleDragEnter = (index: number) => {
    setHoverIndex(index);
  };

  const handleDragEnd = () => {
    console.log('=== DRAG END DEBUG ===');
    console.log('dragIndex:', dragIndex);
    console.log('hoverIndex:', hoverIndex);
    console.log('selectedSlideIds:', selectedSlideIds);
    console.log(
      'localSlides:',
      localSlides.map((s) => s.id)
    );

    if (dragIndex === null || hoverIndex === null || dragIndex === hoverIndex) {
      setDragIndex(null);
      setHoverIndex(null);
      return;
    }

    const updated = [...localSlides];

    const selectedIndexes = updated
      .map((slide, index) => (selectedSlideIds.includes(slide.id) ? index : -1))
      .filter((index) => index !== -1)
      .sort((a, b) => a - b);

    if (selectedIndexes.length > 1) {
      const draggedSlides = selectedIndexes.map((index) => updated[index]);
      const filteredSlides = updated.filter((_, index) => !selectedIndexes.includes(index));

      let insertPosition = hoverIndex;

      const firstSelectedIndex = selectedIndexes[0];

      if (firstSelectedIndex < hoverIndex) {
        insertPosition = hoverIndex - selectedIndexes.length + 1;
      } else {
        insertPosition = hoverIndex;
      }

      filteredSlides.splice(insertPosition, 0, ...draggedSlides);

      setLocalSlides(filteredSlides);
      onSlidesReorder?.(filteredSlides);
    } else {
      const [movedSlide] = updated.splice(dragIndex, 1);
      updated.splice(hoverIndex, 0, movedSlide);
      setLocalSlides(updated);
      onSlidesReorder?.(updated);
    }

    setDragIndex(null);
    setHoverIndex(null);
  };

  return {
    localSlides,
    hoverIndex,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    setLocalSlides,
  };
}
