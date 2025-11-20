import React from 'react';
import {
  Slide,
  SlideElement,
  TextElement,
  ImageElement,
} from '../../../../store/types/presentation';

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
        <div className="workspace-panel">
          <div className="workspace">
            <div
              className="workspace-content"
              style={{
                backgroundColor:
                  slide.background.type === 'color' ? slide.background.value : 'white',
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                height: '100%',
              }}
            >
              {slide.elements.map((el: SlideElement) => {
                if (el.type === 'text') {
                  const textEl = el as TextElement;
                  return (
                    <div
                      key={el.id}
                      style={{
                        position: 'absolute',
                        left: textEl.position.x,
                        top: textEl.position.y,
                        width: textEl.size.width,
                        height: textEl.size.height,
                        fontFamily: textEl.font,
                        fontSize: `${textEl.fontSize}px`,
                        color: textEl.color || '#1f2937',
                        backgroundColor: textEl.backgroundColor || 'transparent',
                        textAlign: textEl.align || 'left',
                        lineHeight: textEl.lineHeight || 1.2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent:
                          textEl.verticalAlign === 'top'
                            ? 'flex-start'
                            : textEl.verticalAlign === 'middle'
                              ? 'center'
                              : 'flex-end',
                        padding: 4,
                        boxSizing: 'border-box',
                        whiteSpace: 'pre-wrap',
                        fontWeight: textEl.bold ? 'bold' : 'normal',
                        fontStyle: textEl.italic ? 'italic' : 'normal',
                        textDecoration: textEl.underline ? 'underline' : 'none',
                      }}
                    >
                      {textEl.content ||
                        (textEl.placeholder && !textEl.content ? textEl.placeholder : '')}
                    </div>
                  );
                }

                if (el.type === 'image') {
                  const imageEl = el as ImageElement;
                  return (
                    <div
                      key={el.id}
                      style={{
                        position: 'absolute',
                        left: imageEl.position.x,
                        top: imageEl.position.y,
                        width: imageEl.size.width,
                        height: imageEl.size.height,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={imageEl.src}
                        alt="Изображение"
                        draggable={false}
                        style={{
                          width: imageEl.size.width === 0 ? 'auto' : '100%',
                          height: imageEl.size.height === 0 ? 'auto' : '100%',
                          objectFit: 'fill',
                        }}
                      />
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
