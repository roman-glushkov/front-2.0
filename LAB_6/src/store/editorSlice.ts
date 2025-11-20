import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Presentation, Slide, Background } from './types/presentation';
import * as func from './functions/presentation';
import * as temp from './templates/presentation';
import * as sld from './templates/slide';

const initialPresentation: Presentation = {
  title: 'Новая презентация',
  slides: [sld.slideTitle],
  currentSlideId: 'slide1',
  selectedSlideIds: ['slide1'],
};

export interface EditorState {
  presentation: Presentation;
  selectedSlideId: string;
  selectedSlideIds: string[];
  selectedElementId: string;
  slides: Slide[];
}

const initialState: EditorState = {
  presentation: initialPresentation,
  selectedSlideId: 'slide1',
  selectedSlideIds: ['slide1'],
  selectedElementId: '',
  slides: initialPresentation.slides,
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    selectSlide(state, action: PayloadAction<string>) {
      console.log('ID слайда:', action.payload);
      state.selectedSlideId = action.payload;
      state.selectedSlideIds = [action.payload];
      state.selectedElementId = '';
    },

    selectSlides(state, action: PayloadAction<string[]>) {
      if (action.payload.length > 0) {
        state.selectedSlideIds = action.payload;
        state.selectedSlideId = action.payload[0];
        state.selectedElementId = '';
      }
    },

    selectElement(state, action: PayloadAction<string>) {
      console.log('ID элемента:', action.payload);
      state.selectedElementId = action.payload;
    },

    updateSlide(state, action: PayloadAction<(s: Slide) => Slide>) {
      const slideId = state.selectedSlideId;
      const slide = state.presentation.slides.find((s) => s.id === slideId);
      if (!slide) return;
      console.log('Слайд обновлён:', slideId);
      state.presentation.slides = state.presentation.slides.map((s) =>
        s.id === slideId ? action.payload(s) : s
      );
    },

    updateTextContent(state, action: PayloadAction<{ elementId: string; content: string }>) {
      const { elementId, content } = action.payload;
      const slideId = state.selectedSlideId;
      const slide = state.presentation.slides.find((s) => s.id === slideId);
      if (!slide) return;
      console.log('Обновлён текст элемента:', elementId, content);
      state.presentation.slides = state.presentation.slides.map((s) =>
        s.id === slideId ? func.changeText(s, elementId, content) : s
      );
    },

    addSlide(state, action: PayloadAction<Slide>) {
      console.log('Добавлен слайд:', action.payload.id);
      state.presentation = func.addSlide(state.presentation, action.payload);
      state.selectedSlideId = action.payload.id;
      state.selectedSlideIds = [action.payload.id];
    },

    removeSlide(state, action: PayloadAction<string>) {
      console.log('Удалён слайд:', action.payload);
      state.presentation = func.removeSlide(state.presentation, action.payload);
      state.selectedSlideId = state.presentation.slides[0]?.id || '';
      state.selectedSlideIds = state.presentation.slides[0]
        ? [state.presentation.slides[0].id]
        : [];
      state.selectedElementId = '';
    },

    reorderSlides(state, action: PayloadAction<Slide[]>) {
      console.log('Перенумерованы слайды');
      state.presentation.slides = action.payload;
    },

    changeTitle(state, action: PayloadAction<string>) {
      console.log('Новое название презентации:', action.payload);
      state.presentation.title = action.payload;
    },

    changeBackground(state, action: PayloadAction<Background>) {
      const slide = state.presentation.slides.find((s) => s.id === state.selectedSlideId);
      if (!slide) return;
      console.log('Изменён фон слайда:', slide.id);
      state.presentation.slides = state.presentation.slides.map((s) =>
        s.id === slide.id ? func.changeBackground(s, action.payload) : s
      );
    },

    handleAction(state, action: PayloadAction<string>) {
      const act = action.payload;
      const slideId = state.selectedSlideId;
      const slide = state.presentation.slides.find((s) => s.id === slideId);
      const elId = state.selectedElementId;
      console.log('Совершенное действие:', act);

      const slideMap: Record<string, Slide> = {
        ADD_TITLE_SLIDE: sld.slideTitle,
        ADD_TITLE_AND_OBJECT_SLIDE: sld.slideTitleAndObject,
        ADD_SECTION_HEADER_SLIDE: sld.slideSectionHeader,
        ADD_TWO_OBJECTS_SLIDE: sld.slideTwoObjects,
        ADD_COMPARISON_SLIDE: sld.slideComparison,
        ADD_JUST_HEADLINE_SLIDE: sld.slideJustHeadline,
        ADD_EMPTY_SLIDE: sld.slideEmpty,
        ADD_OBJECT_WITH_SIGNATURE_SLIDE: sld.slideObjectWithSignature,
        ADD_DRAWING_WITH_CAPTION_SLIDE: sld.slideDrawingWithCaption,
      };

      if (slideMap[act]) {
        const newSlide = { ...slideMap[act], id: `slide${Date.now()}` };
        state.presentation = func.addSlide(state.presentation, newSlide);
        state.selectedSlideId = newSlide.id;
        state.selectedSlideIds = [newSlide.id];
        return;
      }

      if (act.startsWith('TEXT_SIZE:')) {
        const size = parseInt(act.split(':')[1].trim(), 10);
        if (slide && elId)
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.changeTextSize(s, elId, size) : s
          );
        return;
      }

      if (act.startsWith('TEXT_ALIGN_HORIZONTAL:')) {
        const align = act.split(':')[1].trim() as 'left' | 'center' | 'right' | 'justify';
        if (slide && elId)
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.changeTextAlignment(s, elId, align) : s
          );
        return;
      }

      if (act.startsWith('TEXT_ALIGN_VERTICAL:')) {
        const vAlign = act.split(':')[1].trim() as 'top' | 'middle' | 'bottom';
        if (slide && elId)
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.changeTextVerticalAlignment(s, elId, vAlign) : s
          );
        return;
      }

      if (act.startsWith('TEXT_LINE_HEIGHT:')) {
        const lineHeight = parseFloat(act.split(':')[1].trim());
        if (slide && elId)
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.changeTextLineHeight(s, elId, lineHeight) : s
          );
        return;
      }

      if (act.startsWith('TEXT_COLOR:')) {
        const color = act.split(':')[1].trim();
        if (slide && elId)
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.changeTextColor(s, elId, color) : s
          );
        return;
      }

      if (act.startsWith('SHAPE_FILL:')) {
        const color = act.split(':')[1].trim();
        if (slide && elId)
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.changeTextBackgroundColor(s, elId, color) : s
          );
        return;
      }

      if (act.startsWith('SLIDE_BACKGROUND:')) {
        const color = act.split(': ')[1];
        if (slide)
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.changeBackground(s, { type: 'color', value: color }) : s
          );
        return;
      }

      if (act === 'TEXT_BOLD' && slide && elId) {
        state.presentation.slides = state.presentation.slides.map((s) =>
          s.id === slide.id
            ? {
                ...s,
                elements: s.elements.map((el) =>
                  el.id === elId && el.type === 'text' ? { ...el, bold: !el.bold } : el
                ),
              }
            : s
        );
        return;
      }

      if (act === 'TEXT_ITALIC' && slide && elId) {
        state.presentation.slides = state.presentation.slides.map((s) =>
          s.id === slide.id
            ? {
                ...s,
                elements: s.elements.map((el) =>
                  el.id === elId && el.type === 'text' ? { ...el, italic: !el.italic } : el
                ),
              }
            : s
        );
        return;
      }

      if (act === 'TEXT_UNDERLINE' && slide && elId) {
        state.presentation.slides = state.presentation.slides.map((s) =>
          s.id === slide.id
            ? {
                ...s,
                elements: s.elements.map((el) =>
                  el.id === elId && el.type === 'text' ? { ...el, underline: !el.underline } : el
                ),
              }
            : s
        );
        return;
      }

      switch (act) {
        case 'REMOVE_SLIDE':
          if (slideId) {
            state.presentation = func.removeSlide(state.presentation, slideId);
            state.selectedSlideId = state.presentation.slides[0]?.id || '';
            state.selectedSlideIds = state.presentation.slides[0]
              ? [state.presentation.slides[0].id]
              : [];
            state.selectedElementId = '';
          }
          break;

        case 'ADD_TEXT':
          if (slide) {
            state.presentation.slides = state.presentation.slides.map((s) =>
              s.id === slide.id ? func.addText(s, temp.createTextElement()) : s
            );
          }
          break;

        case 'ADD_IMAGE':
          if (slide) {
            state.presentation.slides = state.presentation.slides.map((s) =>
              s.id === slide.id ? func.addImage(s, temp.createImageElement()) : s
            );
          }
          break;

        case 'REMOVE_ELEMENT':
          if (slide && elId) {
            state.presentation.slides = state.presentation.slides.map((s) =>
              s.id === slide.id ? func.removeElement(s, elId) : s
            );
            state.selectedElementId = '';
          }
          break;
      }
    },
  },
});

export const {
  selectSlide,
  selectSlides,
  selectElement,
  updateSlide,
  updateTextContent,
  addSlide,
  removeSlide,
  reorderSlides,
  changeTitle,
  changeBackground,
  handleAction,
} = editorSlice.actions;

export default editorSlice.reducer;
