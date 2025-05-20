// reference: https://chatgpt.com/c/2c281b98-1339-41d3-993d-fc2a3496d02e

import React, { useState } from 'react';
import styled from 'styled-components';

// Container for each node
const TreeNodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 10px;
`;

// Label for the node
const TreeNodeLabel = styled.div`
  cursor: pointer;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

// Container for branches (left, middle, right)
const BranchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  position: relative;
  width: 100%;
`;

// Styled lines for three branches (left, middle, right)
const BranchLine = styled.div`
  position: absolute;
  width: 50px;
  height: 2px;
  background-color: #ccc;

  ${({ branchPosition }) => branchPosition === 'left' && `
    left: 0;
    transform: translateX(-50%);
  `}
  ${({ branchPosition }) => branchPosition === 'middle' && `
    left: 50%;
    transform: translateX(-50%);
  `}
  ${({ branchPosition }) => branchPosition === 'right' && `
    right: 0;
    transform: translateX(50%);
  `}
`;

// Child nodes container (for nested nodes)
const TreeNodeChildren = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
`;

const TreeView = ({ nodes }) => {
  const [expandedNodes, setExpandedNodes] = useState([]);

  const toggleNode = (id) => {
    setExpandedNodes((prev) =>
      prev.includes(id) ? prev.filter((nodeId) => nodeId !== id) : [...prev, id]
    );
  };

  const renderNode = (node) => {
    const isExpanded = expandedNodes.includes(node.id);
    return (
      <TreeNodeContainer key={node.id}>
        <TreeNodeLabel onClick={() => toggleNode(node.id)}>
          {node.label}
        </TreeNodeLabel>

        {node.children && (
          <BranchContainer>
            <BranchLine branchPosition="left" />
            <BranchLine branchPosition="middle" />
            <BranchLine branchPosition="right" />
          </BranchContainer>
        )}

        {isExpanded && node.children && (
          <TreeNodeChildren>
            {node.children.map((childNode) => (
              <div key={childNode.id} style={{ flex: 1 }}>
                {renderNode(childNode)}
              </div>
            ))}
          </TreeNodeChildren>
        )}
      </TreeNodeContainer>
    );
  };

  return <div>{nodes.map((node) => renderNode(node))}</div>;
};

export default TreeView;
