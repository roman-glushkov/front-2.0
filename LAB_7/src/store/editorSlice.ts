// src/store/editorSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Presentation, Slide, Background } from './types/presentation';
import * as func from './functions/presentation';
import * as temp from './templates/presentation';
import * as sld from './templates/slide';
import { demoPresentation } from './templates/demoPresentation';

const initialPresentation: Presentation = {
  title: 'Новая презентация',
  slides: [sld.slideTitle],
  currentSlideId: 'slide1',
  selectedSlideIds: ['slide1'],
};

export interface EditorSnapshot {
  presentation: Presentation;
  selectedSlideId: string;
  selectedSlideIds: string[];
  selectedElementIds: string[];
}

export interface EditorState {
  presentation: Presentation;
  selectedSlideId: string;
  selectedSlideIds: string[];
  selectedElementIds: string[];
  slides: Slide[];

  // история для undo/redo
  history: {
    past: EditorSnapshot[];
    future: EditorSnapshot[];
    maxItems: number;
  };
}

const initialState: EditorState = {
  presentation: initialPresentation,
  selectedSlideId: 'slide1',
  selectedSlideIds: ['slide1'],
  selectedElementIds: [],
  slides: initialPresentation.slides,
  history: {
    past: [],
    future: [],
    maxItems: 100, // ограничение длины истории
  },
};

function makeSnapshot(state: EditorState): EditorSnapshot {
  // NOTE: presentation и массивы — иммутабельны в вашей реализации,
  // поэтому можно хранить ссылку; если где-то всё-таки мутируются объекты,
  // можно глубже копировать. Здесь считаем структуру иммутабельной.
  return {
    presentation: state.presentation,
    selectedSlideId: state.selectedSlideId,
    selectedSlideIds: [...state.selectedSlideIds],
    selectedElementIds: [...state.selectedElementIds],
  };
}

function pushToPast(state: EditorState) {
  const snap = makeSnapshot(state);
  state.history.past.push(snap);
  // тримим по maxItems
  if (state.history.past.length > state.history.maxItems) {
    state.history.past.shift();
  }
  // новая правка обнуляет future
  state.history.future = [];
}

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    // ---------- selection reducers (не коммитим историю) ----------
    selectSlide(state, action: PayloadAction<string>) {
      state.selectedSlideId = action.payload;
      state.selectedSlideIds = [action.payload];
      state.selectedElementIds = [];
    },

    selectSlides(state, action: PayloadAction<string[]>) {
      if (action.payload.length > 0) {
        state.selectedSlideIds = action.payload;
        state.selectedSlideId = action.payload[0];
        state.selectedElementIds = [];
      }
    },

    selectElement(state, action: PayloadAction<string>) {
      state.selectedElementIds = [action.payload];
    },

    selectMultipleElements(state, action: PayloadAction<string[]>) {
      state.selectedElementIds = action.payload;
    },

    addToSelection(state, action: PayloadAction<string>) {
      if (!state.selectedElementIds.includes(action.payload)) {
        state.selectedElementIds.push(action.payload);
      }
    },

    removeFromSelection(state, action: PayloadAction<string>) {
      state.selectedElementIds = state.selectedElementIds.filter((id) => id !== action.payload);
    },

    clearSelection(state) {
      state.selectedElementIds = [];
    },

    // ---------- actions that change presentation: before mutating — сохраняем в историю ----------
    loadDemoPresentation: (state) => {
      pushToPast(state);
      state.presentation = demoPresentation;
      state.selectedSlideId = demoPresentation.slides[0]?.id || '';
      state.selectedSlideIds = demoPresentation.slides[0] ? [demoPresentation.slides[0].id] : [];
      state.selectedElementIds = [];
    },

    updateSlide(state, action: PayloadAction<(s: Slide) => Slide>) {
      pushToPast(state);
      const slideId = state.selectedSlideId;
      const slide = state.presentation.slides.find((s) => s.id === slideId);
      if (!slide) return;
      state.presentation.slides = state.presentation.slides.map((s) =>
        s.id === slideId ? action.payload(s) : s
      );
    },

    updateTextContent(state, action: PayloadAction<{ elementId: string; content: string }>) {
      pushToPast(state);
      const { elementId, content } = action.payload;
      const slideId = state.selectedSlideId;
      const slide = state.presentation.slides.find((s) => s.id === slideId);
      if (!slide) return;
      state.presentation.slides = state.presentation.slides.map((s) =>
        s.id === slideId ? func.changeText(s, elementId, content) : s
      );
    },

    addSlide(state, action: PayloadAction<Slide>) {
      pushToPast(state);
      state.presentation = func.addSlide(state.presentation, action.payload);
      state.selectedSlideId = action.payload.id;
      state.selectedSlideIds = [action.payload.id];
      state.selectedElementIds = [];
    },

    removeSlide(state, action: PayloadAction<string>) {
      pushToPast(state);
      state.presentation = func.removeSlide(state.presentation, action.payload);
      state.selectedSlideId = state.presentation.slides[0]?.id || '';
      state.selectedSlideIds = state.presentation.slides[0]
        ? [state.presentation.slides[0].id]
        : [];
      state.selectedElementIds = [];
    },

    reorderSlides(state, action: PayloadAction<Slide[]>) {
      pushToPast(state);
      state.presentation.slides = action.payload;
    },

    changeTitle(state, action: PayloadAction<string>) {
      pushToPast(state);
      state.presentation.title = action.payload;
    },

    changeBackground(state, action: PayloadAction<Background>) {
      pushToPast(state);
      const slide = state.presentation.slides.find((s) => s.id === state.selectedSlideId);
      if (!slide) return;
      state.presentation.slides = state.presentation.slides.map((s) =>
        s.id === slide.id ? func.changeBackground(s, action.payload) : s
      );
    },

    addImageWithUrl(state, action: PayloadAction<string>) {
      pushToPast(state);
      const slide = state.presentation.slides.find((s) => s.id === state.selectedSlideId);
      if (!slide) return;

      const imageElement = {
        ...temp.createImageElement(),
        src: action.payload,
        id: `image-${Date.now()}`,
      };

      state.presentation.slides = state.presentation.slides.map((s) =>
        s.id === slide.id ? func.addImage(s, imageElement) : s
      );
    },

    handleAction(state, action: PayloadAction<string>) {
      const act = action.payload;
      const slideId = state.selectedSlideId;
      const slide = state.presentation.slides.find((s) => s.id === slideId);
      const elId = state.selectedElementIds[0];
      // для большинства действий фиксируем историю (если это действие меняет презентацию)
      // простая эвристика: фиксируем всегда до обработки (можно оптимизировать)
      pushToPast(state);

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
        state.selectedElementIds = [];
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
            state.selectedElementIds = [];
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
            state.selectedElementIds = state.selectedElementIds.filter((id) => id !== elId);
          }
          break;
      }
    },

    // ---------- undo / redo ----------
    undo(state) {
      const past = state.history.past;
      if (past.length === 0) return;
      const last = past.pop()!; // взять последний snapshot
      // текущий в future
      const currentSnap = makeSnapshot(state);
      state.history.future.push(currentSnap);

      // восстановить
      state.presentation = last.presentation;
      state.selectedSlideId = last.selectedSlideId;
      state.selectedSlideIds = [...last.selectedSlideIds];
      state.selectedElementIds = [...last.selectedElementIds];
    },

    redo(state) {
      const future = state.history.future;
      if (future.length === 0) return;
      const next = future.pop()!;
      // текущий в past
      const currentSnap = makeSnapshot(state);
      state.history.past.push(currentSnap);

      // восстановить
      state.presentation = next.presentation;
      state.selectedSlideId = next.selectedSlideId;
      state.selectedSlideIds = [...next.selectedSlideIds];
      state.selectedElementIds = [...next.selectedElementIds];
    },
  },
});

export const {
  selectSlide,
  selectSlides,
  selectElement,
  selectMultipleElements,
  addToSelection,
  removeFromSelection,
  clearSelection,
  updateSlide,
  updateTextContent,
  addSlide,
  removeSlide,
  reorderSlides,
  changeTitle,
  changeBackground,
  handleAction,
  loadDemoPresentation,
  addImageWithUrl,
  undo,
  redo,
} = editorSlice.actions;

export default editorSlice.reducer;
