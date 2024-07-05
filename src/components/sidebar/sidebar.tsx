import React, { useState, HTMLAttributes as Atts } from 'react';
import './sidebar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { MyFile } from '../Ide';

interface TreeNodeProps {
  name: string;
  children?: any;
  onClick?: (file: MyFile) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ name, children, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleClick = (file?: MyFile) => {
    if (onClick && file) {
      onClick(file);
    }
  };

  const hasChildren = children && typeof children === 'object' && Object.keys(children).length > 0;

  return (
    <div style={{ paddingLeft: '20px' }}>
      <div onClick={() => { toggleExpand(); handleClick(children); }} style={{ cursor: 'pointer' }}>
        {hasChildren ? (
          <>
            <i className={`bi ${isExpanded ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
            {name}
          </>
        ) : (
          <>
            <i className="bi bi-file-earmark"></i>
            {name}
          </>
        )}
      </div>
      {isExpanded && hasChildren && (
        <div>
          {Object.keys(children).map(childName => (
            <TreeNode key={childName} name={childName} children={children[childName]} onClick={onClick} />
          ))}
        </div>
      )}
    </div>
  );
};

export interface TreeData {
  [key: string]: any;
}

declare module "react" {
  interface InputHTMLAttributes<T> extends Atts<T> {
      webkitdirectory?: string;
      directory?: string;
  }
}

export const Sidebar = ({treeData, onFileClick }: 
  { treeData: TreeData; onFileClick: (file: MyFile) => void }) => {
  return (
    <div className="sidebar">
      <div className="project_name">
        <h3>Project</h3>
        <div className="project_add">
          <label htmlFor="file"><i className="bi bi-file-earmark"></i></label>
          <label htmlFor="folder"><i className="bi bi-folder"></i></label>
        </div>
      </div>

      <div className="project_tree">
        {Object.keys(treeData).length > 0 && (
          <div>
            {Object.keys(treeData).map(node => (
              <TreeNode key={node} name={node} children={treeData[node]} onClick={onFileClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};