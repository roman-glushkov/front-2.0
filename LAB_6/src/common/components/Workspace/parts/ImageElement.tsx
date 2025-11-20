import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { selectElement, updateSlide } from '../../../../store/editorSlice';
import { ImageElement as ImageElementType } from '../../../../store/types/presentation';
import ResizeHandle from './ResizeHandle';
import useDrag from '../hooks/useDrag';
import useResize from '../hooks/useResize';

interface Props {
  elementId: string;
  preview: boolean;
}

export default function ImageElementView({ elementId, preview }: Props) {
  const dispatch = useDispatch();

  // Все данные из store
  const element = useSelector((state: RootState) => {
    const slide = state.editor.presentation.slides.find((s) =>
      s.elements.some((el) => el.id === elementId)
    );
    return slide?.elements.find((el) => el.id === elementId) as ImageElementType | undefined;
  });

  const isSelected = useSelector(
    (state: RootState) => state.editor.selectedElementId === elementId
  );

  const startDrag = useDrag({
    preview,
    setSelElId: (id: string) => dispatch(selectElement(id)),
    bringToFront: () => {}, // Убрали неиспользуемый параметр id
    updateSlide: (updater) => dispatch(updateSlide(updater)),
  });

  const startResize = useResize({
    preview,
    updateSlide: (updater) => dispatch(updateSlide(updater)),
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(selectElement(elementId));
  };

  if (!element || element.type !== 'image') return null;

  return (
    <div
      className={`element ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onPointerDown={(e) => startDrag(e, element)}
      style={{
        position: 'absolute',
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        cursor: preview ? 'default' : 'grab',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
      }}
    >
      <img
        src={element.src}
        alt="Изображение"
        draggable={false}
        style={{
          width: element.size.width === 0 ? 'auto' : '100%',
          height: element.size.height === 0 ? 'auto' : '100%',
          objectFit: 'fill',
          userSelect: 'none',
        }}
      />
      {isSelected && !preview && (
        <>
          {(['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'] as const).map((c) => (
            <ResizeHandle key={c} corner={c} onPointerDown={(e) => startResize(e, element, c)} />
          ))}
        </>
      )}
    </div>
  );
}
