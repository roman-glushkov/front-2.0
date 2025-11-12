import React from 'react';
import { ImageElement as IEl, SlideElement } from '../../../../store/types/presentation';
import ResizeHandle from './ResizeHandle';

interface Props {
  el: IEl;
  isSelected: boolean;
  preview: boolean;
  setSelElId: (id: string) => void;
  startDrag: (e: React.PointerEvent, el: SlideElement) => void;
  startResize: (
    e: React.PointerEvent,
    el: SlideElement,
    corner: 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w'
  ) => void;
}

export default function ImageElementView({
  el,
  isSelected,
  preview,
  setSelElId,
  startDrag,
  startResize,
}: Props) {
  return (
    <div
      className={`element ${isSelected ? 'selected' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        setSelElId(el.id);
      }}
      onPointerDown={(e) => startDrag(e, el)}
      style={{
        position: 'absolute',
        left: el.position.x,
        top: el.position.y,
        width: el.size.width,
        height: el.size.height,
        cursor: preview ? 'default' : 'grab',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
      }}
    >
      <img
        src={el.src}
        alt="Изображение"
        draggable={false}
        style={{
          width: el.size.width === 0 ? 'auto' : '100%',
          height: el.size.height === 0 ? 'auto' : '100%',
          objectFit: 'fill',
          userSelect: 'none',
        }}
      />
      {isSelected && !preview && (
        <>
          {(['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'] as const).map((c) => (
            <ResizeHandle key={c} corner={c} onPointerDown={(e) => startResize(e, el, c)} />
          ))}
        </>
      )}
    </div>
  );
}
