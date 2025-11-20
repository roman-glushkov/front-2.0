import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { selectElement, updateSlide } from './store/editorSlice';
import ProjectTitle from './common/components/ProjectTitle';
import Toolbar from './common/components/Toolbar';
import SlidesPanel from './common/components/SlidesPanel';
import Workspace from './common/components/Workspace';
import './common/view/styles.css';

function App() {
  const dispatch = useDispatch();
  const selSlideId = useSelector((state: RootState) => state.editor.selectedSlideId);
  const pres = useSelector((state: RootState) => state.editor.presentation);
  const selElId = useSelector((state: RootState) => state.editor.selectedElementId);
  const slide = pres.slides.find((s) => s.id === selSlideId);

  return (
    <div className="container">
      <ProjectTitle />
      <Toolbar />
      <div className="main-content">
        <SlidesPanel />
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
