import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Хук для dispatch, чтобы правильно работали типы
export const useAppDispatch: () => AppDispatch = useDispatch;

// Хук для useSelector, чтобы были правильные типы состояния
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
