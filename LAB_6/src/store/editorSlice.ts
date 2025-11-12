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
  selectedElementId: string;
}

const initialState: EditorState = {
  presentation: initialPresentation,
  selectedSlideId: 'slide1',
  selectedElementId: '',
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    selectSlide(state, action: PayloadAction<string>) {
      console.log('ID слайда:', action.payload);
      state.selectedSlideId = action.payload;
      state.selectedElementId = '';
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

    addSlide(state, action: PayloadAction<Slide>) {
      console.log('Добавлен слайд:', action.payload.id);
      state.presentation = func.addSlide(state.presentation, action.payload);
      state.selectedSlideId = action.payload.id;
    },

    removeSlide(state, action: PayloadAction<string>) {
      console.log('Удалён слайд:', action.payload);
      state.presentation = func.removeSlide(state.presentation, action.payload);
      state.selectedSlideId = state.presentation.slides[0]?.id || '';
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
      const slide = state.presentation.slides.find(
        (s) => s.id === state.selectedSlideId
      );
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
        'Добавить Титульный слайд': sld.slideTitle,
        'Добавить Заголовок и объект': sld.slideTitleAndObject,
        'Добавить Заголовок раздела': sld.slideSectionHeader,
        'Добавить Два объекта': sld.slideTwoObjects,
        'Добавить Сравнение': sld.slideComparison,
        'Добавить Только заголовок': sld.slideJustHeadline,
        'Добавить Пустой слайд': sld.slideEmpty,
        'Добавить Объект с подписью': sld.slideObjectWithSignature,
        'Добавить Рисунок с подписью': sld.slideDrawingWithCaption,
      };

      if (slideMap[act]) {
        const newSlide = { ...slideMap[act], id: `slide${Date.now()}` };
        state.presentation = func.addSlide(state.presentation, newSlide);
        state.selectedSlideId = newSlide.id;
        return;
      }

      if (act.startsWith('Изменить размер текста:')) {
        const size = parseInt(act.split(':')[1].trim(), 10);
        if (slide && elId)
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.changeTextSize(s, elId, size) : s
          );
        return;
      }

      if (act.startsWith('Изменить горизонтальное выравнивание текста:')) {
        const align = act.split(':')[1].trim() as 'left' | 'center' | 'right' | 'justify';
        if (slide && elId)
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.changeTextAlignment(s, elId, align) : s
          );
        return;
      }

      if (act.startsWith('Изменить вертикальное выравнивание текста:')) {
        const vAlign = act.split(':')[1].trim() as 'top' | 'middle' | 'bottom';
        if (slide && elId)
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id
              ? func.changeTextVerticalAlignment(s, elId, vAlign)
              : s
          );
        return;
      }

      if (act.startsWith('Изменить межстрочный интервал:')) {
        const lineHeight = parseFloat(act.split(':')[1].trim());
        if (slide && elId)
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.changeTextLineHeight(s, elId, lineHeight) : s
          );
        return;
      }

      if (act.startsWith('Изменить цвет текста:')) {
        const color = act.split(':')[1].trim();
        if (slide && elId)
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.changeTextColor(s, elId, color) : s
          );
        return;
      }

      if (act.startsWith('Изменить фон текста:')) {
        const color = act.split(':')[1].trim();
        if (slide && elId)
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id
              ? func.changeTextBackgroundColor(s, elId, color)
              : s
          );
        return;
      }

      if (act.startsWith('Изменить фон слайда:')) {
        const color = act.split(': ')[1];
        if (slide)
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id
              ? func.changeBackground(s, { type: 'color', value: color })
              : s
          );
        return;
      }
      
      if (act === 'toggle-bold' && slide && elId) {
        state.presentation.slides = state.presentation.slides.map((s) =>
          s.id === slide.id
            ? {
                ...s,
                elements: s.elements.map((el) =>
                  el.id === elId && el.type === 'text'
                    ? { ...el, bold: !el.bold }
                    : el
                ),
              }
            : s
        );
        return;
      }

      if (act === 'toggle-italic' && slide && elId) {
        state.presentation.slides = state.presentation.slides.map((s) =>
          s.id === slide.id
            ? {
                ...s,
                elements: s.elements.map((el) =>
                  el.id === elId && el.type === 'text'
                    ? { ...el, italic: !el.italic }
                    : el
                ),
              }
            : s
        );
        return;
      }

      if (act === 'toggle-underline' && slide && elId) {
        state.presentation.slides = state.presentation.slides.map((s) =>
          s.id === slide.id
            ? {
                ...s,
                elements: s.elements.map((el) =>
                  el.id === elId && el.type === 'text'
                    ? { ...el, underline: !el.underline }
                    : el
                ),
              }
            : s
        );
        return;
      }

      switch (act) {
        case 'Удалить слайд':
          if (slideId) {
            state.presentation = func.removeSlide(state.presentation, slideId);
            state.selectedSlideId = state.presentation.slides[0]?.id || '';
            state.selectedElementId = '';
          }
          break;

        case 'Добавить текст':
          if (slide) {
            state.presentation.slides = state.presentation.slides.map((s) =>
              s.id === slide.id ? func.addText(s, temp.createTextElement()) : s
            );
          }
          break;

        case 'Добавить изображение':
          if (slide) {
            state.presentation.slides = state.presentation.slides.map((s) =>
              s.id === slide.id ? func.addImage(s, temp.createImageElement()) : s
            );
          }
          break;

        case 'Удалить элемент':
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
  selectElement,
  updateSlide,
  addSlide,
  removeSlide,
  reorderSlides,
  changeTitle,
  changeBackground,
  handleAction,
} = editorSlice.actions;

export default editorSlice.reducer;
