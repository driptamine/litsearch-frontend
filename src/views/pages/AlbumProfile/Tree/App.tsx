import React from 'react';
import TreeView from './TreeView';

const data = [
  {
    id: 1,
    label: 'Parent 1',
    children: [
      {
        id: 2,
        label: 'Child 1.1',
        children: [
          { id: 3, label: 'Grandchild 1.1.1' },
          { id: 4, label: 'Grandchild 1.1.2' },
          { id: 5, label: 'Grandchild 1.1.3' },
        ],
      },
      {
        id: 6,
        label: 'Child 1.2',
        children: [
          { id: 7, label: 'Grandchild 1.2.1' },
          { id: 8, label: 'Grandchild 1.2.2' },
          { id: 9, label: 'Grandchild 1.2.3' },
        ],
      },
    ],
  },
];

function App() {
  return (
    <div>
      <h1>Tree View with Three Branches</h1>
      <TreeView nodes={data} />
    </div>
  );
}

export default App;
