import { useEffect } from 'react';
import { useAppDispatch } from '../../../../store/hooks';
import { undo, redo } from '../../../../store/editorSlice';

export default function useUndoRedoHotkeys() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');

      const ctrl = isMac ? e.metaKey : e.ctrlKey;

      // Undo
      if (ctrl && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        dispatch(undo());
        return;
      }

      // Redo (Ctrl+Shift+Z — macOS стандарт)
      if (ctrl && e.key.toLowerCase() === 'z' && e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        dispatch(redo());
        return;
      }

      // Redo (Ctrl+Y — Windows стандарт)
      if (ctrl && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        e.stopPropagation();
        dispatch(redo());
        return;
      }
    };

    // обязательно keydown — не keyup
    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [dispatch]);
}
