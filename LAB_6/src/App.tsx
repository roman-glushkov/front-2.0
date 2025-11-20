import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import {
  selectSlide,
  selectSlides, // ← добавь этот импорт
  selectElement,
  reorderSlides,
  changeTitle,
  handleAction,
  updateSlide,
} from './store/editorSlice';
import ProjectTitle from './common/components/ProjectTitle';
import Toolbar from './common/components/Toolbar';
import SlidesPanel from './common/components/SlidesPanel';
import Workspace from './common/components/Workspace';
import './common/view/styles.css';

function App() {
  const dispatch = useDispatch();
  const pres = useSelector((state: RootState) => state.editor.presentation);
  const selSlideId = useSelector((state: RootState) => state.editor.selectedSlideId);
  const selectedSlideIds = useSelector((state: RootState) => state.editor.selectedSlideIds); // ← добавь эту строку
  const selElId = useSelector((state: RootState) => state.editor.selectedElementId);
  const slide = pres.slides.find((s) => s.id === selSlideId);

  const onAction = (action: string) => dispatch(handleAction(action));

  const onSlideClick = (slideId: string, index: number, multi?: boolean) => {
    if (multi) {
      if (selectedSlideIds.includes(slideId)) {
        if (selectedSlideIds.length > 1) {
          dispatch(selectSlides(selectedSlideIds.filter((id) => id !== slideId)));
        }
      } else {
        dispatch(selectSlides([...selectedSlideIds, slideId]));
      }
    } else {
      dispatch(selectSlide(slideId));
    }
  };

  return (
    <div className="container">
      <ProjectTitle
        pres={pres}
        onTitleChange={(e) => dispatch(changeTitle(e.target.value))}
        onTitleCommit={() => {}}
        onTitleKeyDown={() => {}}
        selSlideId={selSlideId}
      />
      <Toolbar onAction={onAction} />
      <div className="main-content">
        <SlidesPanel
          slides={pres.slides}
          selectedSlideId={selSlideId}
          selectedSlideIds={selectedSlideIds} // ← используй переменную selectedSlideIds
          setSelectedSlideId={() => {}}
          setSelectedSlideIds={() => {}}
          onSlideClick={onSlideClick}
          onSlidesReorder={(newOrder) => {
            console.log(
              'New order:',
              newOrder.map((s) => s.id)
            );
            dispatch(reorderSlides(newOrder));
          }}
        />
        <Workspace
          slide={slide}
          selElId={selElId}
          onElementClick={(id) => dispatch(selectElement(id))}
          setSelElId={(id) => dispatch(selectElement(id))}
          updateSlide={(fn) => dispatch(updateSlide(fn))}
        />
      </div>
    </div>
  );
}

export default App;
