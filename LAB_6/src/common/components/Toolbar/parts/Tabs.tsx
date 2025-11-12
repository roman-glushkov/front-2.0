import React from 'react';
import { GroupKey } from '../hooks/useState';
import { TAB_TITLES } from '../constants/config';

interface Props {
  activeGroup: GroupKey;
  setActiveGroup: (g: GroupKey) => void;
  resetPopups: () => void;
}

export default function ToolbarTabs({ activeGroup, setActiveGroup, resetPopups }: Props) {
  return (
    <div className="toolbar-tabs">
      {TAB_TITLES.map(({ key, name }) => (
        <button
          key={key}
          className={`toolbar-tab ${activeGroup === key ? 'active' : ''}`}
          onClick={() => {
            setActiveGroup(key);
            resetPopups();
          }}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
