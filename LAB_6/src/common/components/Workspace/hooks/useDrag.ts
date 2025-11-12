import React from 'react';
import { useRef } from 'react';
import type { Slide, SlideElement } from '../../../../store/types/presentation';

type UpdateSlideFn = (updater: (s: Slide) => Slide) => void;

interface Args {
  preview?: boolean;
  setSelElId: (id: string) => void;
  bringToFront: (id: string) => void;
  updateSlide: UpdateSlideFn;
}

export default function useDrag({ preview, setSelElId, bringToFront, updateSlide }: Args) {
  const dragStateRef = useRef<{
    draggingId: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    raf?: number;
  } | null>(null);

  const startDrag = (e: React.PointerEvent, el: SlideElement) => {
    if (preview) return;
    e.stopPropagation();

    setSelElId(el.id);
    bringToFront(el.id);

    const ds = {
      draggingId: el.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: el.position.x,
      origY: el.position.y,
    };
    dragStateRef.current = ds;

    const onPointerMove = (ev: PointerEvent) => {
      const cur = dragStateRef.current;
      if (!cur) return;

      const dx = ev.clientX - cur.startX;
      const dy = ev.clientY - cur.startY;

      if (cur.raf) cancelAnimationFrame(cur.raf);
      cur.raf = requestAnimationFrame(() => {
        updateSlide((s: Slide) => ({
          ...s,
          elements: s.elements.map((item) =>
            item.id === cur.draggingId
              ? { ...item, position: { x: cur.origX + dx, y: cur.origY + dy } }
              : item
          ),
        }));
      });
    };

    const onPointerUp = () => {
      if (dragStateRef.current?.raf) cancelAnimationFrame(dragStateRef.current.raf);
      dragStateRef.current = null;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return startDrag;
}
