import titlePreview from '../assets/title-preview.png';
import titleObjectPreview from '../assets/title-object-preview.png';
import sectionPreview from '../assets/section-preview.png';
import twoObjectsPreview from '../assets/two-objects-preview.png';
import comparisonPreview from '../assets/comparison-preview.png';
import titleOnlyPreview from '../assets/title-only-preview.png';
import blankPreview from '../assets/blank-preview.png';
import objectCaptionPreview from '../assets/object-caption-preview.png';
import imageCaptionPreview from '../assets/image-caption-preview.png';

export interface Template {
  label: string;
  key: string;
  preview: string;
}

export const TEMPLATES: Template[] = [
  {
    label: '🏆 Титульный слайд',
    key: 'Добавить Титульный слайд',
    preview: titlePreview,
  },
  {
    label: '🧩 Заголовок и объект',
    key: 'Добавить Заголовок и объект',
    preview: titleObjectPreview,
  },
  {
    label: '🏞️ Заголовок раздела',
    key: 'Добавить Заголовок раздела',
    preview: sectionPreview,
  },
  {
    label: '💼 Два объекта',
    key: 'Добавить Два объекта',
    preview: twoObjectsPreview,
  },
  {
    label: '⚖️ Сравнение',
    key: 'Добавить Сравнение',
    preview: comparisonPreview,
  },
  {
    label: '📰 Только заголовок',
    key: 'Добавить Только заголовок',
    preview: titleOnlyPreview,
  },
  {
    label: '📄 Пустой слайд',
    key: 'Добавить Пустой слайд',
    preview: blankPreview,
  },
  {
    label: '🖋️ Объект с подписью',
    key: 'Добавить Объект с подписью',
    preview: objectCaptionPreview,
  },
  {
    label: '🌈 Рисунок с подписью',
    key: 'Добавить Рисунок с подписью',
    preview: imageCaptionPreview,
  },
];
