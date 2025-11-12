import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import {
  selectSlide,
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
  const selElId = useSelector((state: RootState) => state.editor.selectedElementId);
  const slide = pres.slides.find((s) => s.id === selSlideId);

  const onAction = (action: string) => dispatch(handleAction(action));
  const onSlideClick = (id: string) => dispatch(selectSlide(id));

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
          selectedSlideIds={[selSlideId]}
          setSelectedSlideId={() => {}}
          setSelectedSlideIds={() => {}}
          onSlideClick={onSlideClick}
          onSlidesReorder={(newOrder) => dispatch(reorderSlides(newOrder))}
        />
        <Workspace
          slide={slide}
          selElId={selElId}
          onElementClick={(id) => dispatch(selectElement(id))}
          setSelElId={(id) => dispatch(selectElement(id))}
          updateSlide={(fn) => dispatch(updateSlide(fn))}
          handleTextChange={() => {}}
          handleTextCommit={() => {}}
          handleTextKeyDown={() => {}}
        />
      </div>
    </div>
  );
}

export default App;
